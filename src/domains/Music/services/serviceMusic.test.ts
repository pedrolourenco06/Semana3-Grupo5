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
		update:jest.fn(),
		findUnique:jest.fn(),
		delete:jest.fn(),
		findMany:jest.fn(),
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


	test('Metodo recebe um objeto com informações da musica=> chama o create com os dados corretos', async()=>{
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
			artistaId: ''
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

describe('update',()=>{
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks();
	});
	test('Metodo recebe um objeto com valores de musica => da update no banco de dados',async()=>{
		const updateMock = {
			id: 1,
			name: 'Teste',
			genero:'Teste',
			album:'Teste',
			artistaId:1
		}as Music;
		jest.mocked(serviceArtist).findArtist.mockImplementation(
			()=>{
				return {} as any;
			}
		);
		
		jest.mocked(prisma).music.findUnique.mockImplementation(
			()=>{
				return {} as any;
			}
		);
		const musicUpdateMock = jest.spyOn(prisma.music, 'update').mockImplementation(
			()=>{
				return {} as any;
			}
		);

		await serviceMusic.update(updateMock);

		expect(musicUpdateMock).toBeCalledTimes(1);
		expect(musicUpdateMock.mock.calls[0][0]).toEqual({
			data:{
				name: updateMock.name,
				genero: updateMock.genero,
				album:updateMock.album,
				artistaId:updateMock.artistaId,
			},
			where:{
				id: updateMock.id
			}
			
		});
	});

	test('Metodo recebe um id como string => Retorna um erro', async()=>{
		const updateMock = {
			id: '',
			name: 'Teste',
			genero:'Teste',
			album:'Teste',
			artistaId:1
		};

		return expect(
			async ()=>{
				await serviceMusic.update(updateMock);
			}
		).rejects.toThrowError(new QueryError ('Id da musica precisa ser um número'));
	});

	test('Metodo recebe um id como 0 => Retorna um erro', async()=>{
		const updateMock = {
			id: 0,
			name: 'Teste',
			genero:'Teste',
			album:'Teste',
			artistaId:1
		};

		return expect(
			async ()=>{
				await serviceMusic.update(updateMock);
			}
		).rejects.toThrowError(new QueryError ('Id da musica precisa ser um número'));
	});

	test('Metodo recebe um artistaId como string => Retorna um erro', async()=>{
		const updateMock = {
			id: 1,
			name: 'Teste',
			genero:'Teste',
			album:'Teste',
			artistaId:''
		};

		return expect(
			async ()=>{
				await serviceMusic.update(updateMock);
			}
		).rejects.toThrowError(new QueryError ('Id do artista precisa ser um número'));
	});

	test('Metodo recebe um artistaId como 0 => Retorna um erro', async()=>{
		const updateMock = {
			id: 1,
			name: 'Teste',
			genero:'Teste',
			album:'Teste',
			artistaId:0
		};

		return expect(
			async ()=>{
				await serviceMusic.update(updateMock);
			}
		).rejects.toThrowError(new QueryError ('Id do artista precisa ser um número'));
	});

	test('Metodo recebe um nome vazio => Retorna um erro', async()=>{
		const updateMock = {
			id: 1,
			name: '',
			genero:'Teste',
			album:'Teste',
			artistaId:1
		};

		return expect(
			async()=>{
				await serviceMusic.update(updateMock);
			}
		).rejects.toThrowError(new QueryError('A musica precisa de um nome'));
	});

	test('Metodo recebe um genero vazio => Retorna um erro', async()=>{
		const updateMock = {
			id: 1,
			name: 'Teste',
			genero: '',
			album:'Teste',
			artistaId:1
		};

		return expect(
			async()=>{
				await serviceMusic.update(updateMock);
			}
		).rejects.toThrowError(new QueryError('O genero precisa de um nome'));
	});
	
	test('Metodo recebe um album vazio => Retorna um erro', async()=>{
		const updateMock = {
			id: 1,
			name: 'Teste',
			genero:'Teste',
			album:'',
			artistaId:1
		};

		return expect(
			async()=>{
				await serviceMusic.update(updateMock);
			}
		).rejects.toThrowError(new QueryError('O album precisa de um nome'));
	});

	test('Metodo recebe um artista inexistente => Retorna um erro', async()=>{
		const updateMock = {
			id: 1,
			name: 'Teste',
			genero:'Teste',
			album:'Teste',
			artistaId:1
		};

		jest.mocked(serviceArtist).findArtist.mockImplementation(
			()=>{
				return undefined as any;
			}
		);

		return expect(
			async()=>{
				await serviceMusic.update(updateMock);
			}
		).rejects.toThrowError(new QueryError('O artista tem que existir'));
	});

	test('Metodo recebe uma musica inexistente => Retorna um erro', async()=>{
		const updateMock = {
			id: 1,
			name: 'Teste',
			genero:'Teste',
			album:'Teste',
			artistaId:1
		};

		await jest.mocked(prisma).music.findUnique.mockImplementation(
			()=>{
				return undefined as any;
			}
		);
		jest.mocked(serviceArtist).findArtist.mockImplementation(
			()=>{
				return {} as any;
			}
		);
		return expect(
			async ()=>{
				await serviceMusic.update(updateMock);
			}
		).rejects.toThrowError(new QueryError('A musica não existe'));
	});
});

