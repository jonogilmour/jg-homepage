"use strict";

var should = require("should");
var assert = require("assert");
var request = require("supertest");
var app = require("../../app");

describe("Routing", function() {
	// Base
	it("/ should return status 200", function(done) {
		request(app)
		.get("/")
		.expect(200)
		.end(function(err, res) {
			if(err) throw err;
			done();	
		})
	});
	
	// Navigation Links
	it("nav bar links should return status 200", function(done) {
		request(app)
		.get("/")
		.expect(200)
		.end(function(err, res) {
			if(err) throw err;
			console.log("\t- / passed");
			request(app)
			.get("/about")
			.expect(200)
			.end(function(err, res) {
				if(err) throw err;
				console.log("\t- /about passed");
				done();
			});
		});
	});
	
	// Front Page
	it("front page detail panel links should return status 200 (eg /work, /history, /about)", function(done) {
		request(app)
		.get("/work")
		.expect(200)
		.end(function(err, res) {
			if(err) throw err;
			console.log("\t- /work passed");
			
			request(app)
			.get("/history")
			.expect(200)
			.end(function(err, res) {
				if(err) throw err;
				console.log("\t- /history passed");
				
				request(app)
				.get("/about")
				.expect(200)
				.end(function(err, res) {
					if(err) throw err;
					console.log("\t- /about passed");
					
					done();	
				});
			});
		});
		
		
		
		
	});
	
	// Redirection
	it("/redirect-test should return status 302 and redirect to /about", function(done) {
		request(app)
		.get("/redirect-test")
		.expect(302)
		.end(function(err, res) {
			if(err) throw err;
			res.header["location"].should.containEql("about");
			done();	
		})
	});
	
	
});