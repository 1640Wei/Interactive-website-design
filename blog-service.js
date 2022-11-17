 /*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Ching Wei Lai   Student ID: 136893211   Date: 18 Nov 2022
*
*  Online (Cyclic) Link: https://better-calf-scarf.cyclic.app
*
********************************************************************************/
//const fs = require("fs");

//let posts = [];
//let categories = [];

const Sequelize = require('sequelize');
var sequelize = new Sequelize('avzzbvkz', 'avzzbvkz', 'PHCmjluVOza5FKQrCAlzfrEUSJtI-nUm', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
  });
  
  var Category = sequelize.define('Category',{
    category: Sequelize.STRING
  })
  
  Post.belongsTo(Category, {foreignKey: 'category'});

  module.exports.initialize = function () {
    return new Promise(( resolve, reject) => {
      sequelize.sync().then(()=>{
        resolve();
      }).catch(()=>{
      reject("Unable to sync with database (initialize)");
    })   
    });
  };
  
  module.exports.getAllPosts = function () {
    return new Promise((resolve, reject) => {
      Post.findAll().then((data)=>{
        resolve(data);
      }).catch((err)=>{
        reject("No results returned (getAllPosts)");
      })
    });
  };
  






module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                posts = JSON.parse(data);

                fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        categories = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    });
}

module.exports.getAllPosts = function(){
    return new Promise((resolve,reject)=>{
        (posts.length > 0 ) ? resolve(posts) : reject("no results returned"); 
    });
}

module.exports.getPostsByCategory = function (categoryNum) {
    return new Promise(function (resolve, reject) {
      Post.findAll({
        where:{category: categoryNum}
      }).then((data)=>{
        resolve(data)
      }).catch((err)=>{
        reject("no results returned (getPostsByCategory)");
      })
    });
  };

const {gte} = Sequelize.Op;
module.exports.getPostsByMinDate = function (minDateStr) {
    return new Promise(function (resolve, reject) {
      Post.findAll({
        where:{[gte]: new Date(minDateStr)}
      }).then((data)=>{
        resolve(data)
      }).catch((err)=>{
        reject("no result returned (getPostsByMinDate)");
      })
    });
};


module.exports.getPostById = function(id){
    return new Promise((resolve,reject)=>{
        let foundPost = posts.find(post => post.id == id);

        if(foundPost){
            resolve(foundPost);
        }else{
            reject("no result returned");
        }
    });
}

module.exports.addPost = function(postData){
    return new Promise((resolve,reject)=>{
        postData.published = postData.published ? true : false;
        postData.id = posts.length + 1;
        posts.push(postData);
        resolve();
    });
}

module.exports.getPublishedPosts = function(){
    return new Promise((resolve,reject)=>{
        let filteredPosts = posts.filter(post => post.published);
        (filteredPosts.length > 0) ? resolve(filteredPosts) : reject("no results returned");
    });
}

module.exports.getCategories = function(){
    return new Promise((resolve,reject)=>{
        (categories.length > 0 ) ? resolve(categories) : reject("no results returned"); 
    });
}
 
 
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

