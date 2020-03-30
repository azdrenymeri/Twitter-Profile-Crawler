const fs = require('fs');

function saveHtmlToFile(htmlDoc) {
    let writeStream = fs.createWriteStream('./util/result.html');
    writeStream.write(htmlDoc, (err) => {
      if(err) return console.log(err);
      console.log('HTML document saved to ./util/result.html');
    });
};

module.exports = saveHtmlToFile;