/* eslint-disable @typescript-eslint/no-explicit-any */
import serviceMusic from './serviceMusic';
import prisma from '../../../../config/client';
import { Music } from '@prisma/client';
import {describe, expect, test} from '@jest/globals';
import serviceArtist from '../../Artist/service/serviceArtist';
import { QueryError } from '../../../../errors/QueryError';



jest.mock('../../../../config/client.ts',()=>({
	artist:{
		findUnique:jest.fn(),
	},
	music:{
		create:jest.fn(),
	}
}));
jest.mock('../../Artist/service/serviceArtist.ts',()=>{
	return {
		findArtist: jest.fn()
	};
});


describe('create', () => {
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks();
	});


	test('metodo recebe um objeto com informações da musica=> chama o create com os dados corretos', async()=>{
		const mockMusic = {
			name: 'Teste',
			genero:'Teste',
			album:'Teste',
			artistaId:1,
		} as Music;


		

		jest.mocked(serviceArtist).findArtist.mockImplementation(
			()=>{
				return {} as any;
			}
		);

		const createMock = jest.spyOn(prisma.music,'create').mockImplementation(
			()=>{
				return {} as any;
			}
		);

		await serviceMusic.create(mockMusic);

		
		expect(createMock).toHaveBeenCalledTimes(1);
		expect(createMock.mock.calls[0][0]).toEqual({
			data:{
				name: mockMusic.name,
				genero: mockMusic.genero,
				album:mockMusic.album,
				artista:{
					connect:{
						id:mockMusic.artistaId
					}
				}
			}
		});
	});

	test('Recebe uma string no id do Artista => Retorna um erro', async()=>{
		const mockMusic = {
			name:'Teste',
			genero:'Teste',
			album:'Teste',
			artistaId:'Teste'
		};

		return expect(
			async()=>{
				await serviceMusic.create(mockMusic);
			}
		).rejects.toThrowError(new QueryError('Id do artista precisa ser um número'));
	});

	test('Recebe um id igual a 0 => Retorna um erro', async()=>{
		const mockMusic = {
			name:'Teste',
			genero:'Teste',
			album:'Teste',
			artistaId: 0
		}as Music;

		return expect(
			async()=>{
				await serviceMusic.create(mockMusic);
			}
		).rejects.toThrowError(new QueryError('Id do artista precisa ser um número'));
	});

	test('Deixa de receber um nome => Retorna um erro', async()=>{
		const mockMusic = {
			genero:'Teste',
			album:'Teste',
			artistaId:1,
		} as Music;

		return expect(
			async()=>{
				await serviceMusic.create(mockMusic);		
			}
		).rejects.toThrowError(new QueryError ('A musica precisa de um nome'));
	});

	test('Deixa de receber um genero => Retorna um erro', async()=>{
		const mockMusic = {
			name:'Teste',
			album:'Teste',
			artistaId:1,
		} as Music;

		return expect(
			async()=>{
				await serviceMusic.create(mockMusic);		
			}
		).rejects.toThrowError(new QueryError ('O genero precisa de um nome'));
	});
	test('Deixa de receber um album => Retorna um erro', async()=>{
		const mockMusic = {
			name:'Teste',
			genero:'Teste',
			artistaId:1,
		} as Music;

		return expect(
			async()=>{
				await serviceMusic.create(mockMusic);		
			}
		).rejects.toThrowError(new QueryError ('O album precisa de um nome'));
	});
	test('Recebe um id de Artista atraves do modelo da musica=> Verifica se ele existe', async()=>{
		const mockMusic = {
			name: 'Teste',
			genero:'Teste',
			album:'Teste',
			artistaId:1,
		} as Music;

		jest.mocked(prisma).artist.findUnique.mockImplementation(
			() => {
				return undefined as any;
			}
		);

		return expect(async()=>{
			await serviceMusic.create(mockMusic);
		}).rejects.toThrowError(new QueryError('O artista não existe'));
	});

});