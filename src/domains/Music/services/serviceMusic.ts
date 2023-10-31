import { PrismaClient } from '@prisma/client';
import { Music } from '../Model/modelMusic';
import serviceArtist from '../../Artist/service/serviceArtist';
import { QueryError } from '../../../../errors/QueryError';

const prisma = new PrismaClient;


class serviceMusic{
	async create(body : Music) {
		if (isNaN(Number(body.artistaId)) || body.artistaId == 0){
			throw new QueryError('Id do artista precisa ser um número');
		}
		if (!isNaN(Number(body.photo)) || body.photo == ''){
			throw new QueryError('A photo deve ser um link');
		}
		if (body.name == ''){
			throw new QueryError('A musica precisa de um nome');
		}
		if (body.genero == ''){
			throw new QueryError('O genero precisa de um nome');
		}
		if (body.album == ''){
			throw new QueryError('O album precisa de um nome');
		}
		if (body.artistaName == '' || !isNaN(Number(body.artistaName))){
			throw new QueryError ('O artista precisa de um nome');
		}
		if (body.photo == '' || !isNaN(Number(body.photo))){
			throw new QueryError ('O artista precisa de uma foto');
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
		if (isNaN(Number(body.id)) || body.id == 0){
			throw new QueryError ('Id da musica precisa ser um número');
		}
		if (isNaN(Number(body.artistaId)) || body.artistaId == 0){
			throw new QueryError('Id do artista precisa ser um número');
		}
		if (body.name == ''){
			throw new QueryError('A musica precisa de um nome');
		}
		if (body.genero == ''){
			throw new QueryError('O genero precisa de um nome');
		}
		if (body.album == ''){
			throw new QueryError('O album precisa de um nome');
		}
		if (!await serviceArtist.findArtist(body.artistaId)){
			throw new QueryError('O artista tem que existir');
		}
		
		const atualizar = await prisma.music.update({
			where:{id : Number(body.id)},
			data:{
				name:body.name,
				album:body.album,
				genero:body.genero,
				artistaId:Number(body.artistaId)
			}
		});
		return atualizar;
	}


	async delete(id: number){
		if (id == 0 || isNaN(Number(id))){
			throw new Error('O id da musica precisa ser um número');
		}
		const deletar = await prisma.music.delete({
			where:{id: id}
		});
		return deletar;
	}

	async findMusic(id:number){
		if (id == 0 || isNaN(Number(id))){
			throw new Error('O id da musica precisa ser um número');
		}
		const find = await prisma.music.findUnique({
			where:{id: Number(id)}
		});
		return find;
	}
}

export default new serviceMusic();