"use strict";

/*
	Routing for static files
*/
module.exports = function(dir) {
	var express = require("express");
	return express.static(dir);
};
