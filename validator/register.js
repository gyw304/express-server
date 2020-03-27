const Validator = require("validator");
const isEmpty


module.exports = function validator_register(data){
	let errors = {};
	if(!Validator.isLength(data.name,{min:2,max:30})){
		errors.name = "名字的长度不能小于2位";
	}
	return{
		errors,
		isValid:
	}
}