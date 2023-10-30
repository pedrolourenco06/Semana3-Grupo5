import { Roles, checkRole } from '../../../middlewares/checkRole';
import { verifyJWT } from '../../../middlewares/userLogin';
import serviceMusic from '../services/serviceMusic';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.post('/create',
	verifyJWT,
	checkRole(Roles.admin),
	async(req:Request, res:Response, next:NextFunction) =>{
		try{
			const musics = await serviceMusic.create(req.body);
			res.json(musics);
		}catch(error){
			next(error);
		}
	});

router.get('/',
	verifyJWT, 
	async (req:Request, res:Response, next:NextFunction)=>{
		try{
			const musics = await serviceMusic.read();
			res.json(musics);
		}catch(error){
			next(error);
		}
	});

router.get('/:id',
	verifyJWT, 
	async(req:Request, res:Response, next:NextFunction)=>{
		try{
			const musics = await serviceMusic.findMusic(Number(req.params.id));
			res.json(musics);
		}catch(error){
			next(error);
		}
	});

router.put('/update',
	verifyJWT, 
	async (req:Request, res:Response, next:NextFunction) =>{
		try{
			const musics = await serviceMusic.update(req.body);
			res.json(musics);
		}catch(error){
			next(error);
		}
	});

router.delete('/delete/:id',
	verifyJWT,
	async(req:Request, res:Response, next:NextFunction)=>{
		try{
			const musics = await serviceMusic.delete(Number(req.params.id));
			res.json(musics);
		}catch(error){
			next(error);
		}
	});
export default router;