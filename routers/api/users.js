const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Validator = require("validator");
var jwt = require('jsonwebtoken');
const passport = require("passport");

const User = require("../../models/User");


/* 
	$router POST api/users/test
	@desc   返回json数据
 */
router.post("/register",(req,res)=>{
	
	if(!Validator.isEmail(req.body.email)){
		return res.json({
			code : 0,
			msg : '请输入正确Email格式'
		})
	}
	
	if(!Validator.isLength(req.body.password,{min:6,max:10})){
		return res.json({
			code : 0,
			msg : '密码必须大于6位并且小于10位'
		})
	}

	//查询数据库中是否拥有邮箱
	User.findOne({email:req.body.email})
		.then((user) => {
			if(user){
				return res.status(400).json({msg:"邮箱已被注册"})
			}else{
			
				const newUser = new User({
					name : req.body.name,
					email: req.body.email,
					password:req.body.password
				})

				bcrypt.genSalt(10,function(err,salt){
					bcrypt.hash(newUser.password,salt,function(err,hash){
						if(err) throw err;
						newUser.password = hash;
						
						newUser.save()
							   .then(user => res.json(user))
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
router.post("/login",(req,res)=>{
	const email = req.body.email;
	const password = req.body.password;
	
	
	if(!Validator.isEmail(req.body.email)){
		return res.json({
			code : 0,
			msg : '请输入正确Email格式'
		})
	}
	
	if(!Validator.isLength(req.body.password,{min:6,max:10})){
		return res.json({
			code : 0,
			msg : '密码必须大于6位并且小于10位'
		})
	}
	
	
	User.findOne({email:email})
		.then(user => {
			if(!user){
				return res.status(404).json({msg:'用户不存在'})
			}
			
			//密码匹配
			bcrypt.compare(password, user.password)
				  .then(isMath => {
					  if(isMath){
						  const rule = {id:user._id,name:user.name};
						  jwt.sign(rule,require("../../config/config").secretOrKey,{expiresIn:3600},(err,token)=>{
							  if(err) throw err;
							  res.json({
								  msg : 'success',
								  token : 'Bearer '  + token
							  })
						  })
					  }else{
						  return res.status(400).json({msg:'密码错误'})
					  }
				  })
			
		})
})


/* 
	$router GET api/users/current
	@desc   return current user
 */
router.get("/current",passport.authenticate('jwt', { session: false }),(req,res)=>{
	res.json({
		id : req.user.id,
		name : req.user.name,
		email : req.user.email
	})
})


module.exports = router