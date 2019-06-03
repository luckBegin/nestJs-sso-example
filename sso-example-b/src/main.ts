import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as session from 'express-session' ;
import * as cookie from 'cookie-parser' ;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookie());
	app.use(session({
		secret: Math.random().toString(36).substr( 2  ),
		name: 'sso-example-b',
		cookie: {maxAge: 80000 },
		resave: false,
		saveUninitialized: true,
	}));
	await app.listen(3002);
}
bootstrap();
