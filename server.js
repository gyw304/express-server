const express = require("express");
const app = express();
const url = require('url');

var cors = require("cors"); //  cnpm install cors
app.use(cors({
	methods: ["GET", "POST"],
	alloweHeaders: ["Content-Type", "application/json;charset=utf-8;application/x-www-form-urlencoded"]
}));

const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken');


app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json())



//DB config
var mongoose = require('mongoose');
mongoose.connect(require('./config/config').mongoURI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('=========== mongodb connect ===========')
});


/* 
	路由鉴权
	no_authorization_router : 不鉴权路由配置
 */
let no_authorization_router = [
	'/api/users/login',
	'/api/users/register'
];
app.use(function(req, res, next) {
	if (!no_authorization_router.includes(url.parse(req.url).pathname)) {
		let token = req.headers.authorization;
		if (token) {
			jwt.verify(token, require('./config/config').secretOrKey, (err, decoded) => {
				if (err) {
					switch (err.name) {
						case 'JsonWebTokenError':
							res.status(403).json({
								code: -1,
								msg: '无效的token'
							});
							break;
						case 'TokenExpiredError':
							res.status(403).json({
								code: -1,
								msg: 'token过期'
							});
							break;
					}
				} else {
					next()
				}
			})
		} else {
			res.status(401).json({
				status: 401,
				msg: '当前用户未登录！'
			})
		}
	} else {
		next()
	}
});




app.use("/api/users", require("./routers/api/users"));
app.use("/api/profiles", require("./routers/api/profiles"))




const port = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000, () => {
	console.log(`=========== Server running on port:${port} ===========`)
})
