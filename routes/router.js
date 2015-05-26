"use strict";

/*
	Router module
	@param {Object} router
*/

var util = require("util");
var path = require("path");
var fs = require("fs");
var router = require("express").Router();
var contact_form = require("./contact-form.js");
module.exports = router;

var routeMap = require("./routes.json");

router.use(function(req, res, next) {
	console.log(req.method, req.url);
	next();
});

router.route("/")
.get(function(req, res) {
	var page = routeMap.home;
	if (typeof page === "object") {
		res.render(page.view, {layout: page.layout});
	}
	else {
		res.render(page, {layout: routeMap.default_layout});
	}
});

router.route("/api")
.get(function(req, res) {
	res.sendStatus(500);
});

router.route("/contact")
.post(contact_form);

router.route("/:page")
.get(function(req, res) {
	var page = routeMap[req.params.page];
	if (page) {
		// Page Redirects
		if(page.redirect) {
			var status = page.status || 302;
			res.redirect(status, page.target)
		}
		// Page Receives JSON Data
		else if(page.data && typeof page.data === "string" && page.data.length) {
			var layoutFile = routeMap.default_layout;
			if(page.layout) layoutFile = page.layout;
			// Read data file
			fs.readFile(path.join(__dirname, "..", page.data), function(err, data) {
				if(err) {
					console.log(err);
					res.status(404).render(routeMap._404, {layout: routeMap.default_layout});
					return;
				}
				else {
					try {
						var data = JSON.parse(data);
					} catch (err) {
						console.log(err);
						res.status(500).render(routeMap._500, {layout: routeMap.default_layout});
						return;
					}
					res.render(page.view, data);
				}
			});
			
		}
		else {
			if (typeof page === "object") {
				var layout;
				if(page.layout) {
					layoutFile = page.layout;
				}
				else {
					layoutFile = routeMap.default_layout;
				}
				res.render(page.view, {layout: layoutFile});
			}
			else {
				res.render(page, {layout: routeMap.default_layout});
			}
		}
	}
	else {
		res.status(404);
		
		if (req.accepts('html')) {
			res.render(routeMap._404, {layout: routeMap.default_layout});
			return;
		}
		
		// respond with json
		if (req.accepts('json')) {
			res.send({ error: 'Not found' });
			return;
		}
		
		// default to plain-text. send()
		res.type('txt').send('Not found');
	}
	
});