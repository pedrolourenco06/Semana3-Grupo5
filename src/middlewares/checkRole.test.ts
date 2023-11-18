/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotAuthorizedError } from '../../errors/NotAuthorizedError';
import statusCodes from '../../utils/statusCodes';
import { checkRole, Roles } from './checkRole';

describe('CheckRole', ()=>{
	beforeEach(()=>{
		jest.resetAllMocks;
		jest.clearAllMocks;
	});

	test('Recebe um usuario logado => Checa a função dele', ()=>{

		const req = {
			user:{
				role: Roles.admin
			}
		} as any;

		const res = {
			status:jest.fn().mockReturnThis()
		} as any;

		const next = jest.fn();

		const checkRoleCallback = checkRole(Roles.admin);

		checkRoleCallback(req, res, next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith();
	});

	test('Recebe um Usuario logado com a função errada => Retorna erro', () =>{
		const req = {
			user:{
				role: Roles.user
			}
		} as any;

		const res = {
			status:jest.fn().mockReturnThis()
		} as any;

		const next = jest.fn();

		const checkRoleCallback = checkRole(Roles.admin);

		checkRoleCallback(req, res, next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(statusCodes.UNAUTHORIZED);
		expect(next).toHaveBeenCalledWith(new NotAuthorizedError('Você não tem autorização para isso!'));
	});
});