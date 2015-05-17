var path = require("path");
var fs = require("fs");
try {
	var pathsMap = require(path.join("..","data","paths.json"));	
} catch (e) {
	console.log(e);
}

/*
	Checks if a string exists and is not empty
*/
function checkString(str) {
	return str && typeof str === "string" && str.length;
}


module.exports = {
	/*
		Takes an image name and returns the full path for that image in the folder specified in the paths.json map
		@param String
	*/
	image: function(name) {
		if (typeof name === "string" && name.length) {
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
		if(strs && strs.constructor === Array && strs.length) {
			var list = "";
			var i = 0;
			var max = strs.length - 1;
			while(true) {
				if(typeof strs[i] !== "string") return "comma-error";
				if(i == max) return list + strs[i];
				list = list + strs[i] + ", ";
				i++;
			}
		}
		return "comma-error";
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
		if(items && items.constructor === Array) {
			var htmlOut = ""
			items.every(function(item) {
				if(typeof item === "object") {
					htmlOut = "list-error";
					return false;
				}
				htmlOut += "<li>" + item + "</li>";	
				return true;
			});
			return htmlOut;
		}
		return "list-error";
	},
	/*
		Takes an item object
	*/
	link: function(item) {
		if (item && checkString(item.url)) {
			var htmlOut = "<a href=\"";
			htmlOut += item.url + "\" target=\"_blank\">";
			
			if(checkString(item.name)) {
				htmlOut += item.name;
			}
			else {
				htmlOut += "Click here";
			}
			
			return htmlOut + "</a>";
		}
		return "link-error";
	}
} 