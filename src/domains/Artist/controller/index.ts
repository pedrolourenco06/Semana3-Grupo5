import { verifyJWT } from '../../../middlewares/userLogin';
import serviceArtist from '../service/serviceArtist';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.post('/create', async(req: Request, res: Response, next: NextFunction) => {
	try{
		const criar = await serviceArtist.create(req.body);
		res.json(criar);
	}
	catch(error){
		next(error);
	}
});

router.get('/', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		const ler = await serviceArtist.read();
		res.json(ler);
	}
	catch(error){
		next(error);
	}
});

router.put('/update', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		const atualizar = await serviceArtist.update(req.body);
		res.json(atualizar);
	}
	catch(error){
		next(error);
	}
});

router.delete('/delete', verifyJWT, async(req: Request, res: Response, next: NextFunction) => {
	try{
		const deletar = await serviceArtist.delete(req.body);
		res.json(deletar);
	}
	catch(error){
		next(error);
	}
});

export default router;