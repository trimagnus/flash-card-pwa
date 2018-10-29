//EXAMPLE DECKS AND USERS BELOW
// let test_deck = {
//   deckId: 0,
//   title: "Test Deck 1",
//   cards: [
//     {q: "What Is the Airspeed Velocity of an Unladen Swallow?", a: "Roughly 11 meters per second, or 24 miles an hour."}
//   ]
// };
//let user = {loginName: "Magnus", deckIds: 0, activeDeck: -1, decks: []};
//EXAMPLE DECKS AND USERS ABOVE

function makeCardElement(index, content, answer) {
  //Card Top Section
  let card = document.createElement("div");
  card.setAttribute("class", "card");
  card.innerHTML = `<div class="card-top">
                      <div class="card-edit-element">
                        <button class="card-edit-button" id="card-edit-button">&#9998;</button>
                        <button class="card-delete-button" id="card-delete-button">&#10007;</button>
                      </div>
                    </div>
                    <div class="card-content">
                      <p>${content}</p>
                      <button class="card-flip-button">Show Answer</button>
                    </div>`;
  card._index = index;
  card._isFlipped = false;
  card._question = content;
  card._answer = answer;
  
  let p = card.getElementsByTagName("p")[0];
  let flipButton = card.getElementsByClassName("card-flip-button")[0];
  let cardContent = card.getElementsByClassName("card-content")[0];
  let editButton = card.getElementsByClassName("card-edit-button")[0];
  let deleteButton = card.getElementsByClassName("card-delete-button")[0];
  
  card._flip = function() {
    cardContent.my_height = cardContent.getBoundingClientRect().height + "px";
    if(!card._isFlipped){
      p.style.color = "rgba(255,255,255,0)";
      setTimeout(function(){
        p.innerHTML = card._answer;
        flipButton.innerHTML = "Show Question";
        cardContent.style.height = cardContent.my_height;
        p.style.color = "rgba(0,0,0,1)";
        card._isFlipped = true;
      }, 250);
    } else {
      p.style.color = "rgba(255,255,255,0)";
      setTimeout(function(){
        p.innerHTML = card._question;
        flipButton.innerHTML = "Show Answer";
        p.style.color = "rgba(0,0,0,1)";
        card._isFlipped = false;
      }, 250);
    }
  };
  flipButton.onclick = function() {
    document.activeElement.blur()
    card._flip();
  };
  editButton.onclick = function(e) {
    let curtain = document.createElement("div");
    curtain.setAttribute("class", "curtain");
  
    curtain.onclick = function(e){
      if(e.target === curtain){
        curtain.remove();
      }
    };
    let q = user.decks[user.activeDeck].cards[card._index].q;
    let a = user.decks[user.activeDeck].cards[card._index].a;
    curtain.innerHTML = `<div class="wrapper centered-text overlay card-creator">
                           <h2>Edit Card:</h2>
                           <hr>
                           <p>Question:</p>
                           <textarea rows="4" id="card-editor-question">${q}</textarea>
                           <p>Answer:</p>
                           <textarea rows="4" id="card-editor-answer">${a}</textarea>
                           <div class="card-creator-buttons-area">
                             <button id="card-editor-submit">Update</button>
                             <button id="card-editor-cancel">Cancel</button>
                           </div>
                         </div>`;
    document.getElementsByTagName("body")[0].appendChild(curtain);
    let submitButton = document.getElementById("card-editor-submit");
    let cancelButton = document.getElementById("card-editor-cancel");
    submitButton.onclick = function(){
      let qText = document.getElementById("card-editor-question");
      let aText = document.getElementById("card-editor-answer");
      //Check for values that are only spaces (strip extraneous spaces)
      qText.value = qText.value.trim();
      aText.value = aText.value.trim();
      if(qText.value === ""){
        qText.focus();
        return;
      }
      if(aText.value === ""){
        aText.focus();
        return;
      }
      user.decks[user.activeDeck].cards[card._index].q = qText.value;
      user.decks[user.activeDeck].cards[card._index].a = aText.value;
      saveUserData();
      curtain.remove();
      refreshView();
    };
    cancelButton.onclick = function(){
      curtain.remove();
    };
  }
  deleteButton.onclick = function(e) {
    //ASK USER IF SURE!!!!!!!!!
    let curtain = document.createElement("div");
    document.getElementsByTagName("body")[0].appendChild(curtain);
    curtain.setAttribute("class", "curtain dialogue-overlay");

    curtain.innerHTML = `<div class="wrapper centered-text overlay">
                           <h2>Delete this card?</h2>
                           <div class="dialogue-buttons">
                             <button id="prompt-yes-button">Yes</button>
                             <button id="prompt-no-button">No</button
                           </div>
                         </div>`;
    let yesButton = document.getElementById("prompt-yes-button");
    let noButton = document.getElementById("prompt-no-button");
    noButton.onclick = function() {
      curtain.remove();
    };
    yesButton.onclick = function() {
      user.decks[user.activeDeck].cards.splice(card._index, 1);
      saveUserData();
      curtain.remove();
      refreshView();
    }
  };
  return card;
}

