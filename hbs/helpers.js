var path = require("path");
var fs = require("fs");
try {
	var pathsMap = require(path.join("..","data","paths.json"));	
} catch (e) {
	console.log(e);
}


module.exports = {
	/*
		Takes an image name and returns the full path for that image in the folder specified in the paths.json map
		@param String
	*/
	image: function(name) {
		if (name === "string" && name.length) {
			var mediaFolder = pathsMap.media;
			return path.join(mediaFolder, name);
		}
		return "image-error";
		
	},
	/*
		Takes a list of values and returns a comma separated string of those values
		@param Array
	*/
	comma: function(strs) {
		var list = "";
		var i = 0;
		var max = strs.length - 1;
		while(true) {
			if(i == max) return list + strs[i];
			list = list + strs[i] + ", ";
			i++;
		}
	},
	/*
		Takes a list and iterates over it, and adds a different class for even or odd blocks
		@param Array
		@param Object
	*/
	evenOdd: function(context, options) {
		var i = 0;
		var htmlOut = "";
		// Bring in any extra classes from options.hash to be assigned to context.classes
		var classes = "";
		if(options.hash.classes) {
			classes += options.hash.classes;
		}
		
		while(i < context.length) {
			if(i%2) {
				context[i].even_odd = options.hash.even;
				if (options.hash.even_2) {
					context[i].even_odd_2 = options.hash.even_2
				}
			}
			else {
				context[i].even_odd = options.hash.odd;
				if (options.hash.odd_2) {
					context[i].even_odd_2 = options.hash.odd_2
				}
			}
			context[i].classes = classes;
			htmlOut = htmlOut + options.fn(context[i]);
			i++;
		}
		return htmlOut;
	},
	/*
		Grabs the current year
	*/
	year: function() {
		return new Date().getFullYear().toString();
	},
	/*
		Turn each item in a list into an li
	*/
	list: function(items) {
		var htmlOut = ""
		items.forEach(function(item) {
			htmlOut += "<li>" + item + "</li>";	
		});
		return htmlOut;
	}
} 