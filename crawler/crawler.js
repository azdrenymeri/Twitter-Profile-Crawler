const htmlParser = require('./html-parser');
const axios = require('axios');
const fs = require('fs');
let writeStream = fs.createWriteStream('result.html');

async function crawlData(url) {

    const response = await axios.get(url)
    .then(response => response.data)
    .catch(err => console.log(err));

    
    writeStream.write(response, (err) => {
      if(err) return console.log(err);
      console.log('parsed html saved on result.html');
    });

    // pass the html to the html parser
    return htmlParser(response)
};


module.exports = crawlData;