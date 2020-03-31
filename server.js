const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const passport = require("passport")


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  res.header('Access-Control-Request-Method:GET,POST');
  next();
});




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



app.use("/api/users",require("./routers/api/users"));
app.use("/api/profiles",require("./routers/api/profiles"))




const port = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000,()=>{
	console.log(`=========== Server running on port:${port} ===========`)
})