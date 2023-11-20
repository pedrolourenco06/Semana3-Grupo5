import { NotAuthorizedError } from '../../errors/NotAuthorizedError';
import { Request, Response, NextFunction } from 'express';
import statusCodes from '../../utils/statusCodes';

export enum Roles {
	admin = 'ADMIN',
	user = 'USER',
}

export function checkRole(role: Roles) {
	return (req: Request, res: Response, next: NextFunction) => {
		try{
			if(req.user.role != role) {
				res.status(statusCodes.FORBIDDEN);
				throw new NotAuthorizedError('Você não tem autorização para isso!');
			}
			next();
		}catch(error){
			next(error);
		}
	};
}


