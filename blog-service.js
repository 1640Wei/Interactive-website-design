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
const fs = require("fs");

let posts = [];

module.exports.initialize = function() {
    return new Promise ((resolve,reject) => {
        fs.readFile('./data/posts.json'),(err,data) => {
            if(err){
                reject("unable to read file");
            }
            else {
                posts = JSON.parse(data)
                resolve();
            }
        }
    })
}

module.exports.getAllPosts = function() {
    return new Promise((resolve,reject) => {
        if (posts.length == 0) {
            reject("File is empty, no posts to be displayed.");
        }
        else {
            resolve(posts);
        }
    })
}

module.exports.getPublishedPosts = function() {
    return new Promise((resolve,reject) => {
        if (posts.length == 0) {
            reject("File is empty, no posts to be displayed.");
        }
        else {
            resolve(posts.published == true)
        }
    })
}

module.exports.getCategories = function() {
    return new Promise((resolve,reject) => {
        if(categories.length == 0) {
            reject("File is empty, no categories to be displayed.");
        }
        else {
            resolve (categories);
        }
    })
}
