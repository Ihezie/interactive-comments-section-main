const commentsCon = document.getElementById('comments-con');
const addCommentBtn = document.getElementById('add-comment-btn');

document.addEventListener('DOMContentLoaded', async ()=>{
  await getData();
  const crtReplyBtns = commentsCon.querySelectorAll('.crt-reply-btn');
  crtReplyBtns.forEach(crtReplyBtn =>{
    crtReplyBtn.addEventListener('click', (e)=>{
      displayReplyInputBox(e);
    });
  })
});

addCommentBtn.addEventListener('click', (e)=>{
  createUserInput(e, 'comment');
})

/***FUNCTIONS***/
async function getData(){
  const response = await fetch('./data.json');
  const uniData = await response.json();
  const currentUserData = uniData.currentUser;
  const commentsData = uniData.comments;
  commentsData.forEach(commentData => {
    if(!(localStorage.getItem(`comment-${commentData.id}`))){
      localStorage.setItem(`comment-${commentData.id}`, JSON.stringify(commentData));
    }
  });
  for(let i = 0; i < localStorage.length; i++){
    const commentKey = localStorage.key(i);
    const comment = JSON.parse(localStorage.getItem(commentKey)); 
    populateWebpage(currentUserData, comment);
  }
  orderComments();
}

const bluePrint = `<div class="vote-controls">
  <button type="button" class="upvote">
    <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 
      0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 
      .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="currentColor"/>
    </svg>
  </button>
  <div class="score"></div>
  <button type="button" class="downvote">
    <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 
      0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 
      0 .53.167h8.495Z" fill="currentColor"/>
    </svg>
  </button>
  </div>

  <div class="info">
    <img src="" class="avatar" alt="user">
    <span class="username"></span>
    <span class="time-stamp"></span>
  </div>

  <button type="button" class="crt-reply-btn">
    <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg">
      <path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 
      7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 
      .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="currentColor"/>
    </svg>
    Reply
  </button>

  <p class="content"></p>`
