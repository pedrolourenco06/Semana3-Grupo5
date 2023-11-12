import { Music } from '@prisma/client';
import serviceArtist from '../../Artist/service/serviceArtist';
import { QueryError } from '../../../../errors/QueryError';
import prisma from '../../../../config/client';

class serviceMusic{
	async create(body : Music) {
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
		const artist = await serviceArtist.findArtist(body.artistaId);
		if(!artist){
			throw new QueryError('O artista não existe');
		}
		const criar = await prisma.music.create({
			data:{
				name: body.name,
				genero: body.genero,
				album: body.album,
				artista:{
					connect:{
						id: body.artistaId
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