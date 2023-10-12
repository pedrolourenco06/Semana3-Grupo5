import { criarMusica } from './src/domains/Music/controller/controllerMusic';

async function main() {
	const body = {
		name : 'lovely',
		genero : 'POP',
		album : 'seila',
		artistaId: 1,
		artistaName: 'Billie Eilish',
		photo:'https://www.google.com/url?sa=i&url=https%3A%2F%2Frollingstone.uol.com.br%2Fsem-categoria%2Fa-banda-de-rock-que-fez-billie-eilish-se-apaixonar-pela-musica-fenomeno-do-pop-contemporaneo-cantora-mostrou-ter-influencias-diversas-ao-longo-de-sua-ainda-curta-mas-bem-sucedida-carreira-music%2F&psig=AOvVaw3tv_j0qZUc7PupPafuLFQ2&ust=1697225968601000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCODd7M6h8YEDFQAAAAAdAAAAABAE' 
	};
	criarMusica(body);
}
main();