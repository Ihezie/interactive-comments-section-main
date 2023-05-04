const commentsCon = document.getElementById('comments-con');


async function populateWebpage(){
    const response = await fetch('./data.json');
    const data = await response.json();

    const comments = data.comments;
    comments.forEach(comment => {
        createCommentAndReplies(data, comment);
    });
}

populateWebpage();

function createCommentAndReplies(data, comment){
    let commentElement = `<div class="comment box-design" id=${comment.id}>
    <div class="vote-controls">
      <button type="button" class="upvote">
        <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 
          0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 
          .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="currentColor"/>
        </svg>
      </button>
      <div class="score">${comment.score}</div>
      <button type="button" class="downvote">
        <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 
          0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 
          0 .53.167h8.495Z" fill="currentColor"/>
        </svg>
      </button>
    </div>

    <div class="comment-info info">
      <img src=${comment.user.image.png} class="avatar" alt="user">
      <span class="username">${comment.user.username}</span>
      <span class="time-stamp">${comment.createdAt}</span>
    </div>

    <button type="button" class="crt-reply-btn">
      <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg">
        <path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 
        7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 
        .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="currentColor"/>
      </svg>
      Reply
    </button>

    <p class="content">${comment.content}</p>
    </div>`

    if(comment.replies.length !== 0){
        const replies = comment.replies;
        const repliesCon = document.createElement('div');
        repliesCon.classList.add('replies-con');
        repliesCon.setAttribute('id', `replies-to-${comment.id}`);

        replies.forEach(reply=>{
            if(reply.username === data.currentUser.username){
                repliesCon.innerHTML += `<div class="reply box-design current-user-reply">
                <div class="vote-controls">
                  <button type="button" class="upvote">
                    <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 
                      0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 
                      .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="currentColor"/>
                    </svg>
                  </button>
                  <div class="score">${reply.score}</div>
                  <button type="button" class="downvote">
                    <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 
                      0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 
                      0 .53.167h8.495Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
      
                <div class="reply-info info">
                  <img src="images/avatars/image-juliusomo.png" class="avatar" alt="user">
                  <span class="username">juliusomo</span>
                  <span class="current-user-tag">you</span>
                  <span class="time-stamp">1 week ago</span>
                </div>
      
                <div class="edit-delete-con">
                  <button type="button" class="delete-btn">
                    <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 
                      1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 
                      1.167H0v1.166h11.667V1.167Z" fill="currentColor"/>
                    </svg>
                    Delete
                  </button>
      
                  <button type="button" class="edit-btn">
                    <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 
                      8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 
                      0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 
                      0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="currentColor"/>
                    </svg>
                    Edit
                  </button>
                </div>
      
      
        
                <p class="content">
                  <span class="replying-to">@ramesesmiron</span> If you're still new, I'd recommend focusing on the fundamentals of HTML, 
                  CSS, and JS before considering React. It's very tempting to jump ahead but 
                  lay a solid foundation first.
                </p>
              </div>`
            }
        })
    }
}