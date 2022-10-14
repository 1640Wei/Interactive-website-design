/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ching Wei Lai   Student ID: 136893211   Date: 14 Oct 2022
*
*  Online (Cyclic) Link: https://better-calf-scarf.cyclic.app
*
********************************************************************************/

var express = require("express");
const path = require("path");
const data = require("./blog-service.js");

const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

var app = express();
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true })); 
const upload = multer();

var HTTP_PORT = process.env.PORT || 8080;
function onHTTPSTART() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function (req, res) {
    res.redirect("/about");
});

app.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/blog", function(req,res) {
    res.sendFile(path.join(__dirname,"data/posts.json"));
});

app.get("/categories", function(req,res) {
    res.sendFile(path.join(__dirname,"data/categories.json"));
});

app.get("/posts/add", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/addPost.html"));
 });

app.get("/posts", function (req, res) {
    if(req.query.category) {
        data.getPostsByCategory(req.query.category).then((data) =>{
        res.json(data);
    }).catch((err) => {
        res.json(err);
    })
    }
    else if(req.query.minDate){
        data.getPostsByMinDate(req.query.minDate).then((data) =>{
        res.json(data);
    }).catch((err) => {
        res.json(err);
    })
    }
    else{
        data.getAllPosts().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    })
    }
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

cloudinary.config({
    cloud_name: 'dyannnhat',
    api_key: '614847924866838',
    api_secret: 'IFlyyciCw5LxcOVNFjuiMlJFc2M',
    secure: true
});

app.post('/posts/add', upload.single("featureImage"), function (req, res, next){
    if(req.file) {
       let streamUpload = (req) => {
       return new Promise((resolve, reject) => {
       let stream = cloudinary.uploader.upload_stream((error, result) => {
    if (result) {
        resolve(result);
} else {
        reject(error);
}
});
streamifier.createReadStream(req.file.buffer).pipe(stream);
});
};

async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
};

upload(req).then((uploaded) => {
    processPost(uploaded.url);
});
}
    else {
        processPost("");
    }
function processPost(imageUrl){
req.body.featureImage = imageUrl;
// TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
};

blogService.addPost(req.body).then(() => {
res.redirect("/posts");
})
});