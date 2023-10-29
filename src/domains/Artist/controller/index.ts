import serviceArtist from '../service/serviceArtist';
import { Router, Request, Response, NextFunction } from 'express';
import statusCodes from '../../../../utils/statusCodes';
import {Roles, checkRole } from '../../../middlewares/checkRole';

const router = Router();

router.post('/create', 
checkRole(Roles.admin),
async(req: Request, res: Response, next: NextFunction) => {
	try{
		await serviceArtist.create(req.body);
		res.status(statusCodes.CREATED).json('Perfil do artista criado com sucesso!');
	}
	catch(error){
		next(error);
	}
});

router.get('/', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await serviceArtist.read();
		res.status(statusCodes.SUCCESS).json('Leitura executada com sucesso!');
	}
	catch(error){
		next(error);
	}
});

router.put('/update', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await serviceArtist.update(req.body);
		res.status(statusCodes.SUCCESS).json('Perfil atualizado com sucesso!');
	}
	catch(error){
		next(error);
	}
});

router.delete('/delete',
checkRole(Roles.admin),
async(req: Request, res: Response, next: NextFunction) => {
	try{
		await serviceArtist.delete(req.body);
		res.status(statusCodes.SUCCESS).json('Perfil deletado com sucesso!');
	}
	catch(error){
		next(error);
	}
});

export default router;