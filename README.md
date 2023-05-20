# Frontend Mentor - Interactive comments section solution

This is a solution to the [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- Upvote and downvote comments
- **Bonus**: If you're building a purely front-end project, use `localStorage` to save the current state in the browser that persists when the browser is refreshed.
- **Bonus**: Instead of using the `createdAt` strings from the `data.json` file, try using timestamps and dynamically track the time since the comment or reply was posted.

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [https://github.com/Ihezie/interactive-comments-section-main](https://github.com/Ihezie/interactive-comments-section-main)
- Live Site URL: [https://interactive-comments-section-main-fawn.vercel.app/](https://interactive-comments-section-main-fawn.vercel.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Javascript
- Mobile-first workflow

### What I learned
With this project, I was able to learn the basics of working with data in JSON format, the local storage and the the fetch API.
Also, I'm way more confortable with traversing the DOM. I had to learn and make use of a lot of inbuilt Javascript methods I was previously unaware
of. I feel like my mastery of Javascript has increased substantially because of this project.

```js
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
```
### Continued development
In future projects I plan to strive to write cleaner and more maintainable code. With all honesty, I think it'll be pretty hard for me to 
completely understand the JS code I wrote for this project in a few months.

## Author
- Frontend Mentor - [@Ihezie](https://www.frontendmentor.io/profile/Ihezie)
