import {Body, Controller, Get, HttpService, Post, Query, Req, Res} from '@nestjs/common';
import {AppService} from './app.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly http: HttpService,
	) {
	}
	
	@Get()
	async index(
		@Query() query,
		@Req() req,
		@Res() res,
	): Promise<any> {
		if (query.sessionID) {
			this.http.get('http://localhost:3000/getAuth?sessionID=' + query.sessionID)
				.subscribe(data => {
					if (!data.data) {
						res.redirect('http://localhost:3000/login?origin=http://localhost:3002');
						return;
					}
					req.session.info = data.data;
					req.session.token = query.sessionID;
					req.session.save(err => {
						res.send(`
							<html>
							<head></head>
							<body>
								<h3>sso-example-b</h3>
								<h4>用户名:${data.data.name}</h4>
								<h4>密码:${data.data.pass}</h4>
								<a href="/logout?token=${query.sessionID}">退出</a>
							</body>
							</html>
						`);
					});
				});
		} else {
			res.redirect('http://localhost:3000/login?origin=http://localhost:3002');
		}
	}
	
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
