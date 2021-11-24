var fs = require('fs'), path = require('path'), util = require('util');
const md5File = require('md5-file')

var dirToJSON = function(dir, done) {
  var results = {};

  function recWalk(d, res) {
    var list = fs.readdirSync(d);
	
    list.forEach((name) => {
      var tempResults = {};
      var file = path.resolve(d, name);
      var stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        recWalk(file, tempResults);
		
        var obj = {};
        res[name] = tempResults;
      } else {
		  
        res[name] = md5File.sync(path.resolve(d, name));
      }
    });
  }

  try {
    recWalk(dir, results);
    done(null, results);
  } catch(err) {
    done(err);
  }
};

dirToJSON("./files/", function(err, results) {
	fs.writeFileSync('output.json', JSON.stringify(results, null, '\t'));
});
