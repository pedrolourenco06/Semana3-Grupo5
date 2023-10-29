import { NotAuthorizedError } from '../../errors/NotAuthorizedError';
import { Request, Response, NextFunction } from 'express';
import statusCodes from '../../utils/statusCodes';

export enum Roles {
	admin = 'ADMIN',
	user = 'USER',
}

export function checkRole(role: Roles) {
	return (req: Request, res: Response, next: NextFunction) => {
		if(req.user.role != role) {
			res.status(statusCodes.UNAUTHORIZED);
			throw new NotAuthorizedError('Você não tem autorização para isso!');
		}
		next();
	};
}

export default { Roles, checkRole };
