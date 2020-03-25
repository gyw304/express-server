const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
//var token = jwt.sign({ foo: 'bar' }, 'shhhhh');


const User = require("../../models/User")

/* 
	$router GET api/users/test
	@desc   返回json数据
 */
router.get("/test",(req,res)=>{
	res.json({msg:"login works"})
})

/* 
	$router POST api/users/test
	@desc   返回json数据
 */
router.post("/register",(req,res)=>{

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
					  jwt.sign(rule,"secret",{expiresIn:3600},(err,token)=>{
						  if(err) throw err;
						  res.json({
							  msg : 'success',
							  token : token
						  })
					  })
				  }else{
					  return res.status(400).json({msg:'密码错误'})
				  }
			  })
		
	})
})


module.exports = router