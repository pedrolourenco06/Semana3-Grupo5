import UserService from "../services/UserService";
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', async(req: Request, res: Response, next: NextFunction) => {
    try{
        const users = await UserService.findUsers();
        res.json(users);

    }
    catch(error){
        next(error);
    }
});

router.get('/:email', async(req: Request, res: Response, next: NextFunction) => {
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

router.delete('/delete/:email', async(req: Request, res: Response, next: NextFunction) => {
    try{
        const user = await UserService.delete(req.params.email);
        res.json(user);
    }
    catch(error){
        next(error);
    }
});
















export default router;