function clearView() {
  let main = document.getElementById("main");
  main.innerHTML = "";
}

//CHOOSE AND DISPLAY DECK
function displayBrowseView() {
  clearView();
  let wrapper = document.createElement("div");
  wrapper.setAttribute("class", "wrapper");
  let cardContainer = document.createElement("div");
  cardContainer.setAttribute("class", "cards");

  //LOAD DECK
  let text = "";
  if(user.activeDeck === -1){
    cardContainer.innerHTML = `<div class='wrapper centered-text'>
                                <h2>You don't have any decks.</h2>
                                <p>Click on New Deck above to get started!</p>
                               </div>`;
  } else {
    let deck = user.decks[user.activeDeck];
    if(deck.cards.length === 0) {
      cardContainer.innerHTML = `<div class='wrapper centered-text'>
                                  <h2>You haven't made any cards yet!</h2>
                                  <p>Click on Deck Editor above to get started!</p>
                                </div>`;
    } else {
      for(let i = 0; i < deck.cards.length; i++) {
        cardContainer.appendChild(makeCardElement(i,deck.cards[i].q, deck.cards[i].a));
      }
    }
  }
  wrapper.appendChild(cardContainer);
  document.getElementById("main").appendChild(wrapper);
}

//NEW DECK
function displayNewView() {
  clearView();
  let main = document.getElementById("main");
  main.innerHTML = `<div class='wrapper centered-text'>
                      <h2>Create New Deck</h2>
                      <input id="new-input" class="new-deck-input" type="text" placeholder="Give it a name...">
                      <button id="new-button" class="new-deck-button">Create</button>
                    </div>`;
  document.getElementById("new-button").onclick = function() {
    let inp = document.getElementById("new-input");
    if(inp.value === ""){
      inp.focus();
    } else {
      createNewDeck(user, inp.value);
      inp.value = "";
      saveUserData();
      refreshView();
    }
  };
}

function createNewDeck(user, title) {
  let id = user.deckIds++;
  let deck = {
    deckId: id,
    title: title,
    cards: []
  };
  user.decks.push(deck);
  user.activeDeck = user.decks.length - 1;
}

