import prisma from '../../../../config/client';
import { User } from '@prisma/client';

class UserService{
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

	async update (body: User){
		if(body.name == ''){
			throw new Error('O usuário precisa de um nome');
		}
		if(body.email == ''){
			throw new Error('O usuário precisa de um email');
		}
		if(body.password == ''){
			throw new Error('O usuário precisa de uma senha');
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

	async delete (email: string){
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