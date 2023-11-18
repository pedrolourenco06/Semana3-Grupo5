import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { QueryError } from '../../../../errors/QueryError';
import { Roles } from '../../../middlewares/checkRole';
import { PermissionError } from '../../../../errors/PermissionError';
import serviceMusic from '../../Music/services/serviceMusic';
class UserService{

	async encryptPassword(password: string){
		const saltRounds = 10;
		const encryptPassword = await bcrypt.hash(password, saltRounds);
		return encryptPassword;
	}

	async create(body: User){
		if(body.email == '' || !isNaN(Number(body.email)) || body.email == undefined){
			throw new QueryError('O usuário precisa de um email.');
		}
		if(body.name == '' || !isNaN(Number(body.name)) || body.name == undefined){
			throw new QueryError('O usuário precisa de um nome.');
		}
		if(body.password == '' || body.password == undefined){
			throw new QueryError('O usuário precisa de uma senha.');
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
			throw new QueryError('O usuário precisa de um nome.');
		}
		if(body.email == ''){
			throw new QueryError('O usuário precisa de um email.');
		}
		if(body.password == ''){
			throw new QueryError('O usuário precisa de uma senha.');
		}
		if(!await this.findByEmail(body.email)){
			throw new QueryError('Não existe um usuário com o email informado.');
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
		if(!await this.findByEmail(email)){
			throw new QueryError('Não existe um usuário com o email informado.');
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
		const users = await prisma.user.findMany({
			select:{
				email:true,
				name:true,
				password:false,
				photo:true,
				role:true,
			}
		});

		return users;
	}

	async findByEmail (email: string){
		const user = await prisma.user.findFirst({
			where:{
				email: email,
			},
			include:{
				music:{
					select:{
						music:true,
						userId:false,
						musicId:false
					}
				}
			}
		});
		
		return user;
	}

	async createPlaylist(id:number, email:string){
		if(id == undefined || isNaN(Number(id))|| id == 0){
			throw new QueryError('O id deve ser um número');
		}

		if(email == undefined || !isNaN(Number(email)) || email == ''){
			throw new QueryError('O email deve ser uma string');
		}

		if(!await this.findByEmail(email)){
			throw new QueryError('Não existe um usuário com o email informado.');
		}
		

		await serviceMusic.findMusic(id);
	

		await prisma.playlist.create({
			data:{
				musicId:Number(id),
				userId:email
			}
		});
	}
	async deletePlaylist(id:number, email:string){
		if(id == undefined || isNaN(Number(id))|| id == 0){
			throw new QueryError('O id deve ser um número');
		}

		if(email == undefined || !isNaN(Number(email)) || email == ''){
			throw new QueryError('O email deve ser uma string');
		}

		if(!await this.findByEmail(email)){
			throw new QueryError('Não existe um usuário com o email informado.');
		}

		await serviceMusic.findMusic(id);

		await prisma.playlist.delete({
			where:{
				userId_musicId:{
					userId:email,
					musicId:Number(id)
				}
			}
		});
	}
}

export default new UserService();