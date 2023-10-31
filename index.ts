import UserService from './src/domains/User/services/UserService';

async function main(){
	const body ={
		email: 'teste2@gmail.com',
		name: 'teste dois',
		password: '302111',
		photo: ' ',
		teste: ' ',
		premium: false
	};

	const user = await UserService.read();
    
}

main();