import { Request, Response, NextFunction } from 'express';
import { PermissionError } from '../../errors/PermissionError';

export function logoutMiddleware(req:Request, res:Response, next:NextFunction){
	try{
		if (!req.user){
			throw new PermissionError('Você precisa estar logado para realizar essa ação');
		}else{
			res.clearCookie('jwt');
			next();
		}
	}catch(error){
		next(error);
	}
}