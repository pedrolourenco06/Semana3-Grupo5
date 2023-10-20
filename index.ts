import app from './config/configExpress';

app.listen(process.env.PORT, ()=>{
	console.log('Servidor rodando na porta '+ process.env.PORT);
});