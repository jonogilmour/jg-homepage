"use strict";

/*
	Router module
	@param {Object} router
*/

var nodemailer = require('nodemailer');
var util = require("util");
var path = require("path");
var fs = require("fs");
var router = require("express").Router();
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
.post(function(req, res) {
	// Contact email message
	var msgSuccess = {
		info_msg: "Message sent!",
		info_class: "jg-success"
	}
	var msgWarn = {
		info_msg: "Looks like you left some fields empty",
		info_class: "jg-warning"
	}
	var msgError = {
		info_msg: "An error occurred, please try again later",
		info_class: "jg-error"
	}
	
	// Check for empty fields
	if(!req.body.name.length || !req.body.email.length || !req.body.subject.length || !req.body.message.length) {
		//add fail message
		console.log("- Can't send mail - empty field(s)");
		res.render(routeMap.contact, msgWarn);
		return;
	}
	
	//Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
	var transporter = nodemailer.createTransport('SMTP', {
		service: 'Gmail',
		auth: {
		  user: "jonogapi@gmail.com",
		  pass: "azureus8992" 
		}
	});
	//Mail options
	var options = {
	  from: req.body.name + ' &lt;' + req.body.email + '&gt;', //grab form data from the request body object
	  to: 'jonathan.d.gilmour@gmail.com',
	  subject: "JG Get in Contact: " + req.body.subject,
	  text: req.body.message
	};
	
	transporter.sendMail(options, function(error, info){
	    if(error){
	    	res.render(routeMap.contact, msgError);
	        return console.log(error);
	    }
	    console.log("- Message sent: " + info.response);

	});
	
	res.render(routeMap.contact, msgSuccess);
});

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