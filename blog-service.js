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

module.exports.getPostById = function (num) {
    return new Promise(function (resolve, reject) {
      Post.findAll({
        where:{id: num}
      }).then((data)=>{
        resolve(data[0])
      }).catch((err)=>{
        reject("requested Post cannot be displayed (getPostById)");
      })
    });
};

module.exports.addPost = function (postData) {
    return new Promise(function (resolve, reject) {
       postData.published = postData.published ? true : false;
       // blank field should be set to null
        postData.postDate = new Date();
       for(var d in postData){
         if(postData[d] == '') postData[d] = null;
        }
        Post.create(postData).then(()=>{
        resolve();
       }).catch((err)=>{
         reject("Unable to create post (addPost)");
       })
    });
};

module.exports.getPublishedPosts = function () {
    return new Promise(function (resolve, reject) {
      Post.findAll({
        where:{published: true}
      }).then((data)=>{
        resolve(data)
      }).catch((err)=>{
        reject("No publishedPosts to be displayed (getPublishedPosts)");
      })
    });
};

module.exports.getCategories = function () {
    return new Promise((resolve, reject) => {
      Category.findAll().then((data)=>{
        resolve(data);
      }).catch((err)=>{
        reject("No results returned (getCategories)");
      })
    });
};
 
 
module.exports.getPublishedPostsByCategory = function (categoryNum) {
    return new Promise(function (resolve, reject) {
      Post.findAll({
        where:{published: true, category: categoryNum}
      }).then((data)=>{
        resolve(data)
      }).catch((err)=>{
        reject("No publishedPosts with passed category to be displayed (getPublishedPostByCategory)");
      })
    });
};

module.exports.addCategory = function (categoryData) {
    return new Promise(function (resolve, reject) {
       Category.create(categoryData).then(()=>{
        // blank field should be set to null
        for(var d in categoryData){
          if(categoryData[d] == '') categoryData[d] = null;
        }
        resolve();
       }).catch((err)=>{
         reject("Unable to create category (addCategory)");
       })
    });
  };
  

module.exports.deleteCategoryById = function (id) {
    return new Promise(function (resolve, reject){
      Category.destroy({
        where:{id : id}}
        ).then(()=>{
        resolve("destroyed");
      }).catch((err)=>{
        reject("Unable to delete category (deleteCategoryById)")
      })
    })
};
  

module.exports.deletePostById = function (id) {
    return new Promise(function (resolve, reject){
      Post.destroy({
        where:{id : id}}
        ).then(()=>{
        resolve("destroyed");
      }).catch((err)=>{
        reject("Unable to delete post (deletePostById)")
      })
    })
};
