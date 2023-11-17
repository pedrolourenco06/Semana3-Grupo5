/* eslint-disable @typescript-eslint/no-explicit-any */
import UserService from "./UserService";
import prisma from "../../../../config/client";
import { User } from "@prisma/client";
import {describe, expect, test} from '@jest/globals';
import { QueryError } from '../../../../errors/QueryError';
import { NotAuthorizedError } from "../../../../errors/NotAuthorizedError";
import { Roles } from "../../../middlewares/checkRole";
import { PermissionError } from "../../../../errors/PermissionError";
import bcrypt from 'bcrypt';

const userService = require('./UserService');

jest.mock('../services/UserService.ts');
jest.mock('bcrypt');
jest.mock('../../../middlewares/checkRole.ts');
jest.mock('../../../middlewares/userLogin.ts');
jest.mock('../../../middlewares/userLogout.ts');
jest.mock('../../../../config/client.ts',()=>({
    user:{
        create:jest.fn(),
        update:jest.fn(),
        delete:jest.fn(),
        findUsers:jest.fn(),
        findByEmail:jest.fn(),

    }
}));

describe('create', () => {
    beforeEach(()=>{
        jest.resetAllMocks();
        jest.clearAllMocks();
    });

    test('os dados do usuário são passados na entrada ==> cria o usuario com os dados corretos', async() => {
        const dadosUser = {
            email: "teste@teste.com",
            name: "teste",
            password: "senhateste",
            photo: "teste",
            role: "roleteste"
        } as User;

        const createMock = jest.spyOn(prisma.user,'create').mockImplementation(
			()=>{
				return {} as any;
			}
		);

        await UserService.create(dadosUser);

        expect(createMock).toHaveBeenCalledTimes(1);
        expect(createMock.mock.calls[0][0]).toEqual({
            data:{
                name: dadosUser.name,
                email: dadosUser.email,
                password: dadosUser.password,
                photo: dadosUser.photo,
                role: dadosUser.role
            }
        })

        


    })

    test('Não recebe um nome ==> retorna um erro de criação', async()=>{
        const userDados = {
            email: "teste",
            password: "teste",
            photo: "teste",
            role: "teste"
        } as User;

        return expect (
            async()=>{
                await UserService.create(userDados);
            }
        ).rejects.toThrowError(new QueryError ('O ususário precisa de um nome'));
    });

    test('Não recebe uma role ==> retorno um erro de criação', async()=>{
        const userDados = {
           email: "teste",
           name: "teste",
           password: "teste",
           photo: "teste"
        } as User;

        return expect (
            async()=>{
                await UserService.create(userDados);
            }
        ).rejects.toThrowError(new QueryError ('O usuário precisa de uma role'));
    });

    test('Não recebe uma senha ==> retorna um erro de criação', async()=>{
        const userDados = {
            email: "teste",
            name: "teste",
            photo: "teste",
            role: "teste"
        } as User;

        return expect (
            async()=>{
                await UserService.create(userDados);
            }
        ).rejects.toThrowError(new QueryError ('O usuário precisa de uma senha'));
    });

});

describe('findByEmail', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('o sistema recebe um email ==> busca um usuário com o dado', async() => {
        const emailUsuario = "teste@teste";

        userService.findByEmail.mockImplementation(
            () => {
                    return { email : emailUsuario}
            }
        );

        await userService.findByEmail(emailUsuario);

        expect(userService.findByEmail).toHaveBeenCalledTimes(1);
        expect(userService.findByEmail.mock.calls[0][0]).toBe(emailUsuario);

    });

    test('o usuario não é encontrado ==> lança excessao', async() => {
        const email = "teste@teste";

        return expect(async() => {
            await userService.findByEmail(email);
        }).rejects.toThrowError(new Error(`Não foi encontrado usuário com o email: ${email}`));
    });
});

describe('update', () => {
    beforeEach(()=>{
        jest.resetAllMocks();
    });

    test('o usuario nao e admin e quer mudar sua propria role ==> lança excessao', async() => {
        const email = 'teste@teste',
            reqUserEmail = 'teste@teste',
            reqUserRole = 'user',
            body = {
                role: 'admin'
            }
        userService.findByEmail.mockImplementation(
            () => {
                return {
                    email: reqUserEmail,
                    role: reqUserRole
                }
            }
        );

        return expect(async() => {
            await userService.update(email, reqUserEmail, reqUserRole, body);
        }).rejects.toThrow(new NotAuthorizedError('Você não tem autorização para mudar seu papel de usuário'));
    });
})