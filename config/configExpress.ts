import dotenv from 'dotenv';
import express, {Express} from 'express';
import cors , {CorsOptions} from 'cors';
import MusicRouter from '../src/domains/Music/controller/index';
import ArtistRouter from '../src/domains/Artist/controller/index';
import UserRouter from '../src/domains/User/controller/index';
import cookieParser from 'cookie-parser';

dotenv.config();

export const app: Express = express();

const options:CorsOptions = {
	credentials:true,
	origin: process.env.APP_URL
};


app.use(cookieParser());
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({
	extended:true
}));
app.use('/api/musics', MusicRouter);
app.use('/api/artists', ArtistRouter);
app.use('/api/users', UserRouter);

export default app;