const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const ProfileSchema = new Schema({
	uid:{
		type:Schema.Types.ObjectId,
		ref:"_users"
	},
	description:{
		type:String,
		default:"这个人很懒，还没有个人简历"
	},
	skills:{
		type:[String],
		required:true
	},
	experience:[
		{
			current:{
				type:Boolean,
				default:true
			},
			title:{
				type:String,
				required:true
			},
			company:{
				type:String,
				required:true
			},
			location:{
				type:String
			},
			from:{
				type:String,
				required:true
			},
			to:{
				type:String
			},
			description:{
				type:String
			}
		}
	],
	date:{
		type:Date,
		default:Date.now
	}
})

module.exports = Profile = mongoose.model("_profile",ProfileSchema)