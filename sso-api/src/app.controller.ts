import {Body, Controller, Get, Post, Query, Req, Res} from '@nestjs/common';
import {AppService} from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {
	}

	// sso-api的统一登录入口
	@Get('/login')
	getHello(
		@Res() res ,
		@Query() query ,
		@Req() req ,
	): void {
		// session中用户信息
		const info = req.session.info ;
		// 原地址
		const origin = query.origin ;
		if ( info ) {
			// 若已经登录， 则返回原地址  , 并且带sessionID参数作为标识
			res.redirect( origin + '?sessionID=' + req.sessionID ) ;
		} else {
			// 未登录则渲染登录页面
			res.send( `
			<html>
				<head></head>
				<body>
					<form action="/login" method="post">
						<div> <span>用户名:</span><input type="text" name="username"></div>
						<div> <span>密码:</span><input type="password" name="password"></div>
						<div><input type="text" hidden value="${ query.origin }" name="origin"></div>
						<button id="btn">登录</button>
					</form>
				</body>
			</html>
		`) ;
		}
	}
	
	// 处理sso-api用户登录
	@Post('/login')
	login(
		@Body() body ,
		@Res() res ,
		@Req() req ,
	): void {
		// 保存用户信息到session
		req.session.info = {
			name: body.username ,
			pass: body.password  ,
		};
		req.session.save( err => {
			// session保存完成之后 , 返回原地址  , 并且带sessionID参数作为标识
			res.redirect( body.origin + '?sessionID=' + req.sessionID ) ;
		});
	}
	
	// 通过sessionID获取用户信息
	@Get('/getAuth')
	getAuth(
		@Query() query ,
		@Req() req ,
		@Res() res ,
	): void {
		const id = query.sessionID ;
		const sessions = req.sessionStore.sessions ;
		const data = sessions[id] ? sessions[id] : null ;
		res.send(data ? JSON.parse(data).info : null ) ;
	}
	
	// 销毁session
	@Get('/destroy')
	destroy(
		@Query() query ,
		@Req() req ,
		@Res() res ,
	): void {
		const id = query.sessionID ;
		const sessions = req.sessionStore.sessions ;
		sessions[id] = null ;
		res.send() ;
	}
}
