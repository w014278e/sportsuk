//Hamburger menu
(function () {
  'use strict';

  var menuIconElement = document.querySelector('.header__icon');
  var menuElement = document.querySelector('.menu');
  var menuOverlayElement = document.querySelector('.menu__overlay');

  //Menu click event
  menuIconElement.addEventListener('click', showMenu, false);
  menuOverlayElement.addEventListener('click', hideMenu, false);
  menuElement.addEventListener('transitionend', onTransitionEnd, false);

   //To show menu
  function showMenu() {
  	menuElement.style.transform = "translateX(0)";
    menuElement.classList.add('menu--show');
    menuOverlayElement.classList.add('menu__overlay--show');
  }

  //To hide menu
  function hideMenu() {
  	menuElement.style.transform = "translateX(-110%)";
    menuElement.classList.remove('menu--show');
    menuOverlayElement.classList.remove('menu__overlay--show');
    menuElement.addEventListener('transitionend', onTransitionEnd, false);
  }

  var touchStartPoint, touchMovePoint;

  /*Swipe from edge to open menu*/

  //`TouchStart` event to find where user start the touch
  document.body.addEventListener('touchstart', function(event) {
  	touchStartPoint = event.changedTouches[0].pageX;
  	touchMovePoint = touchStartPoint;
  }, false);
  
  //`TouchMove` event to determine user touch movement
  document.body.addEventListener('touchmove', function(event) {
  	touchMovePoint = event.touches[0].pageX;
  	if (touchStartPoint < 10 && touchMovePoint > 30) {  		
      menuElement.style.transform = "translateX(0)";
  	}
  }, false);

  function onTransitionEnd() {
  	if (touchStartPoint < 10) {
  	  menuElement.style.transform = "translateX(0)";
  	  menuOverlayElement.classList.add('menu__overlay--show');
  	  menuElement.removeEventListener('transitionend', onTransitionEnd, false);	
  	}
  }
})();

//Preloader
var preloader;

function myFunction() {
    preloader = setTimeout(showPage, 170);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("appcontent").style.display = "block";
}

//Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js').then(function(registration) {

    console.log('Service worker registered successfully');
  }).catch(function(err) {
    console.log('Service worker registration failed: ', err);
  });
}

const footballMatchStats = document.getElementById('footballMatchJSONinfo');
if(footballMatchStats){
    fetch("footballMatchJSONinfo.json")
        .then(response => {
            return response.json();
        }).then(footballMatchJSONinfo => {
            const footballMatchJSONinfoHTML = footballMatchJSONinfo.map(event => {
                return `<div class="mdl-cell mdl-card mdl-shadow--4dp portfolio-card">
                    <div class="mdl-card__media">
                        <img class="article-image" src="${event.image}" border="0" alt="">
                    </div>
                    <div class="mdl-card__title">
                        <h2 class="mdl-card__title-text">${event.newsheadline}</h2>
                    </div>
                    <div class="mdl-card__supporting-text">
                        ${event.headlineinformation}
                    </div>
                  
                </div>`;
            }).join("\n");
            
            footballMatchStats.innerHTML = footballMatchJSONinfoHTML;
        });
}

// For second page
const footballHeadlinesView = document.getElementById('footballHeadlines');
if(footballHeadlinesView){
    fetch(" https://newsapi.org/v1/articles?source=talksport&sortBy=top&apiKey=2117f72d54d5433eba479863fb7ab3e5")
        .then(response => {
            return response.json();
        }).then(footballHeadlines => {
            const footballHeadlinesHTML = footballHeadlines.articles.map(article => {
                return `<div class="mdl-cell mdl-card mdl-shadow--4dp portfolio-card">
                    <div class="mdl-card__media">
                        <img class="article-image" src="${article.urlToImage}" border="0" alt="">
                    </div>
                    <div class="mdl-card__title">
                        <h2 class="mdl-card__title-text">${article.title}</h2>
                    </div>
                    <div class="mdl-card__supporting-text">
                        ${article.description}
                    </div>
                    <div class="mdl-card__actions mdl-card--border">
                        <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent" href="${article.url}" data-upgraded=",MaterialButton,MaterialRipple">Read more<span class="mdl-button__ripple-container"><span class="mdl-ripple"></span></span></a>
                    </div>
                </div>`;
            }).join("\n");
            
            footballHeadlinesView.innerHTML = footballHeadlinesHTML;
        });
}


// localstorage form
function localstorage() {
  		//check to see if this browser support local storage: return true if so, false if not
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}
  	function save() {
  		if (localstorage()) {
  			
  			var name = document.getElementById("name").value;
  			var response = document.getElementById("response").value;

  			
  			
  			localStorage.setItem('name',name);
  			localStorage.setItem('response',response);
  		}
  	}

  	function set() {
  		if (localstorage()) {
  			
  			document.getElementById('name').value = localStorage.getItem('name');
  			document.getElementById('response').value = localStorage.getItem('response');
  		}
  	}