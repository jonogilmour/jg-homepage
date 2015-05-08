"use strict";

/*
	Router module
	@param {Object} router
*/

var router = require("express").Router();
module.exports = router;

router.use(function(req, res, next) {
	console.log(req.method, req.url);
	next();
});

// ENCAPSULATE IN A "base.js" ROUTE FILE
router.route("/")
	.get(function(req, res) {
		res.render("home", {layout: "index"});
	});

router.route("/about")
	.get(function(req, res) {
		res.render("about", {layout: "index"});
	});

router.get("/test", function(req, res) {
	var data = "{" +
		"\"a\":\"hello\"," +
		"\"b\":\"world\"," +
		"\"c\":2,\n" +
		"\"d\":true\n" +	
	"}";
	console.log(data);
	data = JSON.parse(data);
	console.log(data);
	res.send(data.a.toString());
});

/////////////////////////////////////////

/* 

	Method to do json routing for static files

	- Create a json file, like so:
		{
			"home" : "home.html",
			"about" : "about.html",
			...
		}
	- Import this file and read the contents into a variable
	- Create a route for "/:page" and validate that the page exists using param
	- If it exists, grab routes[req.params.page] and send that file as the response for a GET
	
	This way, all routes can be encapsulated into a JSON file, instead of altering code. All requests can be served by a single method, instead of individual method for each page. This also means that by validating the requested page, a 404 page can be sent instead, and using the same method we can create a 404.html page
	
	A good method to set the layout file is using an array or object, eg:
	
		routes {
			"default_layout" : "index.html",
			"home" : {
				"view" : "home.html",
				"layout" : "index.html"
			},
			"about" : "about.html",
			...
		}
		
	Then we can switch layouts and views on the fly without changing code.
	
	This can be dynamic and smart. Check the typeof a route. If it is a string, then use the default_layout file, otherwise use the layout file given. If that layout file doesn't exist, then default as well. This way we have a default layout (index.html) and a default view (404.html).
	
	First validate the view, then the layout. If the view fails, we automatically go for default layout and default view (404), but if the layout fails, we only go for the default layout.
*/

