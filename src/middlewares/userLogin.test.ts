/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@prisma/client";
import { generateJWT, loginMiddleware, verifyJWT } from "./userLogin";
import jwt, {JwtPayload} from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserService from "../domains/User/services/UserService";
import statusCodes from "../../utils/statusCodes";
import { PermissionError } from "../../errors/PermissionError";

jest.mock('bcrypt',()=>{
	return{
		compare: jest.fn(),
	};
});

jest.mock('jsonwebtoken',()=>{
	return{
		sign: jest.fn(),
		verify: jest.fn()
	};
});

jest.mock('../domains/User/services/UserService.ts',()=>{
	return{
		findByEmail : jest.fn()
	};
});


describe('generateJWT', ()=>{
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks;
	});

	test('Recebe um usuario => cria um json web token',()=>{
		const user = {
			email: 'Teste',
			name: 'Teste',
			role: 'Teste'
		} as User;

		const res = {
			cookie: jest.fn()
		} as any;

		jest.mocked(jwt).sign.mockImplementation(
			()=>{
				return {} as any;
			}
		);

		generateJWT(user, res);

		expect(res.cookie).toHaveBeenCalledWith('jwt',{},{
			httpOnly:true,
			secure: process.env.NODE_ENV !== 'development'
		});
	});
});

describe('loginMiddleware', ()=>{
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	test('Metodo recebe um pedido de login => loga o usuario', async()=>{
		
		const res = {
			cookie: jest.fn().mockReturnThis(),
			status: jest.fn().mockReturnThis()
		} as any;

		const req = {
			body: jest.fn().mockReturnThis(),
		} as any;

		const next = jest.fn();

		jest.mocked(UserService).findByEmail.mockImplementation(
			()=>{
				return {} as any;
			}
		);

		jest.mocked(bcrypt).compare.mockImplementation(
			()=>{
				return {} as any;
			}
		);

		jest.mocked(jwt).sign.mockImplementation(
			()=>{
				return {} as any;
			}
		);

		await loginMiddleware(req, res, next);

		expect(res.status).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(statusCodes.NO_CONTENT);
	});

	test('Usuario pedido não existe => Retorna erro', async()=>{
		const res = {
			cookie: jest.fn().mockReturnThis(),
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		} as any;

		const req = {
			body: jest.fn().mockReturnThis(),
		} as any;

		const next = jest.fn();

		jest.mocked(UserService).findByEmail.mockImplementation(
			()=>{
				return undefined as any;
			}
		);

		await loginMiddleware(req,res,next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith(new PermissionError('E-mail e/ou senha incorretos'))
		expect(res.status).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(statusCodes.UNAUTHORIZED);
		expect(res.json).toHaveBeenCalledWith('E-mail e/ou senha incorretos');
	});

	test('Metodo recebe senha incorreta => Retorna erro', async()=>{
		const res = {
			cookie: jest.fn().mockReturnThis(),
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		} as any;

		const req = {
			body: jest.fn().mockReturnThis(),
		} as any;

		const next = jest.fn();

		jest.mocked(UserService).findByEmail.mockImplementation(
			()=>{
				return {} as any;
			}
		);

		jest.mocked(bcrypt).compare.mockImplementation(
			()=>{
				return undefined as any;
			}
		);

		await loginMiddleware(req,res,next);
		
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith(new PermissionError('E-mail e/ou senha incorretos'))
		expect(res.status).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(statusCodes.UNAUTHORIZED);
		expect(res.json).toHaveBeenCalledWith('E-mail e/ou senha incorretos');
	});
});


describe('VerifyJWT', ()=>{
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	test('Metodo recebe um pedido => Verifica se usuario está logado', ()=>{
		const req = {
			user: jest.fn().mockReturnThis(),
			cookies: jest.fn().mockReturnThis()
		} as any;

		const next = jest.fn();

		
		verifyJWT(req, null as any, next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith();
	});

	test('O usuario não está logado', ()=>{
		const req = {
			user: undefined,
			cookies: jest.fn().mockReturnThis()
		} as any;

		const next = jest.fn();

		

		verifyJWT(req, null as any, next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith(new PermissionError('Você precisa estar logado para realizar essa ação'));
	});
});