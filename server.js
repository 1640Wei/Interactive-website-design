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
 
var express = require("express");
var blog_service = require("./blog-service");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
var app = express();
var path = require("path");
const multer = require("multer");
const upload = multer(); 
const exphbs = require("express-handlebars");
const stripJs = require("strip-js");

var HTTP_PORT = process.env.PORT || 8080;

app.engine(
	".hbs",
	exphbs.engine({
		extname: ".hbs",
		helpers: {
			navLink: function (url, options) {
				return (
					"<li" + (url == app.locals.activeRoute ? ' class="active" ' : "") +
					'><a href="' + url + '">' + options.fn(this) + "</a></li>"
				);
			},
			equal: function (lvalue, rvalue, options) {
				if (arguments.length < 3)
					throw new Error("Handlebars Helper equal needs 2 parameters");
				if (lvalue != rvalue) {
					return options.inverse(this);
				} else {
					return options.fn(this);
				}
			},
			safeHTML: function (context) {
				return stripJs(context);
			},
		},
	})
);
app.set("view engine", ".hbs");


cloudinary.config({
	cloud_name: 'dyannnhat',
    api_key: '614847924866838',
    api_secret: 'IFlyyciCw5LxcOVNFjuiMlJFc2M',
    secure: true,
});

function onHttpStart() {
	console.log("Express http server listening on: " + HTTP_PORT);
}


app.use(express.static("public"));

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});



app.get("/", (req, res) => {
	res.redirect("/blog");
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.get("/blog", async (req, res) => {
	// Declare an object to store properties for the view
	let viewData = {};

	try {
		// declare empty array to hold "post" objects
		let posts = [];

		// if there's a "category" query, filter the returned posts by category
		if (req.query.category) {
			// Obtain the published "posts" by category
			posts = await blog_service.getPublishedPostsByCategory(
				req.query.category
			);
		} else {
			// Obtain the published "posts"
			posts = await blog_service.getPublishedPosts();
		}

		// sort the published posts by postDate
		posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

		// get the latest post from the front of the list (element 0)
		let post = posts[0];

		// store the "posts" and "post" data in the viewData object (to be passed to the view)
		viewData.posts = posts;
		viewData.post = post;
	} catch (err) {
		viewData.message = "no results";
	}

	try {
		// Obtain the full list of "categories"
		let categories = await blog_service.getCategories();

		// store the "categories" data in the viewData object (to be passed to the view)
		viewData.categories = categories;
	} catch (err) {
		viewData.categoriesMessage = "no results";
	}

	// render the "blog" view with all of the data (viewData)
	res.render("blog", { data: viewData });
});

app.get("/blog/:id", async (req, res) => {
	// Declare an object to store properties for the view
	let viewData = {};

	try {
		// declare empty array to hold "post" objects
		let posts = [];

		// if there's a "category" query, filter the returned posts by category
		if (req.query.category) {
			// Obtain the published "posts" by category
			posts = await blog_service.getPublishedPostsByCategory(
				req.query.category
			);
		} else {
			// Obtain the published "posts"
			posts = await blog_service.getPublishedPosts();
		}

		// sort the published posts by postDate
		posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

		// store the "posts" and "post" data in the viewData object (to be passed to the view)
		viewData.posts = posts;
	} catch (err) {
		viewData.message = "no results";
	}

	try {
		// Obtain the post by "id"
		viewData.post = await blog_service.getPostById(req.params.id);
	} catch (err) {
		viewData.message = "no results";
	}

	try {
		// Obtain the full list of "categories"
		let categories = await blog_service.getCategories();

		// store the "categories" data in the viewData object (to be passed to the view)
		viewData.categories = categories;
	} catch (err) {
		viewData.categoriesMessage = "no results";
	}

	// render the "blog" view with all of the data (viewData)
	res.render("blog", { data: viewData });
});

app.get("/posts", (req, res) => {
	var error = { message: "" };
	var category = Number(req.query.category);
	var minDate = req.query.minDate;
	if (!category && !minDate) {
		blog_service
			.getAllPosts()
			.then((data) => res.render("posts", { data: data }))
			.catch((err) => {
				error.message = err;
				res.render("posts", error);
			});
	} else if (Number.isInteger(category)) {
		blog_service
			.getPostsByCategory(category)
			.then((data) => {
				res.render("posts", { data: data });
			})
			.catch((err) => {
				error.message = err;
				res.render("posts", error);
			});
	} else if (minDate) {
		blog_service
			.getPostsByMinDate(minDate)
			.then((data) => res.render("posts", { data: data }))
			.catch((err) => {
				error.message = err;
				res.render("posts", error);
			});
	}
});

app.get("/categories", (req, res) => {
	var error = { message: "" };
	blog_service
		.getCategories()
		.then((data) => res.render("categories", { data: data }))
		.catch((err) => {
			error.message = err;
			res.render("categories", error);
		});
});

app.get("/posts/add", (req, res) => {
	res.render("addPost");
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
	if (req.file) {
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
		}

		upload(req).then((uploaded) => {
			req.body.featureImage = uploaded.url;
		});
	} else {
		req.body.featureImage = "";
	}

	blog_service
		.addPost(req.body)
		.then(() => {
			res.redirect("/posts");
		})
		.catch((msg) => res.send(msg));
});

app.get("/posts/:id", (req, res) => {
	var error = { message: "" };
	var id = Number(req.params.id);
	blog_service
		.getPostById(id)
		.then((data) => res.json(data))
		.catch((err) => {
			error.message = err;
			res.json(error);
		});
});

app.use((req,res)=>{
    res.status(404).send("Page dose not exist, please contact your provider!!")
});


blog_service
	.initialize()
	.then(() => app.listen(HTTP_PORT, onHttpStart))
	.catch((err) => console.log(err));