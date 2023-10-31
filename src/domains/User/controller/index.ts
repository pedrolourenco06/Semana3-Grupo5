import UserService from '../services/UserService';
import { Router, Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../../../middlewares/userLogin';
import statusCodes from '../../../../utils/statusCodes';
import { Roles, checkRole } from '../../../middlewares/checkRole';

const router = Router();

router.get('/', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		const users = await UserService.findUsers();
		res.status(statusCodes.SUCCESS).json("Leitura executada com sucesso!");
	}
	catch(error){
		next(error);
	}
});

router.get('/:email', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await UserService.findByEmail(req.params.email);
		res.status(statusCodes.SUCCESS).json("Leitura executada com sucesso!")
		res.json(user);
	}
	catch(error){
		next(error);
	}
});

router.post('/create', checkRole(Roles.admin), async(req: Request, res: Response, next: NextFunction) => {
	try{
		await UserService.create(req.body);
		res.status(statusCodes.CREATED).json('Usuario criado com sucesso!');
	}
	catch(error){
		next(error);
	}
});

router.delete('/delete/:email',verifyJWT, checkRole(Roles.admin), async(req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await UserService.delete(req.params.email);
		res.status(statusCodes.SUCCESS).json("Usuário deletado com sucesso!");
		res.json(user);
	}
	catch(error){
		next(error);
	}
});

router.put('/update', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
		try{
			const user = await UserService.update(req.body);
			res.status(statusCodes.SUCCESS).json("Usuário atualizado com sucesso!");
			res.json(user);
		}
		catch(error){
			next(error);
		}
	});
















export default router;