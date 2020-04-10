document.getElementById('scrapeBtn').addEventListener('click', async (e) => {
    e.preventDefault();    
    hideCards();
    showSpinner();
    const twitterUrl = document.getElementById('twitterUrlInput');
    try {
        await fetchProfile(twitterUrl.value) 
    }catch(err){
     console.log(err); 
    }
    twitterUrl.value = '';
});

const fetchProfile = async (twitterUrl) => {
    // https://twitter-profile-crawler.herokuapp.com/api/crawl
    // http://localhost:3000/api/crawl
   const response =  await fetch('http://localhost:3000/api/crawl', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({twitterUrl})
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
        div.classList.add('card','tweet-card');
        div.setAttribute('tweet-link',tweet.tweetLink);
        div.innerHTML = `
        <div class="card-body">
        <img class="profile-img" style="height: 47px; width: 47px;" src="${tweet.tweetPicture}" alt="user pic">
        <div class="user-info">
            <div>${tweet.tweetName.trim()}</div> <div class="user-name">${tweet.tweetHandle.trim()}</div><div>&nbsp;&nbsp;·&nbsp;&nbsp;${tweet.tweetTime} </div>
            <div class="tweet-content" style="display: block; overflow-wrap: break-word;">
               ${tweet.tweetContent}
            </div>
            <div class="tweet-stats" style="display: block;">
                <div class="inline-block">
                    <i class="fas fa-comment-dots"></i>&nbsp;&nbsp;<span id="comments">${tweet.replyCount}</span>
                </div>
                <div class="inline-block">
                    <i class="fas fa-retweet"></i>&nbsp;&nbsp;<span id="retweets">${tweet.retweetCount}</span>
                </div> 
                <div class="inline-block">
                    <i class="fas fa-heart"></i>&nbsp;&nbsp;<span id="likes">${tweet.likesCount}</span>
                </div>
            </div>
        </div>
    </div>
        `;
        tweetsContainer.appendChild(div);
        // div.addEventListener('click', showTweetDetailsModal);
    }
    
    // adding the listener for each tweet card
    document.querySelectorAll('.tweet-content').forEach(content => {
        content.addEventListener('click', showTweetDetailsModal);
    });

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

// profile picture modal handling
const showPictureModal = (e) => {
    document.getElementById('imgSourceModal').setAttribute('src',e.target.getAttribute('src'));
    document.getElementById('pictureModal').style.display = 'block';
};
const hidePictureModal = () => {
    document.getElementById('pictureModal').style.display = 'none';    
}
document.getElementById('close').addEventListener('click', hidePictureModal);
document.getElementById('profile-img').addEventListener('click', showPictureModal); 

// tweet details modal handling

const fetchTweetDetails = async (url) => {
    
    const payload = await  fetch('http://localhost:3000/api/crawlTweet',{ 
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({twitterUrl:url}) 
    })
        .then(response => response.json())
        .catch(err => alert(err));

    return payload;
}

// getting called before declared
async function showTweetDetailsModal(event){
   
    const tweetUrl = event.target.parentElement.parentElement.parentElement.getAttribute('tweet-link');
    
    
    console.log("Tweet URL: ",tweetUrl.toString());
    document.getElementById('tweetModal').style.display = 'block';
    document.getElementById('spinnerModal').style.display = 'inline-block';
    
    const data = await fetchTweetDetails(tweetUrl);
    
    renderModalData(data);    
    
    document.getElementById('spinnerModal').style.display = 'none';
    document.getElementById('details-content').style.display = 'block';
};

const renderModalData = (payload) =>{
    console.log(payload);
    document.getElementById('modal-img').setAttribute('src', payload.tweetImg);
    document.getElementById('modal-name').innerText = payload.tweetName;
    document.getElementById('modal-handle').innerText = payload.tweetHandle;
    document.getElementById('modal-time').innerText = payload.tweetTime;
    document.getElementById('modal-content').innerHTML = payload.tweetContent;
    document.getElementById('retweets-modal').innerText = payload.retweets;
    document.getElementById('likes-modal').innerText = payload.likes;

    const imgsContainer = document.getElementById('imgs-modal');
    imgsContainer.innerHTML = '';
    payload.peopleEngaged.forEach(srcImg => {
        const img = document.createElement('img');
        img.alt = 'Engaged';
        img.src = srcImg;
        img.classList.add('profile-img');
        img.style = 'height: 28px; width: 28px;';
        imgsContainer.appendChild(img);
    });

    // childNode[0].firstChild.setAttribute('src', payload.tweetImg);
}

const hideDetailsModal = () => {
    document.getElementById('details-content').style.display = 'none';
    document.getElementById('tweetModal').style.display = 'none';
}

document.getElementsByClassName('closeModal')[0].addEventListener('click', hideDetailsModal);