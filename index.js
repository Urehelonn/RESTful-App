var bodyparser = require("body-parser");
var express = require("express");
var app = express();
var mongoose = require("mongoose");


//app config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/restful", { useNewUrlParser: true });

//mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    imgae: {type: String, default: "placeholder"},
    body: String,
    created: {type:Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);


app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            res.send("error!");
        }
        else{
            res.render("index", {blogs});
        }
    });
});
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server running"); 
});