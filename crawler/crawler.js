const request = require('request');
const htmlParser = require('./html-parser');

 async function crawlData(url) {

    const response = await request.get(url)
      .then(response  => response.body)
      .catch(err => console.log(err));
    
    const parsedData = htmlParser(response);
    return parsedData;
};


module.exports = crawlData;