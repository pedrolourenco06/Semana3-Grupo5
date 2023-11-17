import UserService from '../services/UserService';
import { Router, Request, Response, NextFunction } from 'express';
import { loginMiddleware, verifyJWT } from '../../../middlewares/userLogin';
import statusCodes from '../../../../utils/statusCodes';
import { logoutMiddleware } from '../../../middlewares/userLogout';



const router = Router();

router.get('/', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		const users = await UserService.findUsers();
		res.status(statusCodes.SUCCESS).json(users);
	}
	catch(error){
		next(error);
	}
});

router.get('/:email', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		const user = await UserService.findByEmail(req.params.email);
		const newUser = {
			email:user.email,
			name:user.name,
			photo:user.photo,
			role:user.role,
			music:user.music
		};
		res.status(statusCodes.SUCCESS).json(newUser);
	}
	catch(error){
		next(error);
	}
});

router.post('/create', async(req: Request, res: Response, next: NextFunction) => {
	try{
		await UserService.create(req.body);
		res.status(statusCodes.CREATED).json('Usuario criado com sucesso!');
	}
	catch(error){
		next(error);
	}
});


router.delete('/delete/:email',
	verifyJWT, 
	async(req: Request, res: Response, next: NextFunction) => {
		try{
			await UserService.delete(req.params.email, req.user);
			if (req.params.email == req.user.email){
				res.clearCookie('jwt');
			}
			res.status(statusCodes.SUCCESS).json('Usuário deletado com sucesso!');
		}catch(error){
			next(error);
		}
	});

router.put('/update', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		await UserService.update(req.body, req.user);
		res.status(statusCodes.SUCCESS).json('Usuário atualizado com sucesso!');
	}catch(error){
		next(error);
	}
});


router.post('/login', loginMiddleware, async(req:Request, res:Response, next:NextFunction)=>{
	try{
		res.status(statusCodes.NO_CONTENT).end();
	}catch(error){
		next(error);
	}	}
);

router.post('/logout',
	verifyJWT,
	logoutMiddleware,
	async(req:Request, res:Response, next:NextFunction)=>{
		try{
			res.status(statusCodes.NO_CONTENT).end();
		}catch(error){
			next(error);
		}
	}
);


router.put('/createPlay', async(req:Request, res:Response, next:NextFunction)=>{
	try{
		await UserService.createPlaylist(req.body.id, req.body.email);
		res.status(statusCodes.CREATED).end();
	}catch(error){
		next(error);
	}
});

router.delete('/deletePlay', async(req:Request, res:Response, next:NextFunction)=>{
	try{
		await UserService.deletePlaylist(req.body.id, req.body.email);
		res.status(statusCodes.SUCCESS).end();
	}catch(error){
		next(error);
	}
});
export default router;