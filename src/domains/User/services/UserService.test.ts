/* eslint-disable @typescript-eslint/no-explicit-any */
import userService from './UserService';
import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import {describe, expect, test} from '@jest/globals';
import { QueryError } from '../../../../errors/QueryError';
import { Roles } from "../../../middlewares/checkRole";
import { PermissionError } from "../../../../errors/PermissionError";
import bcrypt from 'bcrypt';
import { NotAuthorizedError } from '../../../../errors/NotAuthorizedError';


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
        findUnique:jest.fn(),

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

describe('update', () => {
    beforeEach(()=>{
        jest.resetAllMocks();
    });

    test('o usuario nao e admin e quer mudar sua propria role ==> lança excessao', async() => {
        const email = 'teste@teste',
            reqUserEmail = 'teste@teste',
            reqUserRole = 'user',
            body = {
                role: 'user',
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
        }).rejects.toThrow(new NotAuthorizedError('Você não tem autorização para mudar seu papel de usuário'));
    });

    test('metodo nao recebe um email ==> retorna um erro', async() => {
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

        jest.mocked(prisma).user.findUnique.mockImplementation(
            () => {
                return {} as any;
            }
        );

        return expect(async() => {
            await userService.update(updateUser, body);
        }).rejects.toThrowError(new QueryError('O usuario a ser atualizado precisa de um email'));
    });

    test('metodo nao recebe um nome ==> retorna um erro', async() => {
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

        jest.mocked(prisma).user.findUnique.mockImplementation(
            () => {
                return {} as any;
            }
        );

        return expect(async() => {
            await userService.update(updateUser, body);
        }).rejects.toThrowError(new QueryError('O usuario a ser atualizado precisa de um nome'));
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
                await userService.update(updateUser, body)
            }
        ).rejects.toThrowError(new QueryError('Não existe usuário com o email informado'))
        
    });
});

describe('delete', () => {
    beforeEach(()=>{
        jest.resetAllMocks();
    });

    test('recebe um usuário ==> deleta este', async() => {
        const user = {
            email: 'teste@teste',
            delete: () => { }
        };
        const body = {
            email: 'admin@teste',
            role: 'admin',
            password: 'teste',
            name: 'teste',
            photo: ''
        };

        await jest.mocked(prisma).user.findUnique.mockImplementation(
            () => {
                return user as any;
            }
        );

        const usuarioDeleteSpy = jest.spyOn(user, 'delete');

        await userService.delete(user.email, body);

        expect(usuarioDeleteSpy).toHaveBeenCalledTimes(1);
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

        return expect(async() => {
            await userService.delete(email, currentUser);
        }).rejects.toThrowError(new Error(`Não foi encontrado um usuário com o email: ${email}`));
    });

    test('o usuario nao tem permissão para deletar ==> retorna um erro', async() => {
        const email = 'test@teste';
        const currentUser = {
            email: 'admin@teste',
            role: 'user',
            password: 'teste',
            name: 'teste',
            photo: ''
        };

        return expect(async() => {
            await userService.delete(email, currentUser);
        }).rejects.toThrow(new NotAuthorizedError('Você não tem permissão para deletar este usuário'));
    });

});

describe('FindAllUsers', () => {

	beforeEach(() => {
		jest.resetAllMocks()
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
    ])('%j', async({usuarios}) => {
        jest.mocked(prisma).user.findMany.mockReturnValue(usuarios as any);

        const teste = await userService.read();
        expect(teste).toEqual(expect.arrayContaining(usuarios));
    });

});

describe('findUser', ()=>{
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks();
	});
    
    test('metodo recebe um user que não existe ==> retorna um erro', async() => {
        const userEmail = 'naoexiste@teste';

        jest.mocked(prisma).user.findUnique.mockImplementation(
            () => {
                return undefined as any;
            }
        );

        return expect (
            async() => {
                await userService.findByEmail(userEmail);
            }
        ).rejects.toThrowError(new QueryError(`Não existe um usuário com o email: ${userEmail}`));
    });

});

