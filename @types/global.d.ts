import { User } from '@prisma/client';

declare global{
    namespace Express{
        interface Request{
            user: User;
        }
    }

    namespace NodeJS{
        interface ProcessEnv{
            DATABASE_URL : string,
            PORT : string,
            APP_URL : string,
            SECRET_KEY : string,
            JWT_EXPIRATION: string
        }
    }
}