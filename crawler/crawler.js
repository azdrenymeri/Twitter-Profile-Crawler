const htmlProfileParser = require('./html-profile-parser');
const htmlTweetParser = require('./html-tweet-parser');
const axios = require('axios');

async function crawlProfile(url) {
    const response = await axios.get(url)
    .then(response => response.data)
    .catch(err => console.log(err));
    return htmlProfileParser(response)
};

async function crawlTweet(url){
    const response = await axios.get(url)
    .then(response => response.data)
    .catch(err => console.log(err));
    return htmlTweetParser(response);
};

module.exports = { crawlProfile, crawlTweet};