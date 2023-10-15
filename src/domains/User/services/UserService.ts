import prisma from "../../../../Client/client";
import { User } from "@prisma/client";

class UserService{
    async create(body: User){
        const user = await prisma.user.create({
            data:{
                email: body.email,
                name: body.name,
                password: body.password,
                photo: body.photo,
                premium: body.premium,
            }
        });

        return user;
    }

    async read (body: User){
        const ler = await prisma.user.findMany();
        return ler;
    }

    async update (body: User){
        const atualizar = await prisma.user.update({
            where:{email: body.email},
            data:{
                name: body.name,
                password: body.password,
                photo: body.photo,
                premium: body.premium
            }
        });

        return atualizar;
    }

    async delete (email: string){
        const deletar = await prisma.user.delete({
            where: {email: email}
        });

        return deletar;
        
    }

}

export default new UserService();