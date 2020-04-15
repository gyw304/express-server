const express = require("express");
const app = express();

var cors = require("cors"); //  cnpm install cors
app.use(cors({
	methods: ["GET", "POST"],
	alloweHeaders: ["Content-Type", "application/json;charset=utf-8;application/x-www-form-urlencoded"]
}));

const bodyParser = require("body-parser")
const passport = require("passport")
const jwt = require('jsonwebtoken');


app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json())






//DB config
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('=========== mongodb connect ===========')
});

//passport 初始化
app.use(passport.initialize());
require('./config/passport')(passport);

// app.use(function(req, res, next) {
// 	var url = req.originalUrl;
// 	console.log(req.headers.authorization)
// 	if (url != "/api/users/login") {
// 		console.log('需要验证'+url)
// 	}
// 	next();
// });


app.use(function(req, res, next) {
	
	if (req.url != '/api/users/login' && '/api/users/register') {
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
