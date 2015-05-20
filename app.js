"use strict";

// Server
var express = require("express");
var app = express();
var path = require("path");
var http = require("http");
var bodyParser = require("body-parser");

// Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Router engine
var routeMap = require("./routes/routes.json"); // Cache the routemap
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
	layoutsDir: path.join(__dirname, "views", "layouts/"),
	helpers: require("./hbs/helpers")
};
var exphbs  = require('express-handlebars');
app.engine(options.extname, exphbs(options));
app.set('view engine', options.extname);
app.set("views", path.join(__dirname, "/views"));

//404 and 500 routes
 app.use(function(req, res) {
    res.status(404).render(routeMap._404, {layout: routeMap.default_layout});
 });
 
 // Handle 500
 app.use(function(error, req, res, next) {
    res.status(500).render(routeMap._500, {layout: routeMap.default_layout});
 });

// Start server
var server = http.createServer(app).listen(process.env.PORT || 3000);
console.log("Listening on port " + server.address().port + " in " + app.get("env") + " mode");

module.exports = server;