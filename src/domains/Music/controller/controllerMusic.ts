import { Music } from '../Model/modelMusic';
import serviceMusic from '../services/serviceMusic';

export async function criarMusica(body : Music) {
	try{
		const criar = await serviceMusic.create(body);
		console.log(criar);
	}catch(error){
		console.log(error);
	}
}

export async function lerMusicas(){
	try{
		const ler = await serviceMusic.read();
		console.log(JSON.stringify(ler, null, 1));
	}catch(error){
		console.log(error);
	}
}

export async function atualizarMusicas(body : Music) {
	try{
		const atualizar = await serviceMusic.update(body);
		console.log(atualizar);
	}catch(error){
		console.log(Error);
	}
}