describe('findMusic', ()=>{
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	test('Metodo recebe um id => Deleta musica com o id do banco de dados', async()=>{
		const musicid = 1;
		
		const findOneMock = {
			id : 1,
			name: 'Teste',
			genero: 'Teste',
			album: 'Teste',
			artistaId: 'Teste',
		};
		const findOneMusicMock = jest.spyOn(prisma.music, 'findUnique').mockImplementation(
			(id : any)=>{
				findOneMock.id = id;
				return findOneMock as any;
			}
		);
		
		const musica_retornada = await serviceMusic.findMusic(musicid);
		expect(musica_retornada).toStrictEqual(findOneMock);
		expect(findOneMusicMock.mock.calls[0][0]).toStrictEqual({
			where:{
				id: musicid
			}
		});
		expect(findOneMusicMock).toHaveBeenCalledTimes(1);
	});
	
	test('Metodo recebe um id como string => Retorna um erro', async()=>{
		const musicid = '';

		return expect(
			async()=>{
				await serviceMusic.findMusic(musicid);
			}
		).rejects.toThrowError(new QueryError('O id da musica precisa ser um número'));
	});

	test('Metodo recebe um id como 0 => Retorna um erro', async()=>{
		const musicid = 0;

		return expect(
			async()=>{
				await serviceMusic.findMusic(musicid);
			}
		).rejects.toThrowError(new QueryError('O id da musica precisa ser um número'));
	});

	test('Metodo recebe uma musica que não existe => Retorna erro', async()=>{
		const musicid = 1;

		jest.mocked(prisma).music.findUnique.mockImplementation(
			()=>{
				return undefined as any;
			}
		);
		return expect(
			async()=>{
				await serviceMusic.findMusic(musicid);
			}
		).rejects.toThrowError(new QueryError('A música não existe'));
	});
});

describe('delete', ()=>{
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	test('Metodo recebe um id => Deleta a musica que possuí o id', async()=>{
		const musicId = 1;

		jest.mocked(prisma).music.findUnique.mockImplementation(
			()=>{
				return {} as any;
			}
		);

		const deleteMock = jest.spyOn(prisma.music,'delete').mockImplementation(
			()=>{
				return {} as any;
			}
		);

		await serviceMusic.delete(1);

		expect(deleteMock).toBeCalledTimes(1);
		expect(deleteMock.mock.calls[0][0]).toEqual({
			where:{
				id: musicId
			}
		});
	});

	test('Metodo recebe um id como string=> Retorna erro', async()=>{
		const musicId = '';

		return expect(
			async()=>{
				await serviceMusic.delete(musicId);
			}
		).rejects.toThrowError(new QueryError('O id da musica precisa ser um número'));
	});

	test('Metodo recebe um id como 0 => Retorna erro', async()=>{
		const musicId = 0;

		return expect(
			async()=>{
				await serviceMusic.delete(musicId);
			}
		).rejects.toThrowError(new QueryError('O id da musica precisa ser um número'));
	});

	test('Metodo recebe uma musica que não existe => Retorna erro', async()=>{
		const musicId = 1;

		jest.mocked(prisma).music.findUnique.mockImplementation(
			()=>{
				return undefined as any;
			}
		);

		return expect(
			async()=>{
				(await serviceMusic.delete(musicId));
			}
		).rejects.toThrowError(new QueryError('A música não existe'));
	});
});

describe('FindAllMusics', ()=>{
	beforeEach(()=>{
		jest.resetAllMocks();
		jest.clearAllMocks();
	});
	test.each([
		{
			musicas:
			[
				{
					id:1,
					name:'Just the two of us',
					genero:'Pop',
					album:'Sei la',
					artistaId:1
				},
			]
		},
		{
			musicas:
			[
				{
					id:1,
					name:'Bad guy',
					genero:'Pop',
					album:'Não sei',
					artistaId:1,
				},
				{
					id:2,
					name:'Teste',
					genero:'Teste',
					album:'Teste',
					artistaId:'Teste'
				},
			],
		},
		{
			musicas:
			[]
		}
	])('%j Metodo recebe um pedido para ver todas as musicas => envia uma array de musicas',async 	({musicas})=>{
		jest.mocked(prisma).music.findMany.mockReturnValue(musicas as any);

		const teste = await serviceMusic.read();
		expect(teste).toEqual(expect.arrayContaining(musicas));
	});
});

