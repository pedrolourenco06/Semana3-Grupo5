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
		const lerArt = await prisma.artist.findUnique({
			where:{id:body.artistaId}
		});
		if (lerArt?.streams != undefined){
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const updateArt = await prisma.artist.update({
				where:{id:body.artistaId},
				data:{streams:lerArt?.streams+1}
			});
		}
		const criar = await prisma.music.create({
			data:{
				name: body.name,
				genero: body.genero,
				album: body.album,
				artista:{
					connectOrCreate:{
						where:{id: body.artistaId},
						create:{
							name: body.artistaName,
							photo: body.photo,
							streams: 1
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
		const ler = await prisma.music.findUnique({
			where:{id:body.id}
		});
		if (ler?.artistaId != null){
			if (ler.artistaId != body.artistaId){
				const art1 = await prisma.artist.findUnique({
					where:{id: ler.artistaId}
				});
				const art2 = await prisma.artist.findUnique({
					where:{id: body.artistaId}
				});
				if (art1?.streams != undefined && art2?.streams != undefined){
					await prisma.artist.update({
						where:{id:ler.artistaId},
						data:{
							streams: art1.streams - 1
						}
					});
					await prisma.artist.update({
						where:{id:body.artistaId},
						data:{
							streams:art2.streams + 1 
						}
					});
				}
			}
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
		const lerArt = await prisma.artist.findUnique({
			where:{id: deletar.artistaId}
		});
		if (lerArt?.streams != undefined){
			const atualizarArtista = await prisma.artist.update({
				where:{ id:deletar.artistaId},
				data:{streams: lerArt?.streams - 1}
			});
			return atualizarArtista;
		}
	}
}

export default new serviceMusic;