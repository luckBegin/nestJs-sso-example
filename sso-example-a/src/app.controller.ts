import {Body, Controller, Get, HttpService, Post, Query, Req, Res} from '@nestjs/common';
import {AppService} from './app.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly http: HttpService,
	) {}
	
	// sso-example-a 系统入口
	@Get()
	async index(
		@Query() query,
		@Req() req,
		@Res() res,
	): Promise<any> {
		// 检测链接之中是否带有sessionID标识
		if (query.sessionID) {
			// 若有 , 则向 sso-api发起请求获取用户信息
			this.http.get('http://localhost:3000/getAuth?sessionID=' + query.sessionID)
				.subscribe(data => {
					if (!data.data) {
						// 如果返回空数据则跳转到登录
						res.redirect('http://localhost:3000/login?origin=http://localhost:3001');
						return;
					}
					
					// 同时将session保存在自己的sessionID
					req.session.info = data.data;
					req.session.token = query.sessionID;
					req.session.save(err => {
						res.send(`
							<html>
							<head></head>
							<body>
								<h3>sso-example-a</h3>
								<h4>用户名:${data.data.name}</h4>
								<h4>密码:${data.data.pass}</h4>
								<a href="/logout?token=${query.sessionID}">退出</a>
							</body>
							</html>
						`);
					});
				});
		} else {
			res.redirect('http://localhost:3000/login?origin=http://localhost:3001');
		}
	}
	
	// 退出操作 , 销毁自己的session , 同时通知sso-api
	@Get('/logout')
	async logout(
		@Query() query,
		@Req() req,
		@Res() res,
	): Promise<any> {
		req.session.destroy();
		this.http.get('http://localhost:3000/destroy?sessionID=' + query.token)
			.subscribe(data => {
				res.redirect('/');
			});
	}
}
