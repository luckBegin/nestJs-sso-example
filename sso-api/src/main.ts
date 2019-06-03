import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as session from 'express-session' ;
import * as cookie from 'cookie-parser' ;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookie());
	app.use(session({
		secret: Math.random().toString(36).substr( 2  ),
		name: 'sso-api',
		cookie: {maxAge: 800000 , secure: false },
		resave: true,
		saveUninitialized: true,
	}));
	
	app.enableCors({
		origin: true,
		allowedHeaders: 'Content-type',
		methods: 'POST , GET , PUT , DELETE',
	});
	
	await app.listen(3000);
}
bootstrap();
