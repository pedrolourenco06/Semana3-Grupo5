import serviceMusic from '../services/serviceMusic';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.post('/create', async(req:Request, res:Response, next:NextFunction) =>{
	try{
		const musics = await serviceMusic.create(req.body);
		res.json(musics);
	}catch(error){
		next(error);
	}
});

router.get('/', async (req:Request, res:Response, next:NextFunction)=>{
	try{
		const musics = await serviceMusic.read();
		res.json(musics);
	}catch(error){
		next(error);
	}
});

router.get('/:id', async(req:Request, res:Response, next:NextFunction)=>{
	try{
		const musics = await serviceMusic.findMusic(Number(req.params.id));
		res.json(musics);
	}catch(error){
		next(error);
	}
});

router.put('/update', async (req:Request, res:Response, next:NextFunction) =>{
	try{
		const musics = await serviceMusic.update(req.body);
		res.json(musics);
	}catch(error){
		next(error);
	}
});
export default router;