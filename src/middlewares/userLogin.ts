import { User } from '@prisma/client';
import { Request,Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserService from '../domains/User/services/UserService';
import { PermissionError } from '../../errors/PermissionError';
import statusCodes from '../../constants/statusCodes';
import bcrypt from 'bcrypt';

function generateJWT(user:User, res:Response){
	const body = {
		email: user.email,
		name: user.name,
		role: user.role
	};

	const token = jwt.sign({user: body}, process.env.SECRET_KEY,{expiresIn:process.env.JWT_EXPIRATION});

	res.cookie('jwt', token,{
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development'
	});	
}

export async function loginMiddleware(req:Request, res:Response, next:NextFunction) {
	try{
		const user = await UserService.findByEmail(req.body.email);
		if(!user){
			res.status(statusCodes.UNAUTHORIZED).json('E-mail ou senha incorretos');
			throw new PermissionError('E-mail e/ou senha incorretos');
		}else{
			const matchingPassword = await bcrypt.compare(req.body.password, user.password);
			if(!matchingPassword){
				res.status(statusCodes.UNAUTHORIZED).json('E-mail e/ou senha incorretos');
				throw new PermissionError('E-mail e/ou senha incorretos');
			}
		}

		generateJWT(user, res);

		res.status(statusCodes.NO_CONTENT).end();
	}catch(error){
		next(error);
	}
}


function cookieExtractor(req : Request){
	let token = null;

	if(req && req.cookies){
		token = req.cookies['jwt'];
	}

	return token;
}
export function verifyJWT(req:Request, res:Response, next:NextFunction){
	try{
		const token = cookieExtractor(req);
		if(token){
			const decoded = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;
			req.user = decoded.user;
		}
		
		if(!req.user){
			throw new PermissionError('Você precisa estar logado para realizar essa ação');
		}
		next();
	}catch(error){
		next(error);
	}
}