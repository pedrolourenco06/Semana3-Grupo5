import serviceArtist from '../service/serviceArtist';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.post('/:body', async(req: Request, res: Response, next: NextFunction) => {
    try{
		const criar = await serviceArtist.create(req.params.body);
		res.json(criar);
	}
	catch(error){
		next(error);
	}
});

router.get('/', async(req: Request, res: Response, next: NextFunction) => {
    try{
		const ler = await serviceArtist.read();
		res.json(ler);
	}
	catch(error){
		next(error);
	}
});

router.put('/:body', async(req: Request, res: Response, next: NextFunction) => {
    try{
		const atualizar = serviceArtist.update(req.params.body);
		res.json(atualizar);
	}
	catch(error){
		next(error);
	}
});

router.delete('/:body', async(req: Request, res: Response, next: NextFunction) => {
    try{
		const deletar = serviceArtist.delete(req.params.body);
		res.json(deletar);
	}
	catch(error){
		next(error);
	}
});

export default router;