const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Validator = require("validator");
var jwt = require('jsonwebtoken');
const passport = require("passport");

const User = require("../../models/User");


const request = require('request');


/* 
	$router POST api/users/test
	@desc   返回json数据
 */
router.post("/register", (req, res) => {

	if (!Validator.isEmail(req.body.email)) {
		return res.json({
			code: 0,
			msg: '请输入正确Email格式'
		})
	}

	if (!Validator.isLength(req.body.password, {
			min: 6,
			max: 10
		})) {
		return res.json({
			code: 0,
			msg: '密码必须大于6位并且小于10位'
		})
	}

	//查询数据库中是否拥有邮箱
	User.findOne({
			email: req.body.email
		})
		.then((user) => {
			if (user) {
				return res.json({
					code: 0,
					msg: "邮箱已被注册",
				})
			} else {

				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password
				})

				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(newUser.password, salt, function(err, hash) {
						if (err) throw err;
						newUser.password = hash;
						newUser.save()
							.then(user => res.json({
								code: 1,
								//data: user,
								msg: '注册成功'
							}))
							.catch(err => console.log(err))
					})
				})
			}
		})
})


/* 
	$router POST api/users/login
	@desc   返回token jwt passport
 */
router.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;


	if (!Validator.isEmail(email)) {
		return res.json({
			code: 0,
			msg: '请输入正确Email格式'
		})
	}

	if (!Validator.isLength(password, {
			min: 6,
			max: 10
		})) {
		return res.json({
			code: 0,
			msg: '密码必须大于6位并且小于10位'
		})
	}


	User.findOne({
			email: email
		})
		.then(user => {
			if (!user) {
				return res.json({
					code: 0,
					msg: '用户不存在'
				})
			}

			//密码匹配
			bcrypt.compare(password, user.password)
				.then(isMath => {
					if (isMath) {
						const rule = {
							id: user._id
						};
						jwt.sign(rule, require('../../config/config').secretOrKey, {
							expiresIn: 3600
						}, (err, token) => {
							if (err) throw err;
							res.json({
								code: 1,
								data: {
									userInfo: user,
									token: token
								},
								msg: 'success'
							})
						})
					} else {
						return res.json({
							code: 0,
							msg: '密码错误'
						})
					}
				})

		})
})


/* 
	$router GET api/users/current
	@desc   return current user
 */
router.get("/current", (req, res) => {
	let token = req.headers.authorization;
	jwt.verify(token, require('../../config/config').secretOrKey, (err, decoded) => {
		console.log(decoded.id)
	})
})
module.exports = router
