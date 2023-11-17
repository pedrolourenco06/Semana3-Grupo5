/* eslint-disable @typescript-eslint/no-explicit-any */
import userService from './UserService';
import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import {describe, expect, test} from '@jest/globals';
import { QueryError } from '../../../../errors/QueryError';
import { Roles } from '../../../middlewares/checkRole';
import { PermissionError } from '../../../../errors/PermissionError';
import bcrypt, { hash } from 'bcrypt';


jest.mock('bcrypt');
jest.mock('../../../middlewares/checkRole.ts');
jest.mock('../../../middlewares/userLogin.ts');
jest.mock('../../../middlewares/userLogout.ts');
jest.mock('../../../../config/client.ts',()=>({
	user:{
		create:jest.fn(),
		update:jest.fn(),
		delete:jest.fn(),
		findFirst:jest.fn(),
		findMany:jest.fn(),

	}
}));

describe('create', () => {
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	test('os dados do usuário são passados na entrada ==> cria o usuario com os dados corretos', async() => {
		const dadosUser = {
			email: 'teste@teste.com',
			name: 'teste',
			password: 'senhateste',
			photo: 'teste',
			role: 'roleteste'
		} as User;

		const createMock = jest.spyOn(prisma.user,'create').mockImplementation(
			()=>{
				return {} as any;
			}
		);

		await userService.create(dadosUser);

		expect(createMock).toHaveBeenCalledTimes(1);
		expect(createMock.mock.calls[0][0]).toEqual({
			data:{
				name: dadosUser.name,
				email: dadosUser.email,
				password: dadosUser.password,
				photo: dadosUser.photo,
				role: dadosUser.role
			}
		});

		


	});

	test('Não recebe um nome ==> retorna um erro de criação', async()=>{
		const userDados = {
			email: 'teste',
			password: 'teste',
			photo: 'teste',
			role: 'teste'
		} as User;

		
		return expect (
			async()=>{
				await userService.create(userDados);
			}
		).rejects.toThrowError(new QueryError ('O usuário precisa de um nome.'));
	});

	test('Não recebe uma senha ==> retorna um erro de criação', async()=>{
		const userDados = {
			email: 'teste',
			name: 'teste',
			photo: 'teste',
			role: 'teste'
		} as User;

		return expect (
			async()=>{
				await userService.create(userDados);
			}
		).rejects.toThrowError(new QueryError ('O usuário precisa de uma senha.'));
	});

});

describe('findByEmail', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('o sistema recebe um email ==> busca um usuário com o dado', async() => {
		const emailUsuario = 'teste@teste';

		const mockFindByEmail = jest.spyOn(prisma.user,'findFirst').mockImplementation(
			() => {
				return { email : emailUsuario} as any;
			}
		);

		await userService.findByEmail(emailUsuario);

		expect(mockFindByEmail).toHaveBeenCalledTimes(1);
		expect(mockFindByEmail.mock.calls[0][0]).toEqual({
			where:{
				email:emailUsuario
			},
			include:{
				music:{
					select:{
						music:true,
						musicId:false,
						userId:false
					}
				}
			}
		}
		);

	});

	test('o usuario não é encontrado ==> lança excessao', async() => {
		const email = 'teste@teste';

		jest.mocked(prisma).user.findFirst.mockImplementation(
			()=>{
				return undefined as any;
			}
		);
		return expect(async() => {
			await userService.findByEmail(email);
		}).rejects.toThrowError(new Error('Não existe um usuário com o email informado.'));
	});
});