var bodyparser = require("body-parser");
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var methodOverride=require("method-override");
var sanitizer=require("express-sanitizer");

//app config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(sanitizer());
mongoose.connect("mongodb://localhost:27017/restful", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

//mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    img: {type: String, default: "placeholder"},
    body: String,
    created: {type:Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//index route
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
//new route
app.get("/blogs/new", function(req, res){
    res.render("new");
});
//create route
app.post("/blogs", function(req,res){
    //create blog
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, nblog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});
//show route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            res.send(err);
        }
        else{
            res.render("show", {blog});
        }
    });
});
//edit route
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            res.send(err);
        }
        else{
            res.render("edit", {blog});
        }
    });
});
//update route
app.put("/blogs/:id", function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
        if(err){
            res.send(err);
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
//destroy route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err, blog){
       if(err){
           res.send(err);
       } 
       else{
           res.redirect("/blogs");
       }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server running"); 
});