//EDIT DECK
function displayEditView() {
  clearView();
  
  if(user.activeDeck === -1) {
    return;
  }
  
  let main = document.getElementById("main");
  main.innerHTML = `<div class='wrapper centered-text'>
                      <div class="deck-editor">
                        <h3>Edit Deck Name</h3>
                        <input id="edit-deck-input" class="edit-deck-input" type="text">
                        <button id="edit-deck-button" class="edit-deck-button">Update</button>
                        <h3>Cards [${user.decks[user.activeDeck].cards.length}]</h3>
                        <button id="add-card-button" class="add-card-button">Add Card</button>
                        <hr>
                        <button class="delete-deck-button" id="delete-deck-button">&#9762; Delete Deck? &#9762;</button>
                      </div>
                    </div>`;
  
  let inp = document.getElementById("edit-deck-input");
  inp.value = user.decks[user.activeDeck].title;
  document.getElementById("edit-deck-button").onclick = function(e) {
    e.preventDefault();
    updateDeckName(inp.value);
    saveUserData();
  }
  
  document.getElementById("add-card-button").onclick = function(e){
    let curtain = document.createElement("div");
    document.getElementsByTagName("body")[0].appendChild(curtain);
    curtain.setAttribute("class", "curtain");
    curtain.innerHTML = `<div class="wrapper centered-text overlay card-creator">
                           <h2>Create a card:</h2>
                           <hr>
                           <p>Question:</p>
                           <textarea rows="4" id="card-creator-question"></textarea>
                           <p>Answer:</p>
                           <textarea rows="4" id="card-creator-answer"></textarea>
                           <div class="card-creator-buttons-area">
                             <button id="card-creator-submit">Create</button>
                             <button id="card-creator-cancel">Cancel</button>
                           </div>
                         </div>`;
    document.getElementById("card-creator-submit").onclick = function(){
      let question = document.getElementById("card-creator-question");
      let answer = document.getElementById("card-creator-answer");
      if(question.value === "") {
        question.focus();
        return;
      }
      if(answer.value === ""){
        answer.focus();
        return;
      }
      let newCard = {q:question.value, a:answer.value};
      user.decks[user.activeDeck].cards.push(newCard);
      saveUserData();
      curtain.remove();
      displayEditView();
    };
    
    curtain.onclick = function(e){
      if(e.target === curtain){
        curtain.remove();
      }
    };
    document.getElementById("card-creator-cancel").onclick = function(){
      curtain.remove();
    };
  };
  let deleteDeckButton = document.getElementById("delete-deck-button");
  deleteDeckButton.onclick = function(){
    //ASK USER IF SURE!!!!!!!!!
    let curtain = document.createElement("div");
    document.getElementsByTagName("body")[0].appendChild(curtain);
    curtain.setAttribute("class", "curtain dialogue-overlay");

    curtain.innerHTML = `<div class="wrapper centered-text overlay">
                           <h2>Delete this deck???</h2>
                           <div class="dialogue-buttons">
                             <button id="prompt-delete-deck">Yes</button>
                             <button id="prompt-save-deck">No</button
                           </div>
                         </div>`;
    let yesButton = document.getElementById("prompt-delete-deck");
    let noButton = document.getElementById("prompt-save-deck");
    noButton.onclick = function() {
      curtain.remove();
    };
    yesButton.onclick = function() {
      user.decks.splice(user.activeDeck, 1);
      if(user.decks.length > 0){
        user.activeDeck = 0;
      } else {
        user.activeDeck = -1;
      }
      saveUserData();
      curtain.remove();
      refreshView();
    }
  };
}

function updateDeckName(value) {
  user.decks[user.activeDeck].title = value;
  setDeckSelector();
}

//DECK SELECTOR
function setDeckSelector(){
  let title = user.activeDeck !== -1 ? user.decks[user.activeDeck].title : "--no decks--";
  document.getElementById("deck-selector").innerHTML = `<p>Current deck:</p>
                                                        <p>${title}</p>`;
}

//Naive implementation: Rework to keep track of current view and reload that
function refreshView() {
  setDeckSelector()
  document.getElementById("browseButton").click();
}

function makeLocalUser() {
  return {loginName: "Log In", deckIds: 0, activeDeck: -1, decks: []};
}

function getUserData() {
  let user = JSON.parse(localStorage.getItem("activeUser"));
  if(!user) {
    user = makeLocalUser();
  }
  document.getElementById("user").innerHTML = user.loginName;
  return user;
}

function saveUserData() {
  localStorage.setItem("activeUser", (JSON.stringify(user)));
}

function clearUserData() {
  localStorage.removeItem("activeUser");
  user = makeLocalUser();
  refreshView();
}

