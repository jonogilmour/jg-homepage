"use strict";

var should = require("should");
var assert = require("assert");
var request = require("supertest");
var app = require("../../app");

describe("GET routes", function() {
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
	
	// Work Page
	it("/work should return status 200", function(done) {
		request(app)
		.get("/work")
		.expect(200)
		.end(function(err, res) {
			if(err) throw err;
			done();
		});
		
	});
	
	// History Page
	it("/history should return status 200", function(done) {
		request(app)
		.get("/history")
		.expect(200)
		.end(function(err, res) {
			if(err) throw err;
			done();
		});
		
	});
	
	// About Page
	it("/about should return status 200", function(done) {
		request(app)
		.get("/about")
		.expect(200)
		.end(function(err, res) {
			if(err) throw err;
			done();
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
	
	// Media
	it("sample image should return 200", function(done) {
		request(app)
		.get("/media/sample.jpg")
		.expect(200)
		.end(function(err, res) {
			if(err) throw err;
			done();	
		})
	});
	
	// 404 cascade
	it("should 404 when an unspecified route is hit", function(done) {
		request(app)
		.get("/a/b/c/d/e/f/g/h/xxxx")
		.expect(404)
		.end(function(err, res) {
			if(err) throw err;
			done();	
		})
	});
});

describe("POST routes", function() {
	// Test contact form
	it("/contact should succeed", function(done) {
		request(app)
		.post("/contact")
		.field("name", "Mocha Jones")
		.field("email", "mocha@testemail.com")
		.field("subject", "This is the subject")
		.field("message", "Hello there! This is a test. Love from Mocha")
		.end(function(err, res) {
			if(err) throw err;
			done();	
		})
	});
})