//    search App, by Avner Horwitz 26.9.18
//    ------------------------------------

// General 
var fs = require('fs');
var SearchPath = require("path");

// arguments stuff
if ((args = process.argv).length !== 4) {
    console.log("USAGE: node search [EXT] [TEXT]");
    process.exit(-1);
}
var extension = args[2];
var textToGrep = args[3];

// needed for presentation of full path of files.
var absolutePath = SearchPath.resolve();

var fileFound = false;

// Main 
walk(".");
if (!fileFound) {
    console.log("No file found");    
}

// Recursive function walking on files tree on path
function walk(path) {
    var nodeList = fs.readdirSync(path);
    if (nodeList != null) {
        for (var i=0; i<nodeList.length; i++) {              // checking all nodes if current layer
            var relativeNode=path+'/'+nodeList[i];
            if (fs.lstatSync(relativeNode).isDirectory()) {
                walk(relativeNode);                          // if node=directory ->> get into directory
            } else {
                if (fs.lstatSync(relativeNode).isFile()){             // is the node file ?
                    if (getFileExtension(nodeList[i])===extension) {  // does the extension match user's argument ?
                        var tmp = fs.readFileSync(relativeNode);
                        if(tmp.indexOf(textToGrep) >= 0){             // does the file contains users' string ?
                            fileFound=true;
                            var relativeNodeFormatted =
                                replaceAll(relativeNode, '/', '\\');
                            var absoloutelNode =
                                absolutePath +
                                relativeNodeFormatted.slice(1,relativeNode.length); // building full absoloute path
                            console.log(absoloutelNode);
                           }
                    }
                }
            }
        }
    }
}

function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

// in favour of the need to show the files names and path with backslashs and not mixed slashes & backslashes
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