function createRepliesCon(){
  const repliesCon = document.createElement('div');
  repliesCon.classList.add('replies-con');
  return repliesCon;
}
function populateWebpage(currentUserData, commentData){
  const commentElement = constructElement(currentUserData, commentData, 'comment');

  commentsCon.appendChild(commentElement);

  if(commentData.replies.length > 0){
    const repliesData = commentData.replies;
    const repliesCon = createRepliesCon();
    repliesCon.setAttribute('id', `replies-to-${commentData.id}`)

    repliesData.forEach(replyData=>{
      const replyElement = constructElement(currentUserData, replyData, 'reply');
      replyElement.querySelector('.content').insertAdjacentHTML('afterbegin',  `<span class="replying-to">@${replyData.replyingTo} </span>` );
      repliesCon.appendChild(replyElement);
    })
    commentsCon.appendChild(repliesCon);
  }
}
function constructElement(currentUserData, elementData, elementType){
  const element = document.createElement('div');
  element.classList.add(elementType, 'box-design');
  element.setAttribute('id', elementData.id);
  element.innerHTML = bluePrint;
  element.querySelector('.score').textContent = elementData.score;
  element.querySelector('.info').classList.add(`${elementType}-info`);
  element.querySelector('.info img').src = elementData.user.image.png;
  element.querySelector('.info .username').textContent = elementData.user.username;
  element.querySelector('.info .time-stamp').textContent = elementData.createdAt;
  element.querySelector('.content').textContent = elementData.content;

  if(currentUserData.username === elementData.user.username){
    addCurrentUserFeatures(element, elementType);
    const deleteBtn = element.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e)=>{
      deleteItem(e);
    })
    const editBtn = element.querySelector('.edit-btn');
    editBtn.addEventListener('click', (e)=>{
      updateItem(e);
    });
  }
  const upVoteBtn = element.querySelector('.upvote');
  const downVoteBtn = element.querySelector('.downvote');

  upVoteBtn.addEventListener('click', (e)=>{
    upVote(e);
  })
  downVoteBtn.addEventListener('click', (e)=>{
    downVote(e);
  })
  const dateAddedInMS = elementData.dateAddedInMS;
  if(dateAddedInMS){
    updateTimeStamp(dateAddedInMS, element);
    element.dataset.dateAddedInMS = dateAddedInMS;
  }
  return element;
}
function addCurrentUserFeatures(element, elementType){
    element.classList.add(`current-user-${elementType}`);
    element.querySelector('.info .username').insertAdjacentHTML('afterend', '<span class="current-user-tag">you</span>');
    const replaceThis = element.querySelector('.crt-reply-btn');
    const replaceWith = document.createElement('div')
    replaceWith.classList.add('user-controls');


    replaceWith.innerHTML = `<button type="button" class="delete-btn">
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
    </button>`

    element.replaceChild(replaceWith, replaceThis);
}
async function createUserInput(e, inputType, replyingTo){
  const userInput = e.currentTarget.previousSibling.previousSibling;
  let content = userInput.value;
  if(content){
    const response = await fetch('./data.json');
    const uniData = await response.json();
    const currentUserData = uniData.currentUser;
    const userInputElement = document.createElement('div');
    const id = generateID();
    const dateAddedInMS = dateAdded();
    userInputElement.classList.add(inputType, 'box-design');
    userInputElement.dataset.dateAddedInMS = dateAddedInMS;
    userInputElement.setAttribute('id', id);
    userInputElement.innerHTML = bluePrint;
    addCurrentUserFeatures(userInputElement, inputType);
    userInputElement.querySelector('.content').textContent = content;
    userInputElement.querySelector('.score').textContent = 0;
    userInputElement.querySelector('.info').classList.add(`${inputType}-info`);
    userInputElement.querySelector('.info .username').textContent = currentUserData.username;
    userInputElement.querySelector('.info img').src = currentUserData.image.png;
    userInput.value = '';

    const upVoteBtn =  userInputElement.querySelector('.upvote');
    const downVoteBtn = userInputElement.querySelector('.downvote')
    upVoteBtn.addEventListener('click', (e)=>{
      upVote(e);
    })
    downVoteBtn.addEventListener('click', (e)=>{
      downVote(e);
    })

    if(inputType === 'reply'){
      const replyingToId = replyingTo.getAttribute('id');
      const existingRepliesCon = commentsCon.querySelector(`#replies-to-${replyingToId}`);
      const replyingToType = replyingTo.classList[0];
      const replyInputBox = document.getElementById('add-reply');

      const replyingToUsername = replyingTo.querySelector('.info .username').textContent;
      formatReplyingToUsername(content, userInputElement, replyingToUsername);

      if(existingRepliesCon){
        existingRepliesCon.appendChild(userInputElement);
      }
      else if(replyingToType === 'comment'){
        const replesCon = createRepliesCon();
        replesCon.setAttribute('id', `replies-to-${replyingToId}`);
        replesCon.appendChild(userInputElement);
        replyingTo.insertAdjacentElement('afterend', replesCon);
      }
      else{
        const repliesCon = replyingTo.parentElement;
        repliesCon.appendChild(userInputElement);
      }
      replyInputBox.remove();
      addToLocalStorage(id, content, 0, dateAddedInMS, replyingTo, currentUserData.image.png, currentUserData.username);
    }
    else{
      commentsCon.appendChild(userInputElement);
      addToLocalStorage(id, content, 0, dateAddedInMS, null, currentUserData.image.png, currentUserData.username);
    }

    const deleteBtn = userInputElement.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e)=>{
      deleteItem(e);
    });
    const editBtn = userInputElement.querySelector('.edit-btn');
    editBtn.addEventListener('click', (e)=>{
      updateItem(e);
    });
    updateTimeStamp(dateAddedInMS, userInputElement);
  }
}
function generateID(){
  const id = Math.floor(Math.random() * Date.now());
  return id;
}
function formatReplyingToUsername(content, element, replyingToUsername){
  content = content.replace(/^\@\w+\,?/i, '');
  element.querySelector('.content').innerHTML = content;
  element.querySelector('.content').insertAdjacentHTML('afterbegin',  `<span class="replying-to">@${replyingToUsername}</span>`);

}

