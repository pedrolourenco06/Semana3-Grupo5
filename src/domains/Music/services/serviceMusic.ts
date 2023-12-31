import { Music } from '@prisma/client';
import serviceArtist from '../../Artist/service/serviceArtist';
import { QueryError } from '../../../../errors/QueryError';
import prisma from '../../../../config/client';

class serviceMusic{
	async create(body : Music) {
		if (isNaN(Number(body.artistaId)) || body.artistaId == 0){
			throw new QueryError('Id do artista precisa ser um número');
		}
		if (body.name == '' || body.name == undefined){
			throw new QueryError('A musica precisa de um nome');
		}
		if (body.genero == ''||body.genero == undefined){
			throw new QueryError('O genero precisa de um nome');
		}
		if (body.album == '' || body.album == undefined){
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
						id: Number(body.artistaId)
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
		if (!await prisma.music.findUnique({
			where:{
				id: Number(body.id)
			}
		})){
			throw new QueryError('A musica não existe');
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
			throw new QueryError('O id da musica precisa ser um número');
		}
		if (!await prisma.music.findUnique({
			where:{id: Number(id)}
		})){
			throw new QueryError('A música não existe');
		}
		const deletar = await prisma.music.delete({
			where:{id: Number(id)}
		});
		return deletar;
	}

	async findMusic(id:number){
		if (id == 0 || isNaN(Number(id))){
			throw new QueryError('O id da musica precisa ser um número');
		}
		const find = await prisma.music.findUnique({
			where:{id: Number(id)}
		});
		if (!find){
			throw new QueryError('A música não existe');
		}
		return find;
	}
}

export default new serviceMusic();