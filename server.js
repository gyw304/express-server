const express = require("express");
const app = express();
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())


//DB config
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`DBSERVER connect`)
});



app.use("/api/users",require("./routers/api/users"))

const port = process.env.PORT || 5000;
app.get("/",(req,res)=>{
	res.send("Hello World")
})
app.listen(port,()=>{
	console.log(`Server running on port ${port}`)
})