function dateAdded(){
  const dateAddedInMS = new Date().getTime();
  return dateAddedInMS;
}
function updateTimeStamp(dateAddedInMS, element){
    const timestampElement = element.querySelector('.time-stamp');
    const currentDate = new Date().getTime();
    let timestamp = currentDate - dateAddedInMS;
    timestamp = Math.ceil(timestamp/1000);
    if(timestamp < 60){
      timestampElement.innerHTML = `${timestamp} secs ago`;
    }
    else if(timestamp < 3600){
      inputTimeStamp(60, 'min');
    }
    else if(timestamp < 86400){
      inputTimeStamp(3600, 'hour');
    }
    else if(timestamp < 604800){
      inputTimeStamp(86400, 'day');
    }
    else if(timestamp < 2.628e+6){
      inputTimeStamp(604800, 'week');
    }
    else if(timestamp < 3.154e+7){
      inputTimeStamp(2.628e+6, 'month');
    }
    else{
      inputTimeStamp(2.628e+6, 'years');
    }
    function inputTimeStamp(divisor, unit){
      timestamp = Math.floor(timestamp/divisor);
      if(timestamp > 1){
        unit = unit + 's';
      }
      timestampElement.innerHTML = `${timestamp} ${unit} ago`;
    }
}
function displayReplyInputBox(e){
  const existingReplyBox = document.getElementById('add-reply');
  if(existingReplyBox){
    existingReplyBox.remove();
    replyInputBoxIsActive = false
  }
  else{
    const replyInputBox = document.createElement('div');
    replyInputBox.setAttribute('id', 'add-reply');
    replyInputBox.classList.add("box-design", "input-box-con");
    replyInputBox.innerHTML = `<img src="images/avatars/image-juliusomo.png" class="avatar" alt="current-user">
    <textarea name="reply-input" id="reply-input" class="input-box" cols="30" rows="10" placeholder="Add a reply..."></textarea>
    <button type="button" class="blue-btn" id="add-reply-btn">reply</button>
    </div>`;
    const replyInput = replyInputBox.querySelector('#reply-input');
    const replyingTo = e.currentTarget.parentElement;
    replyInput.value = `@${replyingTo.querySelector('.info .username').textContent}, `
    replyingTo.insertAdjacentElement('afterend', replyInputBox);
    
    const addReplyBtn = document.getElementById('add-reply-btn');
    addReplyBtn.addEventListener('click', (e)=>{
      createUserInput(e, 'reply', replyingTo)
    } );
  }
}
function deleteItem(e){
  const deleteThis = e.currentTarget.parentElement.parentElement;
  const confirmModal = document.createElement('section');
  confirmModal.setAttribute('id', 'confirm-modal');
  confirmModal.innerHTML = `<div id="confirm-dialogue-box">
  <h3>Delete comment</h3>
  <p>
    Are you sure you want to delete this comment?
    This will remove the comment and can't be undone. 
  </p>
  <div class="btn-container">
    <button type="button" id="cancel-del-btn">no, cancel</button>
    <button type="button" id="confirm-del-btn">yes, delete</button>
  </div> 
  </div>`
  document.body.appendChild(confirmModal);
  const confirmDelBtn = confirmModal.querySelector('#confirm-del-btn');
  confirmDelBtn.addEventListener('click', ()=>{
    deleteFromLocalStorage(deleteThis);
    deleteThis.remove();
    document.body.removeChild(confirmModal);
  })
  const cancelDelBtn = confirmModal.querySelector('#cancel-del-btn');
  cancelDelBtn.addEventListener('click', ()=>{
    document.body.removeChild(confirmModal);
  })
}

