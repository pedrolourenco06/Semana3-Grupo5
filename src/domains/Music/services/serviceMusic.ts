import { PrismaClient } from '@prisma/client';
import { Music } from '../Model/modelMusic';

const prisma = new PrismaClient;


class serviceMusic{
	async create(body : Music) {
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
}

export default new serviceMusic;