//Used in the export
function exportData(text, name, type) {
  var exportButton = document.getElementById("export-button");
  var file = new Blob([text], {type: type});
  exportButton.href = URL.createObjectURL(file);
  exportButton.download = name;
}

//Import data
//Adapted from https://stackoverflow.com/questions/7346563/loading-local-json-file/21446426#21446426
function loadFile() {
  var input, file, fr;

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('fileinput');
  if (!input) {
    alert("Couldn't find the fileinput element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
  }

  function receivedText(e) {
    let lines = e.target.result;
    user = JSON.parse(lines);
    saveUserData();
    refreshView();
    document.getElementsByClassName("curtain")[0].remove();
  }
}

//CHANGE VIEW FUNCTION
function activateView(e) {
  e.preventDefault();
  let nav = document.getElementById("nav");
  document.activeElement.blur()
  for(let child of nav.childNodes){
    if(child === e.target){
      child.className = "selected";
      if(child.id === "newButton") {
        //Let user make a new deck
        displayNewView();
      } else if (child.id === "browseButton") {
        //Display a deck list and show the browse view of selected deck
        displayBrowseView();
      } else {
        //Display a deck list and show edit view of selected deck
        displayEditView();
      }
    } else {
      child.className = "";
    }
  }
}

function deckSelector() {
  if(user.activeDeck === -1){
    return;
  }
  let curtain = document.createElement("div");
  curtain.setAttribute("class", "curtain");
  
  curtain.onclick = function(e){
    curtain.remove();
  };
  
  curtain.innerHTML = `<div class="wrapper centered-text overlay">
                         <h2>Choose a deck:</h2>
                         <hr>
                         <ul class="decklist" id="decklist">
                           
                         </ul>
                       </div>`
  document.getElementsByTagName("body")[0].appendChild(curtain);
  
  let ul = document.getElementById("decklist");
  for(let deck of user.decks) {
    let li = document.createElement("li");
    li._id = deck.deckId;
    li.innerHTML = deck.title;
    
    li.onclick = function(e){
      let id = user.decks.map(d => d.deckId).indexOf(e.target._id);
      user.activeDeck = id;
      saveUserData();
      refreshView();
    };
    
    ul.appendChild(li);
  }
}

function userMenu() {
  let curtain = document.createElement("div");
  document.getElementsByTagName("body")[0].appendChild(curtain);
  curtain.setAttribute("class", "curtain");
  curtain.innerHTML = `<div class="wrapper centered-text overlay">
                         <form id="jsonFile" name="jsonFile" enctype="multipart/form-data" method="post">
                           <h3>Import User Data</h3>
                           <input type='file' id='fileinput'>
                           <input type='button' id='btnLoad' value='Load' onclick='loadFile();'>
                         </form>
                         <hr>
                         <h3 class="export-header">Export user data?</h3>
                         <a href="javascript:void(0)" id="export-button"><button>Export</button></a>
                         <hr>
                         <h3>Clear local data?</h3>
                         <p class="warning">Warning: This deletes all user data stored on this browser!</p>
                         <button id="clear-local-data-button">Clear local data</button>
                       </div>`;
  let exportUserData = function() {
    setTimeout("exportData(JSON.stringify(user), 'flash_cards.json', 'text/plain')");
  }
  //Need to call this here or the user will have to click twice for each download
  exportUserData();
  //
  document.getElementById("export-button").onclick = exportUserData;
  document.getElementById("clear-local-data-button").onclick = function() {
    clearUserData();
    refreshView();
    curtain.remove();
  }
  curtain.onclick = function(e) { if(e.target === curtain) {curtain.remove();} };
}

document.getElementById("user").onclick = userMenu;
document.getElementById("deck-selector").onclick = deckSelector;
document.getElementById("newButton").addEventListener("click", activateView);
document.getElementById("browseButton").addEventListener("click", activateView);
document.getElementById("editButton").addEventListener("click", activateView);

let localStorage = window.localStorage;
let user = getUserData();

setDeckSelector();
displayBrowseView();