import { NotAuthorizedError } from "../../errors/NotAuthorizedError";
import { Request, Response, NextFunction } from 'express';
import statusCodes from "../../utils/statusCodes";

export enum Roles {
    admin = 'ADMIN',
    user = 'USER',
};

export function checkRole(role: Roles) {
    return (res: Response, next: NextFunction) => {
        if(!role) {
            res.status(statusCodes.UNAUTHORIZED);
            throw new NotAuthorizedError('Você não tem autorização para isso!');
        }
        next();
    }
}

export default { Roles, checkRole };
