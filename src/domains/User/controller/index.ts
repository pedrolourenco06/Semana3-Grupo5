import UserService from '../services/UserService';
import { Router, Request, Response, NextFunction } from 'express';
import { loginMiddleware, verifyJWT } from '../../../middlewares/userLogin';
import statusCodes from '../../../../utils/statusCodes';

const router = Router();

router.get('/', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		const users = await UserService.findUsers();
		res.json(users);

	}
	catch(error){
		next(error);
	}
});

router.get('/:email', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await UserService.findByEmail(req.params.email);
		res.json(user);
	}
	catch(error){
		next(error);
	}
});

router.post('/create', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await UserService.create(req.body);
		res.json('Usuario criado com sucesso!');
	}
	catch(error){
		next(error);
	}
});

router.delete('/delete/:email',verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await UserService.delete(req.params.email);
		res.json(user);
	}
	catch(error){
		next(error);
	}
});

router.put('/update',
	verifyJWT, 
	async(req: Request, res: Response, next: NextFunction) => {
		try{
			const user = await UserService.update(req.body);
			res.json(user);
		}
		catch(error){
			next(error);
		}
	});


router.post('/login', 
	loginMiddleware,
	async(req:Request, res:Response, next:NextFunction)=>{
		try{
			res.status(statusCodes.NO_CONTENT).end();
		}catch(error){
			next(error);
		}
	}
);



export default router;