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

var Category = sequelize.define('Category', {
    category: Sequelize.STRING
});


var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
    category: Sequelize.STRING
});
Post.belongsTo(Category, {foreignKey: 'category'});


module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve('operation was a success');
        }).catch(() => {
            reject("unable to sync the database");
        });
    })
}

module.exports.getAllPosts = function(){
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Post.findAll());
        }).catch((err) => {
            reject("no results returned.");
        });
    });
}

module.exports.getPostsByCategory = function(category){
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
            }
        }).then((data) => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

const { gte } = Sequelize.Op;
module.exports.getPostsByMinDate = function(minDateStr) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        }).then((data) => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getPostById = function(id){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where: {
                id: id
            }
        }).then((data) => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.addPost = function(postData){
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for (let key in postData) {
                if(postData[key] == ""){
                    postData[key] = null;
                }
            }
            Post.create({
                body: postData.body,
                title: postData.title,
                postDate: postData.postDate,
                featureImage: postData.featureImage,
                published: postData.published,
                category: postData.category
            }).then(() => {
                resolve(Post);
            }).catch((err) => {
                reject("unable to create post.");
            });
        }).catch(() => {
            reject("unable to create post.");
        });
    });
}

module.exports.getPublishedPosts = function(){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where: {
                published: true
            }
        }).then((data) => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getPublishedPostsByCategory = function(category){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then((data) => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getCategories = function(){
    return new Promise((resolve,reject)=>{
        Category.findAll().then((data) => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.addCategory = function(categoryData) {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for(let x in categoryData){
                if(categoryData[x] == "") {
                    categoryData[x] = null;
                }
            }
            Category.create({
                category: categoryData.category
            }).then(() => {
                resolve(Category);
            }).catch((err) => {
                reject("unable to create category.");
            });
        }).catch(() => {
            reject("unable to create category.");
        });
    });
}

module.exports.deleteCategoryById = function(id) {
    return new Promise((resolve, reject) => {
        Category.destroy({
            where: {
                id: id
            }
        }).then(() => {
            resolve("category removed");
        }).catch(() => {
            reject("unable to delete category");
        });
    });
}

module.exports.deletePostById = function(id) {
    return new Promise((resolve, reject) => {
        Post.destroy({
            where: {
                id: id
            }
        }).then(() => {
            resolve("post removed");
        }).catch(() => {
            reject("cannot delete post");
        });
    });
}