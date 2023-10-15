import { Artist } from "../model/modelArtist";
import { serviceArtist } from "../service/serviceArtist";

export async function criarArtista(body: Artist) {
    try{
        const criar = serviceArtist.create(body);
        console.log(criar)
    }
    catch(error){
        console.log(error);
    }
}

export async function lerArtista(body: Artist) {
    try{
        const ler = serviceArtist.read(body);
        console.log(ler);
    }
    catch(error){
        console.log(error);
    }
}

export async function atualizarArtista(body: Artist) {
    try{
        const atualizar = serviceArtist.update(body);
        console.log(atualizar);
    }
    catch(error){
        console.log(error);
    }
}

export async function deletarArtista(body: Artist) {
    try{
        const deletar = serviceArtist.delete(body);
        console.log(deletar);
    }
    catch(error){
        console.log(error);
    }
}