"use strict";

// Server
var express = require("express");
var app = express();
var path = require("path");

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
  	console.log("- Adding static source: \"" + src + "\"\t" + " maps to \"" + dest + "\"");
    app.use(src, static_m(dest));
  }
}

// Template engine
var options = {
	defaultLayout: "index",
	extname: "html",
	partialsDir: path.join("views", "partials/")
};
var exphbs  = require('express-handlebars');
app.engine(options.extname, exphbs(options));
app.set('view engine', options.extname);
app.set("views", path.join(__dirname, "/views"));

// Start server
app.listen(3000, function() {
	console.log("Listening on port 3000 in " + app.get("env") + " mode"); 
});
