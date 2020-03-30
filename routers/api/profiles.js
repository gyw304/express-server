const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../../models/User");
const Profile = require("../../models/Profile");


/* 
	$router GET api/profiles/test
	@desc   返回请求的json数据
 */
router.get("/test",(req,res)=>{
	res.json({
		msg : "profile works"
	})
})


/* 
	$router GET api/profiles
	@desc   获取当前登录用户的个人信息
 */
router.get("/",passport.authenticate('jwt', { session: false }),(req,res)=>{
	Profile.findOne({uid:req.user.id})
		   .populate('uid',["name","email"])
		   .then((profile) => {
			   if(!profile){
				   return res.json({
					   code : 0,
					   msg : '该用户的信息不存在'
				   })
			   }
			   res.json(profile)
		   })
})

/* 
	$router POST api/profiles/create
	@desc   创建个人信息
 */
router.post("/create",passport.authenticate('jwt', { session: false }),(req,res)=>{
	let profile_data = {};

	profile_data.uid = req.user.id;
	profile_data.description = req.body.description;
	
	if(typeof req.body.skills !== 'undefined'){
		profile_data.skills = req.body.skills.split(",");
	}
	
	console.log(req.user)
	
	
	Profile.findOne({uid:req.user.id})
		   .then(profile => {
			   
			   if(profile){
				   //存在用户信息
				   return res.json({
					   code : 0,
					   msg : '已经存在用户信息'
				   })
			   }
			   else{
				   new Profile(profile_data).save().then(profile => res.json(profile))
				   //创建用户信息
			   }
		   })
})



/* 
	$router GET api/profiles/all
	@desc   获取所有的个人信息
 */
router.get("/all",(req,res)=>{
	Profile.find()
		   .populate('uid',["name","email"])
		   .then(profiles => {
			   if(profiles.length <= 0){
				   res.json({
					   code : 1,
					   msg : '还没有用户信息'
				   })
			   }else{
				   res.json({
					   code : 1,
					   data : profiles,
					   msg : 'success'
				   })
			   }
		   })
})



/* 
	$router POST api/profiles/create_exp
	@desc   创建个人经历
 */
router.post("/create_exp",passport.authenticate('jwt', { session: false }),(req,res)=>{

	Profile.findOne({uid:req.user.id})
		   .then(profile => {
			   
			   let exp = {
				   title : req.body.title,
				   company : req.body.company,
				   location : req.body.location,
				   from : req.body.from,
				   to : req.body.to,
				   description : req.body.description
			   }
			   
			   profile.experience.unshift(exp);
			   
			   profile.save().then(profile => {res.json(profile)}).catch(err => console.log(err))
			   
			   
		   })
})

/* 
	$router POST api/profiles/del_exp
	@desc   删除个人经历
 */
router.post("/del_exp",passport.authenticate('jwt', { session: false }),(req,res)=>{

	Profile.findOne({uid:req.user.id})
		   .then(profile => {
			  
				const index = profile.experience.findIndex(item => item._id === req.body.exp_id);
				profile.experience.splice(index,1)
			   
			    profile.save().then(profile => {res.json(profile)}).catch(err => console.log(err))
			   
			   
		   })
})







module.exports = router;