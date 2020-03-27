

document.getElementById('scrapeBtn').addEventListener('click',async (e) =>{
    e.preventDefault();
    
    hideCards();
    showSpinner();

    const twitterUrl = document.getElementById('twitterUrlInput');
    const token = document.getElementById('tokenInput');

    try {
        await fetchData(twitterUrl.value,token.value) 
    }catch(err){
      
    }
    
    twitterUrl.value = '';
    token.value = '';
});


const fetchData = async (twitterUrl, token) => {

   const response =  await fetch('http://localhost:3000/api/crawl', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({twitterUrl, token})
    }).then(response => {
        return response.json();
    }).then(data => {
        return data;
    });  
    
    if(!response.message) {
        renderData(response);
        hideSpinner();
        showCards();
    } else {
        hideSpinner();
        hideCards();
        showError(response.message);
        console.log(response.message);
    }
}

const renderData = (payload) => {
    document.getElementById('profile-name').innerText = payload.name;
    document.getElementById('profile-handle').innerText = payload.handle;
    document.getElementById('profile-img').src = payload.imageUrl;
    document.getElementById('profile-bio').innerText = payload.bio;
    document.getElementById('profile-following').innerText = payload.following+' Following';
    document.getElementById('profile-followers').innerText = payload.followers+' Followers';

    const tweetsContainer = document.getElementById('tweets');
    tweetsContainer.innerHTML = '';

    for(let i = 0; i < payload.tweets.length; i++){
        const tweet = payload.tweets[i];
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <div class="card-body">
        <img class="profile-img" style="height: 47px; width: 47px;" src="${tweet.tweetPicture}" alt="user pic">
        <div class="user-info">
            <div>${tweet.tweetName.trim()}</div> <div>${tweet.tweetHandle.trim()}</div> <div>${tweet.tweetTime} </div>
            <div style="display: block;">
               ${tweet.tweetContent}
            </div>
            <div class="tweet-stats" style="display: block;">
                <div>
                    <i class="fas fa-comment-dots"></i>&nbsp;&nbsp;<span id="comments">${tweet.replyCount}</span>
                </div>
                <div>
                    <i class="fas fa-retweet"></i>&nbsp;&nbsp;<span id="retweets">${tweet.retweetCount}</span>
                </div> 
                <div>
                    <i class="fas fa-heart"></i>&nbsp;&nbsp;<span id="likes">${tweet.likesCount}</span>
                </div>
            </div>
        </div>
    </div>
        `;
        tweetsContainer.appendChild(div);
    }

    hideSpinner();
    showCards();
}

const showSpinner = () => {
    document.getElementById('spinner').style.display = 'inline-block';
}

const hideSpinner = () => {
    document.getElementById('spinner').style.display = 'none';
}

const showCards = () => {
    document.getElementById('twitter-profile').style.display = 'block';
    document.getElementById('tweets').style.display = 'block';
}

const hideCards = () => {
    document.getElementById('twitter-profile').style.display = 'none';
    document.getElementById('tweets').style.display = 'none';
}

const showError = (message) => {
   const messageBox = document.getElementById('alert');
   messageBox.innerText = message;
   messageBox.style.display  = 'block';

   setTimeout(() => {
    messageBox.style.display = 'none';
   }, 3000);
}
