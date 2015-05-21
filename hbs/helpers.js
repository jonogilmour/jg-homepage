var path = require("path");
var AWS = require("aws-sdk");
var s3 = new AWS.S3();
var fs = require("fs");
try {
	var pathsMap = require(path.join("..","data","paths.json"));	
} catch (e) {
	console.log(e);
}

/**
 * Checks if a string exists and is not empty
 * @param {string} str The string to check
 * @return {boolean} True if the string exists and is not empty, otherwise false
 */
	
function checkString(str) {
	return str && typeof str === "string" && str.length;
}

/**
 *Replaces all characters in a string between two indices with a string
 * @param {number} start The beginning index
 * @param {number} end The ending index
 * @param {string} what The replacement string
 * @return {string} The original string with the replacement inserted
 */
String.prototype.replaceBetween = function(start, end, what) {
	if(start < 0 || end >= this.length) return this;
    return this.substring(0, start) + what + this.substring(end);
};


module.exports = {
	/**
	 * Takes an image name and returns the full path for that image in the folder specified in the paths.json map
	 * @param {string} name The filename of the image
	 * @return {string} The fully qualified image path, otherwise error
	 */
		
	image: function(name) {
		if (checkString(name)) {
			var mediaFolder = pathsMap.media;
			return path.join(mediaFolder, name);
		}
		return "image-error";
		
	},
	
	/**
	 * Takes a list of values and returns a comma separated string of those values
	 * @param {string[]} strs An array of strings
	 * @return {string} A comma separated list of strings
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
		
		@param Array
		@param Object
	*/
	/**
	 * Iterates over a list of values, rendering a HTML block and adding a different class for even or odd blocks
	 * @param {Array} context An array of objects or values inside the block
	 * @param {Object} options An object containing a rendering function and any extra parameters
	 * @return {string} The completed HTML block with variables inserted
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
	
	/**
	 * Grabs the current year in number form
	 * @return {number} The current year
	 */
	year: function() {
		return new Date().getFullYear().toString();
	},
	
	/**
	 * Turn each item in a list into a HTML <li> block
	 * @param {string[]} items An array of strings
	 * @return {string} A HTML block with a list of 'li' entries
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
	
	/**
	 * Takes a HTML block and a list of values and renders each block inside an <li>
	 * @param {Array} context An array of objects or values inside the block
	 * @param {Object} options An object containing a rendering function and any extra parameters
	 * @return {string} The finished HTML block with values inserted
	 */
	listBlock: function(context, options) {
		var htmlOut = "";
		context.forEach(function(item) {
			htmlOut += "<li>" + options.fn(item) + "</li>";	
		});
		return htmlOut;
	},
	/**
	 * Takes an object and turns it into a HTML anchor tag
	 * @param {{name: ?string, url: string}} item Object to turn into a link
	 * @return {string} A HTML <a> tag with the information given
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
	},
	
	/*
		Takes a list of link items and creates a <ul> of HTML links
		@param [Object]
	*/
	linkList: function(items) {
		if(!items.length) return "";
		var links = [];
		items.forEach(function(item) {
			links.push(this.link(item));	
		});
		return this.list(links);
	},
	/*
		Returns my age
	*/
	myAge: function() {
		var bday = new Date(1992, 9, 8);
	    var ageDifMs = Date.now() - bday.getTime();
	    var ageDate = new Date(ageDifMs);
	    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
	},
	/*
		Parses a HTML block for image placeholders and set assets to be pulled from AWS S3
		@param String
	*/
	file_replace_aws: function(block) {
		var awsURL = "http://public.jonogilmour.s3.amazonaws.com/"
		var str_start = 0;
		var fileName;
		var str_end;
		while(( str_start = block.indexOf("{{>", str_start) ) > -1) {
			str_end = block.indexOf("<}}", str_start);
			if (str_end < 0) {
				// Malformed HTML
				console.log("- Warning: Wrong syntax for file insertion.")
				return block;
			}
			str_start += 3;
			fileName = block.substr(str_start,str_end-str_start);
			block = block.replaceBetween(str_start-3, str_end+3, awsURL + fileName);
		}
		return block;
	}
} 