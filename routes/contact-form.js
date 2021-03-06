"use strict";

var nodemailer = require('nodemailer');
var AWS = require("aws-sdk");
var s3 = new AWS.S3();
var routeMap = require("./routes.json");

/**
 * Gives functionality to the contact form, with descriptive error messages and
 * facilities to accomodate both Javascript AJAX and JS-less requests.
 * 
 * Retrieves mail authentication data securely from S3
 */
module.exports = 
function(req, res) {
	s3.getObject({Bucket: "heroku.jonogilmour", Key: "auth.json"},
		function(err, data) {
			
			// Check if this request was done via AJAX
			var aj = req.body.ajaxOn;
			
			if(!aj) {
				// If not done via AJAX, we do validation and data retention on the server
				var msgSuccess = {
					info_msg: "Message sent!",
					info_class: "jg-success",
					retain: {
						name: req.body.name,
						email: req.body.email
					}
				};
				var msgWarn = {
					info_msg: "Looks like you left some fields empty",
					info_class: "jg-warning",
					retain: {
						name: req.body.name,
						email: req.body.email,
						subject: req.body.subject,
						message: req.body.message
					}
				};
				var msgError = {
					info_msg: "An error occurred, please try again later",
					info_class: "jg-error",
					retain: {
						name: req.body.name,
						email: req.body.email,
						subject: req.body.subject,
						message: req.body.message
					}
				};
				
				
				//-- AUTHENTICATION --//
				
				// Auth file errors
				if (err) {
					console.log(err);
					res.render(routeMap.contact, msgError);
					return;
				}
				
				// Check for missing elements
				if(!req.body.name || !req.body.email || !req.body.subject || !req.body.message) {
					//add fail message
					console.log("- Error: One or more contact fields does not exist");
					console.log("-- name: " + req.body.name);
					console.log("-- email: " + req.body.email);
					console.log("-- subject: " + req.body.subject);
					console.log("-- message: " + req.body.message);
					res.render(routeMap.contact, msgWarn);
					return;
				}
				
				// Check for empty fields
				if(!req.body.name.length || !req.body.email.length || !req.body.subject.length || !req.body.message.length) {
					//add fail message
					console.log("- Can't send mail - empty field(s)");
					res.render(routeMap.contact, msgWarn);
					return;
				}
				
				// Form validation (email)
				if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/.test(req.body.email)) {
					msgWarn.info_msg = "Please check your email address"
					res.render(routeMap.contact, msgWarn);
					return;
				}
			}
			
			//-- AUTH DONE, BEGIN MAIL SEND --//
			
			// Grab the authentication data
			var authFile = JSON.parse(data.Body.toString());
			
			// Setup Nodemailer transport
			var transporter = nodemailer.createTransport('SMTP', {
				service: 'Gmail',
				auth: authFile.auth
			});
			
			// Mail options
			var options = {
			  from: req.body.name + " <jonogapi@gmail.com>",
			  to: authFile.to,
			  subject: "JG Get in Contact: " + req.body.subject,
			  text: "From: " + req.body.name + " <"+req.body.email+">\nMessage:\n\n" + req.body.message
			};
			
			// Send email with callback
			transporter.sendMail(options, function(error, info){
			    if(error){
			    	if(!aj) {
			    		res.status(500);
			    		res.render(routeMap.contact, msgError);
			    	}
			    	else {
			    		res.sendStatus(500);
			    	}
			    	console.log(error);
			        return;
			    }
			    console.log("- Message sent: " + info.response);
			    
			    if(!aj) {
			    	res.status(201);
			    	res.render(routeMap.contact, msgSuccess);
			    }
			    else {
			    	res.sendStatus(201);
			    }	
			});
	});
}