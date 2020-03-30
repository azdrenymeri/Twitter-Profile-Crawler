const cheerio = require('cheerio');
const htmlExtrator = require('../util/html-extrator');
module.exports = function(response){
    const document = cheerio.load(response);
    const tweetDoc = cheerio.load(document('div#permalink-overlay').html());
    
    const tweetImg = tweetDoc('img.avatar.js-action-profile-avatar').attr('src');
    const tweetName = tweetDoc('div.content.clearfix > div > a > span.FullNameGroup').text();
    const tweetHandle = tweetDoc('div.content.clearfix > div > a > span.username.u-dir.u-textTruncate').text();
    const tweetContent = tweetDoc('div.js-tweet-text-container').html();
    const tweetTime = tweetDoc('div.js-tweet-details-fixer.tweet-details-fixer > div.client-and-actions').text().trim();

    const tweetStats = tweetDoc('div.js-tweet-details-fixer.tweet-details-fixer > div.js-tweet-stats-container.tweet-stats-container > ul > li').toArray();
    const retweets = cheerio.load(tweetStats[0])('a').text().trim();
    const likes = cheerio.load(tweetStats[1])('a').text().trim();

    const avDoc = cheerio.load(tweetStats[2])('a').toArray();

    const peopleEngaged = [];

    avDoc.forEach(item => {
        const src = cheerio.load(item)('img').attr('src');
        peopleEngaged.push(src);
    })

    // 2D array handling arrays of replies
    const tweetReplies = [];

    // handling the tweet replies
    const replies = tweetDoc('div#descendants>div>div>ol>li').toArray();
    let first = true;
    replies.forEach(reply => {
        const replyDoc = cheerio.load(reply);
        if(first){
            htmlExtrator(replyDoc.html());
            first = false;
        }
        // this will contain every user object who replied under the same reply
        const replyersArr = [];

        const replyers = replyDoc('li>ol').toArray();
    
        replyers.forEach(replyer => {
            const repDoc = cheerio.load(replyer);
            const replyerImg = repDoc('li>div>div.content>div.stream-item-header>a>img').attr('src');
            const replyerName = repDoc('li>div>div.content>div.stream-item-header>a>span.FullNameGroup').text();
            const replyerHandle = repDoc('li>div>div.content>div.stream-item-header>a>span.username').text();
            const replyerTime = repDoc('li>div>div.content>div.stream-item-header>small.time').text().trim();
            let replyingTo = 'Replying to ';
                replyingTo += repDoc('li>div>div.content>div.ReplyingToContextBelowAuthor>a').text();
            const replyerContent = repDoc('li>div>div.content>div.js-tweet-text-container').html();    
            const statsDoc = repDoc('li>div>div.content>div.stream-item-footer>div.u-hiddenVisually').toArray();
            const replies = cheerio.load(statsDoc[0])('span.ProfileTweet-action--reply').text().trim();
            const retweets = cheerio.load(statsDoc[0])('span.ProfileTweet-action--retweet').text().trim();
            const likes = cheerio.load(statsDoc[0])('span.ProfileTweet-action--favorite').text().trim();
            
            replyersArr.push({
                replyerName,
                replyerImg,
                replyerHandle,
                replyerTime,
                replyingTo,
                replyerContent,
                replies,
                retweets,
                likes
            });
        });

        tweetReplies.push(replyersArr);
    });


    return {tweetImg, tweetName, tweetHandle,tweetContent, tweetTime, retweets, likes, peopleEngaged, tweetReplies };
};