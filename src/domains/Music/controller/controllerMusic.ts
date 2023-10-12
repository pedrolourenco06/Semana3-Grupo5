import { Music } from '../Model/modelMusic';
import serviceMusic from '../services/serviceMusic';

export async function criarMusica(body : Music) {
	try{
		const resultado = await serviceMusic.create(body);
		console.log(resultado);
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