let updateItemInputIsActive = false;
function updateItem(e){
  if(!(updateItemInputIsActive)){
    const updateThis = e.currentTarget.parentElement.parentElement;
    const updateThisContent = updateThis.querySelector('.content');
    let replyingToUsername = updateThisContent.querySelector('.content .replying-to');
    if(replyingToUsername){
      replyingToUsername = replyingToUsername.textContent;
      replyingToUsername = replyingToUsername.replace('@', '');
    }
    const userControls = updateThis.querySelector('.user-controls');
    const updateItemInput = document.createElement('textarea');
    const updateBtn = document.createElement('button');
    updateBtn.type = 'button';
    updateBtn.classList.add('blue-btn');
    updateBtn.setAttribute('id', 'update-item-btn');
    updateBtn.textContent = 'update';
    updateThis.appendChild(updateBtn);
    updateItemInput.setAttribute('id', 'update-input');
    updateItemInput.classList.add('input-box');
    updateItemInput.value = updateThisContent.textContent;
    updateThis.replaceChild(updateItemInput, updateThisContent);
    updateItemInputIsActive = true;
    if(innerWidth <= 950){
      userControls.style.display = 'none';
    }
    updateBtn.addEventListener('click', (e)=>{
      updateThisContent.textContent = updateItemInput.value;
      updateThis.replaceChild(updateThisContent, updateItemInput);
      if(updateThis.classList.contains('reply')){
        formatReplyingToUsername(updateThisContent.textContent, updateThis, replyingToUsername);
      }
      updateItemInLocalStorage('content', updateThisContent.textContent, updateThis);
      updateBtn.remove();
      updateItemInputIsActive = false;
      userControls.style.display = 'flex';
    })
  }
}
function upVote(e){
  const score = e.currentTarget.parentElement.querySelector('.score');
  const parentElementOfScore = e.currentTarget.parentElement.parentElement;
  let scoreValue = Number(score.textContent);
  score.textContent = ++scoreValue;
  orderComments();
  updateItemInLocalStorage('score', scoreValue, parentElementOfScore);
}
function downVote(e){
  const score = e.currentTarget.parentElement.querySelector('.score');
  const parentElementOfScore = e.currentTarget.parentElement.parentElement;
  if(score.textContent > 0){
    let scoreValue = Number(score.textContent);
    score.textContent = --scoreValue;
    orderComments();
    updateItemInLocalStorage('score', scoreValue, parentElementOfScore);
  }
}
function orderComments(){
  const commentsNodeList = document.querySelectorAll('.comment');
  const commentsArr = [];
  const replyCons = [];
  const replyConIDs = [];

  commentsNodeList.forEach( comment =>{
    commentsArr.push(comment);
    replyConIDs.push(comment.getAttribute('id'));
  })
  replyConIDs.forEach( id =>{
    replyCons.push(document.getElementById(`replies-to-${id}`))
  })
  commentsArr.sort((a, b) =>{
    if(a.dataset.dateAddedInMS && b.dataset.dateAddedInMS){
      return a.dataset.dateAddedInMS - b.dataset.dateAddedInMS
    }
  });
  commentsArr.sort((a, b)=> b.querySelector('.score').textContent - a.querySelector('.score').textContent)
  commentsArr.forEach(comment => {
    commentsCon.appendChild(comment);
    replyCons.forEach(replyCon =>{
      if(replyCon){
        if(replyCon.getAttribute('id').includes(comment.getAttribute('id'))){
          comment.insertAdjacentElement('afterend', replyCon);
        }
      }
    })
  })
}
function addToLocalStorage(id, content, score, dateAddedInMS, replyingTo, image, username){
  content = content.replace(/^\@\w+\,?\s+/i, '');
  const userInput = {
    id,
    content,
    score,
    dateAddedInMS,
    user: {
      image: {
        png: image
      },
      username
    },
    replies: []
  }
  if(replyingTo){
    userInput.replyingTo = replyingTo.querySelector('.info .username').textContent;
    const parentOfReplyingTo = replyingTo.parentElement;
    // This condition checks the nature of what is being replied to, a comment or a reply
    let parentCommentKey;
    if(parentOfReplyingTo.classList.contains('replies-con')){
      parentCommentKey = parentOfReplyingTo.getAttribute('id');
      parentCommentKey = parentCommentKey.substring(11);
    }
    else{
      parentCommentKey = replyingTo.getAttribute('id');
    }
    parentCommentKey = 'comment-' + parentCommentKey;
    const parentComment = JSON.parse(localStorage.getItem(parentCommentKey));
    parentComment.replies.push(userInput);
    localStorage.setItem(parentCommentKey, JSON.stringify(parentComment)); 
  }
  else{
    localStorage.setItem(`comment-${id}`, JSON.stringify(userInput));
  }
}
function deleteFromLocalStorage(deleteThis){
  const deleteThisID = deleteThis.getAttribute('id');
  if(deleteThis.classList.contains('reply')){
    let parentCommentKey = deleteThis.parentElement.getAttribute('id');
    parentCommentKey = 'comment-' + parentCommentKey.substring(11);
    const parentComment = JSON.parse(localStorage.getItem(parentCommentKey));
    parentComment.replies = parentComment.replies.filter( reply => reply.id != deleteThisID);
    localStorage.setItem(parentCommentKey, JSON.stringify(parentComment));
  }
  else{
    const commentKey = 'comment-' + deleteThisID;
    localStorage.removeItem(commentKey);
  }
}
function updateItemInLocalStorage(propertyName, value, element){
  const elementID = element.getAttribute('id');
  if(propertyName === 'content'){
    value = value.replace(/^\@\w+\,?\s/i, '');
  }
  if(element.classList.contains('reply')){
    let parentCommentKey = element.parentElement.getAttribute('id');
    parentCommentKey = 'comment-' + parentCommentKey.substring(11);
    const parentComment = JSON.parse(localStorage.getItem(parentCommentKey));
    parentComment.replies.forEach(reply => {
      if(reply.id == elementID){
        if(propertyName === 'content'){
          reply.content = value;
        }
        else{
          reply.score = value;
        }
      }
    });
    localStorage.setItem(parentCommentKey, JSON.stringify(parentComment));
  }
  else{
    const commentKey = 'comment-' + elementID;
    const comment = JSON.parse(localStorage.getItem(commentKey));
    if(propertyName === 'content'){
      comment.content = value;
    }
    else{
      comment.score = value;
    }
    localStorage.setItem(commentKey, JSON.stringify(comment));
  }
}