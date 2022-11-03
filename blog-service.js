 /*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Ching Wei Lai   Student ID: 136893211   Date: 4 Nov 2022
*
*  Online (Cyclic) Link: https://better-calf-scarf.cyclic.app
*
********************************************************************************/
 /*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Ching Wei Lai   Student ID: 136893211   Date: 4 Nov 2022
*
*  Online (Cyclic) Link: https://better-calf-scarf.cyclic.app
*
********************************************************************************/
const fs = require("fs");
 
let posts = [];
 
module.exports.initialize = function() {
    return new Promise ((resolve,reject) => {
        fs.readFile('./data/posts.json',(err,data) => {
            if(err){
                reject("Unable to read file");
            }
            else {
                posts = JSON.parse(data);
                resolve();
            }
        });
    });
}
 
module.exports.getAllPosts = function() {
    return new Promise((resolve,reject) => {
        if (posts.length == 0) {
            reject("File is empty, no posts to be displayed.");
        }
        else {
            resolve(posts);
        }
    });
}
 
module.exports.getPublishedPosts = function() {
    return new Promise((resolve,reject) => {
        var filterPosts = [];
        for (let i = 0; i < posts.length; i++){
            if(posts[i].published == true) {
                filterPosts.push(posts[i]);
            }
        }
        if (filterPosts.length == 0) {
            reject("No Published Post found.");
        }
        else {
            resolve(filterPosts);
        }
    });
}
 
module.exports.getCategories = function() {
    return new Promise((resolve,reject) => {
        if(categories.length == 0) {
            reject("File is empty, no categories to be displayed.");
        }
        else {
            resolve (categories);
        }
    });
}
 
module.exports.addPost = function(postData){
    return new Promise((resolve, reject) => {
        postData.id = postsArray.length +1;
        postData.published = (postData.published)? true: false;
        postsArray.push(postData);
        resolve();    
    });
};
 
module.exports.getPostsByCategory = (category)=>{
    return new Promise((resolve,reject) => {
        let filteredPosts = postsArray.filter((post)=>post.category==category);
        if(filteredPosts.length == 0){
            reject("no result returned");
        }else {
            resolve(filteredPosts);
        }
    });
};
 
module.exports.getPostsByMInDate = (minDateStr) =>{
    return new Promise((resolve,reject)=>{
        let filteredPosts = postsArray.filter(
            (post) => new Date(post.postDate) >= new Date(minDateStr)
        );
        if(filteredPosts.length == 0){
            reject("no result returned");
        }
        else {
            resolve(filteredPosts);
        }
    });
};
 
module.exports.getPostById = (Id) =>{
    return new Promise((resolve,reject) => {
    let filteredPosts = postsArray.filter((post)=>post.id== Id);
    if(filteredPosts.length == 0){
        reject("no result returned");
    }else {
        resolve(filteredPosts);
    }
});
};
 
 
function getPublishedPostsByCategory(category){
    return new Promise((resolve, reject) => {
        if(posts.length === 0) {
            reject('No results returned');
        } else {
            resolve(posts.filter(post => {
                return post.published == true && post.category == category;
            }));
        }
    })
}

