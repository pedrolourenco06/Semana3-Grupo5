import { PrismaClient } from '@prisma/client';
import { Artist } from '../model/modelArtist';
import { QueryError } from '../../../../errors/QueryError';

const prisma = new PrismaClient();

class serviceArtist {
	async create(body: Artist) {
		if(body.name == '') {
			throw new QueryError('O artista precisa de um nome!');
		}

		if(!isNaN(Number(body.photo)) || body.photo == '') {
			throw new QueryError('A foto precisa ser um link!');
		}

		if(isNaN(body.streams)) {
			throw new QueryError('As streams são contadas em números!');
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
			throw new QueryError('O artista precisa de um nome!');
		}

		if(!isNaN(Number(body.photo)) || body.photo == '') {
			throw new QueryError('A foto precisa ser um link!');
		}

		if(isNaN(Number(body.streams))) {
			throw new QueryError('As streams são contadas em números!');
		}

		if (!await this.findArtist(Number(body.artistID))){
			throw new QueryError('O artista não existe');
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

	async delete(id: number) {
		if(isNaN(Number(id))) {
			throw new QueryError('ID inválido');
		}
		if (!await this.findArtist(Number(id))){
			throw new QueryError('O artista não existe');
		}
		const deletar = await prisma.artist.delete({
			where: {id: Number(id)},
		}); 	

		return deletar;
	}

	async findArtist(id: number){
		if (id == 0 || isNaN(Number(id))){
			throw new QueryError('O id do artista precisa ser um número');
		}
		const find = await prisma.artist.findUnique({
			where:{id: Number(id)}
		});
		return find;
	}
}

export default new serviceArtist;