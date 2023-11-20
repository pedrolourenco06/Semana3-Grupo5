/* eslint-disable @typescript-eslint/no-explicit-any */
import { PermissionError } from '../../errors/PermissionError';
import { logoutMiddleware } from './userLogout';




describe('Logout Middleware', ()=>{
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	test('Metodo recebe um cookie de login => deleta esse', ()=>{
		
		const next = jest.fn();

		const req = {
			user:jest.fn().mockReturnThis(),
		} as any;


		const res = {
			clearCookie:jest.fn().mockReturnThis(),
		} as any;


		logoutMiddleware(req, res, next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(res.clearCookie).toHaveBeenCalledWith('jwt');
	});

	test('Metodo não recebe um cookie de login => Retorna um erro', ()=>{
		const next = jest.fn();

		const req = {
			user: undefined
		} as any;

		const res = {
			clearCookie: jest.fn()
		} as any;

		logoutMiddleware(req,res,next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith(new PermissionError('Você precisa estar logado para realizar essa ação'));

	});
});