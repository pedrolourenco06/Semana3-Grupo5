/* eslint-disable @typescript-eslint/no-explicit-any */
import userService from './UserService';
import prisma from '../../../../config/client';
import { Music, User } from '@prisma/client';
import {describe, expect, test} from '@jest/globals';
import { QueryError } from '../../../../errors/QueryError';
import { PermissionError } from '../../../../errors/PermissionError';
import bcrypt from 'bcrypt';


jest.mock('bcrypt',()=>{
	return{
		hash:jest.fn()
	};
});
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
		findUnique:jest.fn(),

	},
	music:{
		findUnique: jest.fn()
	},
	playlist:{
		create:jest.fn(),
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

	test('Recebe um usuario com nome vazio => retorna um erro de criação', async()=>{
		const userDados = {
			email: 'teste',
			name:'',
			password:'teste',
			photo:'teste',
			role:'teste',
		};

		return expect(
			async()=>{
				await userService.create(userDados);
			}
		).rejects.toThrowError(new QueryError('O usuário precisa de um nome.'));
	});

	test('Recebe um numero no lugar do nome => retorna um erro de criação', async()=>{
		const userDados = {
			email: 'teste',
			name:'1',
			password:'teste',
			photo:'teste',
			role:'teste',
		};

		return expect(
			async()=>{
				await userService.create(userDados);
			}
		).rejects.toThrowError(new QueryError('O usuário precisa de um nome.'));
	});

	test('Recebe um email vazio => retorna um erro de crição',async()=>{
		const userDados = {
			email: '',
			name:'teste',
			password:'teste',
			photo:'teste',
			role:'teste',
		};

		return expect(
			async()=>{
				await userService.create(userDados);
			}
		).rejects.toThrowError(new QueryError('O usuário precisa de um email.'));
	});

	test('Recebe um numero no lugar do email => retorna um erro de criação', async()=>{
		const userDados = {
			email: '1',
			name:'teste',
			password:'teste',
			photo:'teste',
			role:'teste',
		};

		return expect(
			async()=>{
				await userService.create(userDados);
			}
		).rejects.toThrowError(new QueryError('O usuário precisa de um email.'));
	});

	test('Recebe um email inexistente => retorna um erro de criação', async()=>{
		const userDados = {
			name:'teste',
			password:'teste',
			photo:'teste',
			role:'teste',
		} as User;

		return expect(
			async()=>{
				await userService.create(userDados);
			}
		).rejects.toThrowError(new QueryError('O usuário precisa de um email.'));
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

	test('Recebe uma senha vazia => retorna um erro de criação', async()=>{
		const userDados = {
			email: 'teste',
			name:'teste',
			password:'',
			photo:'teste',
			role:'teste',
		};

		return expect(
			async()=>{
				await userService.create(userDados);
			}
		).rejects.toThrowError(new QueryError('O usuário precisa de uma senha.'));
	});
});

describe('findByEmail', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.clearAllMocks();
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

describe('update', () => {
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	test('O sistema recebe um usuario => atualiza as informações desse usuario', async()=>{
		const body = {
			email: 'teste@teste',
			name: 'teste',
			password: 'teste',
			photo: 'teste',
		}as User;

		jest.mocked(prisma).user.findFirst.mockImplementation(
			()=>{
				return {} as any;
			}
		);

		const updateMock = jest.spyOn(prisma.user, 'update').mockImplementation(
			()=>{
				return {} as any;
			}
		);

		await userService.update(body, body);

		expect(updateMock).toHaveBeenCalledTimes(1);
		expect(updateMock.mock.calls[0][0]).toEqual({
			where:{
				email:body.email,
			},
			data:{
				name:body.name,
				password:body.password,
				photo:body.photo,
				role:body.role
			}
		});
	});
	
	test('o usuario nao e admin e quer mudar sua propria role ==> lança excessao', async() => {
		const body = {
			role: 'USER',
			email: 'teste@teste',
			name: 'teste',
			password: 'teste',
			photo: 'teste'
		};
		

		jest.mocked(prisma).user.findFirst.mockImplementation(
			() => {
				return {} as any;
			}
		);

		return expect(async() => {
			await userService.update(body, body);
		}).rejects.toThrow(new PermissionError('Você não tem permissão para realizar essa ação.'));
	});

	test('metodo recebe um email vazio ==> retorna um erro', async() => {
		const updateUser = {
			role: 'teste',
			name: 'teste',
			email: '',
			password: 'teste',
			photo: 'teste'
		};

		const body = {
			role: 'teste',
			name: 'teste',
			email: 'teste@teste',
			password: 'teste',
			photo: ''
		};

		jest.mocked(prisma).user.findFirst.mockImplementation(
			() => {
				return {} as any;
			}
		);

		return expect(async() => {
			await userService.update(updateUser, body);
		}).rejects.toThrowError(new QueryError('O usuário precisa de um email.'));
	});

	test('metodo recebe um nome vazio ==> retorna um erro', async() => {
		const updateUser = {
			role: 'teste',
			name: '',
			email: 'teste@teste',
			password: 'teste',
			photo: 'teste'
		};

		const body = {
			role: 'teste',
			name: 'teste',
			email: 'teste@teste',
			password: 'teste',
			photo: ''
		};

		jest.mocked(prisma).user.findFirst.mockImplementation(
			() => {
				return {} as any;
			}
		);

		return expect(async() => {
			await userService.update(updateUser, body);
		}).rejects.toThrowError(new QueryError('O usuário precisa de um nome.'));
	});

	test('metodo recebe uma senha vazia => retorna um erro', async()=>{
		const updateUser = {
			role: 'teste',
			name: 'teste',
			email: 'teste@teste',
			password: '',
			photo: 'teste'
		};

		const body = {
			role: 'teste',
			name: 'teste',
			email: 'teste@teste',
			password: 'teste',
			photo: ''
		};

		jest.mocked(prisma).user.findFirst.mockImplementation(
			() => {
				return {} as any;
			}
		);

		return expect(async() => {
			await userService.update(updateUser, body);
		}).rejects.toThrowError(new QueryError('O usuário precisa de uma senha.'));
	});


	test('metodo recebe um usuario inexistente ==> retorna um erro', async() => {
		const updateUser = {
			email: 'naoexiste@teste',
			name: 'teste',
			photo: '',
			password: 'teste',
			role: 'teste'
		};
		const body = {
			email: 'teste@teste',
			name: 'teste',
			photo: 'teste',
			password: 'teste',
			role: 'teste'
		};

		await jest.mocked(prisma).user.findUnique.mockImplementation(
			() => {
				return undefined as any;
			}
		);

		return expect(
			async() => {
				await userService.update(updateUser, body);
			}
		).rejects.toThrowError(new QueryError('Não existe um usuário com o email informado.'));
		
	});
});

describe('delete', () => {
	beforeEach(()=>{
		jest.resetAllMocks();
	});

	
	test.each([
		{
			body:
				{
					
					email: 'admin@teste',
					role: 'ADMIN',
					password: 'teste',
					name: 'teste',
					photo: ''
					
				}
		},
		{
			body:
				{
					
					email: 'teste@teste',
					role: 'USER',
					password: 'teste',
					name: 'teste',
					photo: ''
					
				}
		},
	])('%j recebe um usuário ==> deleta este', async({body}) => {
		const user = {
			email: 'teste@teste'
		};



		jest.mocked(prisma).user.findFirst.mockImplementation(
			() => {
				return {} as any;
			}
		);

		const usuarioDeleteSpy = jest.spyOn(prisma.user, 'delete');

		await userService.delete(user.email, body);

		expect(usuarioDeleteSpy).toHaveBeenCalledTimes(1);
		expect(usuarioDeleteSpy.mock.calls[0][0]).toEqual({
			where:{
				email:user.email
			}
		});
	});

	test('o usuario nao é encontrado ==> retorna um erro', async() => {
		const email = 'naoexiste@teste';
		const currentUser = {
			email: 'admin@teste',
			role: 'admin',
			password: 'teste',
			name: 'teste',
			photo: ''
		};


		jest.mocked(prisma).user.findFirst.mockImplementation(
			()=>{
				return undefined as any;
			}
		);

		return expect(async() => {
			await userService.delete(email, currentUser);
		}).rejects.toThrowError(new QueryError('Não existe um usuário com o email informado.'));
	});

	test('o usuario nao tem permissão para deletar ==> retorna um erro', async() => {
		const email = 'test@teste';
		const currentUser = {
			email: 'admin@teste',
			role: 'USER',
			password: 'teste',
			name: 'teste',
			photo: ''
		};

		jest.mocked(prisma).user.findFirst.mockImplementation(
			()=>{
				return {} as any;
			}
		);

		return expect(async() => {
			await userService.delete(email, currentUser);
		}).rejects.toThrow(new PermissionError('Você não tem permissão para realizar essa ação'));
	});

});

describe('FindAllUsers', () => {

	beforeEach(() => {
		jest.resetAllMocks();
	});

	test.each([
		{
			usuarios: [
				{
					name: 'pedro'
				},
				{
					name : 'jose'
				},
				{
					name: 'luis'
				}
			]
		}
	])('%j Recebe pedido para mostrar todos os usuários => envia uma array de usuarios ', async({usuarios}) => {
		jest.mocked(prisma).user.findMany.mockReturnValue(usuarios as any);

		const teste = await userService.read();
		expect(teste).toEqual(expect.arrayContaining(usuarios));
	});

});

describe('encryptPassword', ()=>{
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	test('Metodo recebe uma senha => retorna uma senha encriptada', async()=>{
		const dadosUser = {
			id:10,
			password:'12345',
			name:'teste'
		};

		const bcryptMock = jest.spyOn(bcrypt, 'hash').mockImplementation(
			()=>{
				return {} as any;
			}
		);

		await userService.encryptPassword(dadosUser.password);

		expect(bcryptMock.mock.calls[0][0]).toEqual(dadosUser.password);
	});
});



describe('createPlaylist', ()=>{
	beforeEach(()=>{
		jest.resetAllMocks;
		jest.clearAllMocks;
	});
	
	test('Metodo recebe um id de usuario e um de musica => Faz relação entre os dois', async()=>{
		const userEmail = 'teste@teste';
		const musicId = 1;
		jest.mocked(prisma).user.findFirst.mockImplementation(
			()=>{
				return {} as any;
			}
		);

		jest.mocked(prisma).music.findUnique.mockImplementation(
			()=>{
				return {} as any;
			}
		);
		
		const createPlaylistMock = jest.spyOn(prisma.playlist, 'create').mockImplementation(
			()=> {
				return {} as any;
			}
		);

		await userService.createPlaylist(musicId, userEmail);

		expect(createPlaylistMock).toHaveBeenCalledTimes(1);
		expect(createPlaylistMock.mock.calls[0][0]).toEqual({
			data:{
				musicId: musicId,
				userId: userEmail,
			}
		});
	});


	test('Metodo não recebe um email => retorna um erro', async()=>{
		const user = {} as User;
		const id = 1;
		return expect(async()=>{
			await userService.createPlaylist(id, user.email);

		}).rejects.toThrowError(new QueryError('O email deve ser uma string'));

	});

	test('Metodo não recebe um id => retorna um erro', async()=>{
		const email = 'teste@teste';
		const id = {} as Music;
		return expect(async()=>{
			await userService.createPlaylist(id.id, email);

		}).rejects.toThrowError(new QueryError('O id deve ser um número'));

	});

	test('Metodo recebe um id como string => retorna um erro', async()=>{
		const email = 'teste@teste';
		const id = '';
		return expect(async()=>{
			await userService.createPlaylist(id, email);

		}).rejects.toThrowError(new QueryError('O id deve ser um número'));

	});

	test('Metodo recebe um id igual a 0 => retorna um erro', async()=>{
		const email = 'teste@teste';
		const id = 0;
		return expect(async()=>{
			await userService.createPlaylist(id, email);

		}).rejects.toThrowError(new QueryError('O id deve ser um número'));

	});

	test('Metodo recebe um email como numero => retorna um erro', async()=>{
		const email = '1';
		const id = 1;
		return expect(async()=>{
			await userService.createPlaylist(id, email);

		}).rejects.toThrowError(new QueryError('O email deve ser uma string'));

	});

	test('Metodo recebe um email vazio => retorna um erro', async()=>{
		const email = '';
		const id = 1;
		return expect(async()=>{
			await userService.createPlaylist(id, email);

		}).rejects.toThrowError(new QueryError('O email deve ser uma string'));

	});

	test('Metodo recebe um usuario inexistente => retorna um erro', async()=>{
		jest.mocked(prisma).user.findFirst.mockImplementation(
			()=>{
				return {} as any;
			}
		);
	});
});