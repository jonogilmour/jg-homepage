"use strict";

/*
	SASS preprocessor
*/

var sass = require("node-sass-middleware");
var path = require("path");
module.exports = sass({
    src: path.join(__dirname, "stylesheets"),
    dest: path.join(__dirname, "public"),
    debug: true,
    prefix: "/css"
});
