import { PrismaClient } from '@prisma/client';
import { Music } from '../Model/modelMusic';

const prisma = new PrismaClient;


class serviceMusic{
	async create(body : Music) {
		if (isNaN(Number(body.artistaId)) || body.artistaId == 0){
			throw new Error('Id do artista precisa ser um número');
		}
		if (!isNaN(Number(body.photo)) || body.photo == ''){
			throw new Error('A photo deve ser um link');
		}
		if (body.name == ''){
			throw new Error('A musica precisa de um nome');
		}
		if (body.genero == ''){
			throw new Error('O genero precisa de um nome');
		}
		if (body.album == ''){
			throw new Error('O album precisa de um nome');
		}
		if (body.artistaName == '' || !isNaN(Number(body.artistaName))){
			throw new Error ('O artista precisa de um nome');
		}
		const criar = await prisma.music.create({
			data:{
				name: body.name,
				genero: body.genero,
				album: body.album,
				artista:{
					connectOrCreate:{
						where:{id: Number(body.artistaId)},
						create:{
							name: body.artistaName,
							photo: body.photo,
							streams: 0
						}
					}
				}
			}
		});
		return criar;
	}


	async read(){
		const ler = await prisma.music.findMany({
			include:{artista:true}
		});
		return ler;
	}


	async update(body : Music){
		if (isNaN(Number(body.artistaId)) || body.artistaId == 0){
			throw new Error('Id do artista precisa ser um número');
		}
		if (body.name == ''){
			throw new Error('A musica precisa de um nome');
		}
		if (body.genero == ''){
			throw new Error('O genero precisa de um nome');
		}
		if (body.album == ''){
			throw new Error('O album precisa de um nome');
		}
		const atualizar = await prisma.music.update({
			where:{id : body.id},
			data:{
				name:body.name,
				album:body.album,
				genero:body.genero,
				artistaId:body.artistaId
			}
		});
		return atualizar;
	}


	async delete(id: number){
		if (id == 0 || isNaN(id)){
			throw new Error('O id da musica precisa ser um número');
		}
		const deletar = await prisma.music.delete({
			where:{id: id}
		});
		return deletar;
	}
}

export default new serviceMusic();