import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { QueryError } from '../../../../errors/QueryError';
import { Roles } from '../../../middlewares/checkRole';
import { PermissionError } from '../../../../errors/PermissionError';
class UserService{

	async encryptPassword(password: string){
		const saltRounds = 10;
		const encryptPassword = await bcrypt.hash(password, saltRounds);
		return encryptPassword;
	}

	async create(body: User){
		if(body.email == '' || !isNaN(Number(body.email))){
			throw new Error('O usuário precisa de uma email');
		}
		if(body.name == '' || !isNaN(Number(body.name))){
			throw new Error('O usuário precisa de um nome');
		}
		if(body.password == ''){
			throw new Error('O usuário precisa de uma senha');
		}
		
		body.password = await this.encryptPassword(body.password);

		const user = await prisma.user.create({
			data:{
				email: body.email,
				name: body.name,
				password: body.password,
				photo: body.photo,
				role: body.role,
			}
		});

		return user;
	}

	async read (){
		const ler = await prisma.user.findMany();
		return ler;
	}

	async update (body: User, currentUser: User){
		if(body.name == ''){
			throw new Error('O usuário precisa de um nome');
		}
		if(body.email == ''){
			throw new Error('O usuário precisa de um email');
		}
		if(body.password == ''){
			throw new Error('O usuário precisa de uma senha');
		}
		if (!await this.findByEmail(body.email)){
			throw new QueryError('O usuário não existe');
		}
		if (currentUser.email != body.email &&	 currentUser.role != Roles.admin){
			throw new PermissionError('Você não tem permissão para realizar essa ação.');
		}
		if (body.role && currentUser.role != Roles.admin){
			throw new PermissionError('Você não tem permissão para realizar essa ação.');
		}
		const atualizar = await prisma.user.update({
			where:{email: body.email},
			data:{
				name: body.name,
				password: body.password,
				photo: body.photo,
				role: body.role
			}
		});

		return atualizar;
	}

	async delete (email: string, currentUser:User){
		const user = await this.findByEmail(email);
		
		if (!user){
			throw new QueryError('O usuário não existe');
		}
		if (email != currentUser.email && currentUser.role != Roles.admin){
			throw new PermissionError('Você não tem permissão para realizar essa ação');
		}
		const deletar = await prisma.user.delete({
			where: {email: email}
		});

		return deletar;

	}

	async findUsers (){
		const users = await prisma.user.findMany();

		return users;
	}

	async findByEmail (email: string){
		const user = await prisma.user.findFirst({
			where:{
				email: email,
			}
		});
		return user;
	}

}

export default new UserService();