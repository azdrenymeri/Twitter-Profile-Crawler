const cheerio = require('cheerio');

module.exports = function(response){
   

    const htmlDoc = cheerio.load(response);
    const imageUrl = htmlDoc('img.ProfileAvatar-image').attr('src').trim();
    const name = htmlDoc('a.ProfileHeaderCard-nameLink.u-textInheritColor.js-nav').text().trim();
    const handle = htmlDoc('a.ProfileHeaderCard-screennameLink.u-linkComplex.js-nav > span').text();
    const bio = htmlDoc('p.ProfileHeaderCard-bio.u-dir').text().trim();
    const followers = htmlDoc('li.ProfileNav-item.ProfileNav-item--followers>a>span.ProfileNav-value').text().trim();
    const following = htmlDoc('li.ProfileNav-item.ProfileNav-item--following>a>span.ProfileNav-value').text().trim();

    const payload = {htmlDoc,imageUrl,name,handle,bio,followers,following, tweets:[]};
    let firstTime = true;

    // extracting tweets
    htmlDoc('div#timeline>div>div.stream>ol>li').each((i,element) => {
        const tweetDoc = cheerio.load(element);
        let tweetLink = 'https://twitter.com';
            tweetLink += tweetDoc('div.tweet').attr('data-permalink-path');
        const tweetName = tweetDoc('strong.fullname.show-popup-with-id.u-textTruncate').text();
        const tweetPicture = tweetDoc('img.avatar.js-action-profile-avatar').attr('src').trim();
        const tweetHandle = tweetDoc('span.username.u-dir.u-textTruncate').text();
        const tweetTime = tweetDoc('span._timestamp.js-short-timestamp').text();
        const tweetContent = tweetDoc('p.TweetTextSize.TweetTextSize--normal.js-tweet-text.tweet-text').html();
        const replyCount = tweetDoc('span.ProfileTweet-action--reply.u-hiddenVisually').text().trim();
        const retweetCount = tweetDoc('span.ProfileTweet-action--retweet.u-hiddenVisually').text().trim();
        const likesCount = tweetDoc('span.ProfileTweet-action--favorite.u-hiddenVisually').text().trim();
    
        // pushing a tweet
        payload.tweets.push({
            tweetLink,
            tweetName,
            tweetPicture,
            tweetHandle,
            tweetTime,
            tweetContent, 
            replyCount, 
            retweetCount, 
            likesCount
        });

    });

    // finally returning the payload
    return payload;
};