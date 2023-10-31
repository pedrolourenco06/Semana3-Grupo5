import { Roles, checkRole } from '../../../middlewares/checkRole';
import { verifyJWT } from '../../../middlewares/userLogin';
import serviceMusic from '../services/serviceMusic';
import { Router, Request, Response, NextFunction } from 'express';
import statusCodes from '../../../../utils/statusCodes';

const router = Router();

router.post('/create',
	verifyJWT,
	checkRole(Roles.admin),
	async(req:Request, res:Response, next:NextFunction) =>{
		try{
			await serviceMusic.create(req.body);
			res.status(statusCodes.CREATED).json('Música criada com sucesso!');
		}catch(error){
			next(error);
		}
	});

router.get('/',
	verifyJWT, 
	async (req:Request, res:Response, next:NextFunction)=>{
		try{
			const musics = await serviceMusic.read();
			res.status(statusCodes.SUCCESS).json(musics);
		}catch(error){
			next(error);
		}
	});

router.get('/:id',
	verifyJWT, 
	async(req:Request, res:Response, next:NextFunction)=>{
		try{
			const musics = await serviceMusic.findMusic(Number(req.params.id));
			res.status(statusCodes.SUCCESS).json(musics);
		}catch(error){
			next(error);
		}
	});

router.put('/update',
	verifyJWT,
	checkRole(Roles.admin), 
	async (req:Request, res:Response, next:NextFunction) =>{
		try{
			await serviceMusic.update(req.body);
			res.status(statusCodes.SUCCESS).json('Atualização realizada com sucesso!');
		}catch(error){
			next(error);
		}
	});

router.delete('/delete/:id',
	verifyJWT,
	checkRole(Roles.admin),
	async(req:Request, res:Response, next:NextFunction)=>{
		try{
			await serviceMusic.delete(Number(req.params.id));
			res.status(statusCodes.SUCCESS).json('Música deletada com sucesso!');
		}catch(error){
			next(error);
		}
	});
export default router;