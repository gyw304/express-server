const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const passport = require("passport")


app.use(bodyParser.urlencoded({extended:false}));
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



app.use("/api/users",require("./routers/api/users"));
app.use("/api/profiles",require("./routers/api/profiles"))




const port = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000,()=>{
	console.log(`=========== Server running on port:${port} ===========`)
})