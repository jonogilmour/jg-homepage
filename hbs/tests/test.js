"use strict";

var should = require("should");
var assert = require("assert");
var request = require("supertest");
var helpers = require("../helpers");

describe("image(name)", function() {
	var image = helpers.image;
	
	// Test errors
	it("passing in a number should return 'image-error'", function(done) {
		image(1).should.be.exactly("image-error");
		done();
	});
	it("passing in null should return 'image-error'", function(done) {
		image(null).should.be.exactly("image-error");
		done();
	});
	it("passing in undefined should return 'image-error'", function(done) {
		image(undefined).should.be.exactly("image-error");
		done();
	});
	it("passing in an array should return 'image-error'", function(done) {
		image([1,2,3]).should.be.exactly("image-error");
		done();
	});
	it("passing in an object should return 'image-error'", function(done) {
		image({a:"hello"}).should.be.exactly("image-error");
		done();
	});
	it("passing in nothing should return 'image-error'", function(done) {
		image().should.be.exactly("image-error");
		done();
	});
	
	// Test success
	it("should return a path that ends with the string passed in", function(done) {
		image("hello").should.match(/\/hello$/);
		done();
	});
});

describe("comma(array)", function() {
	var comma = helpers.comma;
	
	// Test errors
	it("should return 'comma-error' if nothing is passed in", function(done) {
		comma().should.be.exactly("comma-error");
		done();
	});
	it("should return 'comma-error' if an empty array is passed in", function(done) {
		comma([]).should.be.exactly("comma-error");
		done();
	});
	it("should return 'comma-error' if an object is passed in", function(done) {
		comma({hello: "yes"}).should.be.exactly("comma-error");
		done();
	});
	it("should return 'comma-error' if a string is passed in", function(done) {
		comma("hello").should.be.exactly("comma-error");
		done();
	});
	it("should return 'comma-error' if a number is passed in", function(done) {
		comma(5).should.be.exactly("comma-error");
		done();
	});
	it("should return 'comma-error' if an array with nesting is passed in", function(done) {
		comma([["hello"], "hey"]).should.be.exactly("comma-error");
		done();
	});
	
	// Test success
	it("should return a comma-separated list of values from an array", function(done) {
		comma(["hey", "hello", 5]).should.match(/^([^,]*, )*[^,]*$/);
		done();
	});
	it("the final string in an array should be printed without a comma", function(done) {
		comma(["hey"]).should.match(/^([^,]*, )*[^,]*$/);
		done();
	});
});

describe("year()", function() {
	var year = helpers.year;
	
	 it("should return a string", function(done) {
	 	year().should.be.string;
	 	done();
	 });
	 it("should return the current year in string form", function(done) {
	 	year().should.be.exactly(new Date().getFullYear().toString());
	 	done();
	 });
});

describe("list(items)", function() {
	var list = helpers.list;
	
	// Test errors
	 it("should return 'list-error' if nothing is passed in", function(done) {
	 	list().should.be.exactly("list-error");
	 	done();
	 });
	 it("should return 'list-error' if a string is passed in", function(done) {
	 	list("hello").should.be.exactly("list-error");
	 	done();
	 });
	 it("should return 'list-error' if null is passed in", function(done) {
	 	list(null).should.be.exactly("list-error");
	 	done();
	 });
	 it("should return 'list-error' if undefined is passed in", function(done) {
	 	list(undefined).should.be.exactly("list-error");
	 	done();
	 });
	 it("should return 'list-error' if a number is passed in", function(done) {
	 	list(5).should.be.exactly("list-error");
	 	done();
	 });
	 it("should return 'list-error' if an object is passed in", function(done) {
	 	list({hello: "hello"}).should.be.exactly("list-error");
	 	done();
	 });
	 it("should return 'list-error' if a nested array is passed in", function(done) {
	 	list([["hello"], 5]).should.be.exactly("list-error");
	 	done();
	 });
	 
	 // Test success
	 it("should return a string when a non-nested array of primitive type elements (string, number, etc) is passed in", function(done) {
	 	list(["hello"]).should.be.string;
	 	done();
	 });
	 it("should return a string of the form '<li>hello</li>' (repeated for each element) when an array is passed in", function(done) {
	 	list(["hello", "yes", 5]).should.match(/^(<li>.+<\/li>)+$/);
 		done();
	 });
	 it("should return an empty string when an empty array is passed in", function(done) {
	 	list([]).should.be.exactly("");
	 	done();
	 });
});

describe("link(item)", function() {
	var link = helpers.link;
	
	// Test errors
	 it("should return 'link-error' if nothing is passed in", function(done) {
	 	link().should.be.exactly("link-error");
	 	done();
	 });
	 it("should return 'link-error' if a string is passed in", function(done) {
	 	link("hello").should.be.exactly("link-error");
	 	done();
	 });
	 it("should return 'link-error' if null is passed in", function(done) {
	 	link(null).should.be.exactly("link-error");
	 	done();
	 });
	 it("should return 'link-error' if undefined is passed in", function(done) {
	 	link(undefined).should.be.exactly("link-error");
	 	done();
	 });
	 it("should return 'link-error' if a number is passed in", function(done) {
	 	link(5).should.be.exactly("link-error");
	 	done();
	 });
	 it("should return 'link-error' if an array is passed in", function(done) {
	 	link(["hello"]).should.be.exactly("link-error");
	 	done();
	 });
	 
	 // Test success
	 it("should return a string when an object containing at least a string field named 'url' is passed in", function(done) {
	 	link({url: "google.com"}).should.be.string;
	 	done();
	 });
	 it("should return a string of the form '<a href=\"(url)\" target=\"_blank\">(name)</a>' when an object containing string fields named 'url' and 'name' is passed in", function(done) {
	 	link({url: "google.com", name: "hello"}).should.match(/^<a href=".+" target="_blank"(?!>Click here<).+<\/a>$/);
 		done();
	 });
	 it("should return a string of the form '<a href=\"(url)\">Click here</a>' when an object containing only a string field named 'url', but not a 'name' field, is passed in", function(done) {
	 	link({url: "google.com"}).should.match(/^<a href=".+" target="_blank">Click here<\/a>$/);
	 	done();
	 });
});