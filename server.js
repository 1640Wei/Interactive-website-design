/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ching Wei Lai   Student ID: 136893211   Date: 30 Sep 2022
*
*  Online (Cyclic) Link: ________________________________________________________
*
********************************************************************************/




var express = require("express");
const path = require("path");
const data = require("./blog-service.js");

var app = express();
app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;

function onHTTPSTART() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/",function(req,res){
    res.redirect("/about");
});

app.get("/blog", function(req,res) {
    res.sendFile(path.join(__dirname,"data/posts.json"));
});

app.get("/posts", function(req,res) {
    res.sendFile(path.join(__dirname,"data/posts.json"));
});

app.get("/categories", function(req,res) {
    res.sendFile(path.join(__dirname,"data/categories.json"));
});

app.use((req,res)=>{
    res.status(404).send("Page dose not exist, please contact your provider!!")
});

/*app.use((req,res)=>{
    res.status(404).sendFile(path.join(__dirname,"/views/404.html"));
});*/


app.get("/posts",(req,res) => {
    data.getAllPosts().then((data) => {
        res.json(data);
    });
});

app.get("/publishedPosts",(req,res) => {
    data.getPublishedPosts().then((data) => {
        res.json(data);
    });
});

app.get("/categories",(req,res) => {
    data.getCategories().then((data) => {
        res.json(data);
    });
});

data.initialize().then(function(){
    app.listen(HTTP_PORT,onHTTPSTART);
}).catch(function(err){
    console.log("Unable to start server: "+ err);
})