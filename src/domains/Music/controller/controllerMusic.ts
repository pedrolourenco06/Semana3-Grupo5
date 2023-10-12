import { Music } from '../Model/modelMusic';
import serviceMusic from '../services/serviceMusic';

export async function criarMusica(body : Music) {
	try{
		const resultado = await serviceMusic.create(body);
		console.log(JSON.stringify(resultado, null, 1));
	}catch(error){
		console.log(error);
	}
}