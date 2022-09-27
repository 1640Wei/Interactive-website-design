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
var app = express();
app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.listen(HTTP_PORT);