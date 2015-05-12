"use strict";

// Server
var express = require("express");
var app = express();
var path = require("path");
var http = require("http");

// Router engine
app.use(require("./routes/router"));

// SASS engine
app.use(require("./sass/sass"));

// Static file engine
var static_m = require("./static/static");
var staticMap = require("./static/map.json");
for (var src in staticMap) {
  if (staticMap.hasOwnProperty(src)) {
  	var dest = __dirname + staticMap[src];
  	console.log("- Adding static source: \"" + src + "\"" + " maps to \"" + dest + "\"");
    app.use(src, static_m(dest));
  }
}

// Template engine
var options = {
	defaultLayout: "index",
	extname: "html",
	partialsDir: path.join(__dirname, "views", "partials/"),
	layoutsDir: path.join(__dirname, "views", "layouts/")
};
var exphbs  = require('express-handlebars');
app.engine(options.extname, exphbs(options));
app.set('view engine', options.extname);
app.set("views", path.join(__dirname, "/views"));

// Start server
var server = http.createServer(app).listen(process.env.PORT || 3000);
console.log("Listening on port " + server.address().port + " in " + app.get("env") + " mode");

module.exports = server;