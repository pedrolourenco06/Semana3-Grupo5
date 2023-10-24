import { PrismaClient } from '@prisma/client';
import { Artist } from '../model/modelArtist';

const prisma = new PrismaClient();

class serviceArtist {
	async create(body: Artist) {
		if(body.name == '') {
			throw new Error('O artista precisa de um nome!');
		}

		if(!isNaN(Number(body.photo)) || body.photo == '') {
			throw new Error('A foto precisa ser um link!');
		}

		if(isNaN(body.streams)) {
			throw new Error('As streams são contadas em números!');
		}

		if(isNaN(Number(body.artistID))) {
			throw new Error('O ID do artista precisa ser um número!');
		}

		const newArtist = await prisma.artist.create({
			data: {
				name: body.name,
				photo: body.photo,
				streams: Number(body.streams),
			},
		});

		return newArtist;
	}

	async read() {
		const leitura = await prisma.artist.findMany();
		return leitura;
	}

	async update(body: Artist) {
		if(body.name == '') {
			throw new Error('O artista precisa de um nome!');
		}

		if(!isNaN(Number(body.photo)) || body.photo == '') {
			throw new Error('A foto precisa ser um link!');
		}

		if(isNaN(Number(body.streams))) {
			throw new Error('As streams são contadas em números!');
		}

		if(isNaN(Number(body.artistID))) {
			throw new Error('O ID do artista precisa ser um número!');
		}

		const atualizar = await prisma.artist.update({
			where: {id: Number(body.artistID)},
			data: {
				name: body.name,
				photo: body.photo,
				streams: Number(body.streams),
			},
		});

		return atualizar;
	}

	async delete(body: Artist) {
		const deletar = await prisma.artist.delete({
			where: {id: Number(body.artistID)},
		});

		return deletar;
	}
}

export default new serviceArtist;