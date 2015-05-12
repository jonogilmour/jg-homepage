"use strict";

var should = require("should");
var assert = require("assert");
var request = require("supertest");
var app = require("../../app");

describe("Routing", function() {
	// Base test
	it("/ should return status 200", function(done) {
		request(app)
		.get("/")
		.expect(200)
		.end(function(err, res) {
			if(err) throw err;
			done();	
		})
	});
	
	it("/404 should return status 404", function(done) {
		request(app)
		.get("/404")
		.expect(404)
		.end(function(err, res) {
			if(err) throw err;
			done();	
		})
	});
	
	it("/about should return status 200", function(done) {
		request(app)
		.get("/about")
		.expect(200)
		.end(function(err, res) {
			if(err) throw err;
			done();	
		})
	});
	
	it("/unknown should return status 404", function(done) {
		request(app)
		.get("/unknown")
		.expect(404)
		.end(function(err, res) {
			if(err) throw err;
			done();	
		})
	});
});