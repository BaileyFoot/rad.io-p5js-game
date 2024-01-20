let fft;
playing = false;
pause = 1;

//define variables that help keep track of the game state.
let downtime = 100;
let pauseDowntime = 50;
let score = 0;
let lives = 1;

//define channel urls.
let hiphopChannel = 'https://stream-mixtape-geo.ntslive.net/mixtape22';
let poolsideChannel = 'https://stream-mixtape-geo.ntslive.net/mixtape4?client=NTSWebApp&t=1702388090403'; 
let memoryLaneChannel = 'https://stream-mixtape-geo.ntslive.net/mixtape6?client=NTSWebApp&t=1702388286860';
let thePitChannel = 'https://stream-mixtape-geo.ntslive.net/mixtape34?client=NTSWebApp&t=1702388342945';

//game character.
var circleX = 200;
var circleY = 200;
let mySize = 100;
let mySpeed = 10;

//toggle radio button position.
let size = 150;
let toggleButtonX = 100;
let toggleButtonY = 100;
let enemySpeed = 1.5;

//volume button position.
let volumeButtonX = 500;
let volumeButtonY = 100;

//coins! 
//will add to the points counter as you collect them...
let coinPositions = [];
let coinSize = 10;
let framesSinceCoin = 200;

//power ups!
let powerupPositions = [];
let powerupType = [];
let powerupSize = 45;
let framesSincePowerup = 300;




function setup() { 
  //create the bloody canvas.
  createCanvas(windowWidth-25,windowHeight-25);
  textSize(20)

  //define the radio shit (the channel).
  fft = new p5.FFT();
  channel = poolsideChannel;
  radioPlayer.volume = .1;

  //turn the radio on!
  toggleRadio("off");

  gameSetup();
}

function draw (){
  strokeWeight(1);
  stroke(0);
  if(playing) {
    toggleRadio("on");
  }

  background(255);
  //draw the enemy
  fill(238,253,109);
  ellipse(toggleButtonX, toggleButtonY, size, size);


  //draw my game character
  ellipse(circleX, circleY, mySize, mySize);


  //draw some lil coins (points for us to collect)!
  //will make new coins when there is less than x/2 on the screen (so 15)...
  if(coinPositions.length < 30) {
    makeCoins(20);
  }
  //moved make powerups into isTouchingCoin() so they are only made after scoring a point...

  //draw all our coins!
  drawItems(coinPositions,coinSize);
  //draw all our powerups!
  drawItems(powerupPositions,powerupSize,powerupType);

  //add a little note if you pick up a coin.
  fill(255);
  strokeWeight(2);
  if(framesSinceCoin < 80) {
    text("You just collected a coin!",50,windowHeight-100);
  }
  if(framesSincePowerup < 200) {
    if(enemySpeed <= 0) {
      text("SPECIAL POWER UP!!! He's scared of you!",50,windowHeight-120);
    } else {
      text("POWER UP!!!",50,windowHeight-120);
    }
  }
  if(framesSincePowerup > 200 && enemySpeed <= 0) {
    enemySpeed = 1.5;
  }

  
  text(score,50,windowHeight-50);
  strokeWeight(1);


  //if the game isn't paused then have the enemy move towards the character.
  if (pause == 0) {
    chase(enemySpeed);
  }

  //test if the enemy is touching the character.
  if(isTouchingEnemy()){
    if (downtime > 100){
      toggleRadio("off");
      
      pause = 1; 
      downtime = 0;
    }
  }

  isTouchingCoin();
  isTouchingPowerup();
  returnPlayerToScreenTest();
  //returnPlayerToScreen();
  moveMeNew();
  //moveMe();
  

  
  //add to the downtime counters
  //this is so things don't turn on and off rapidly 
  //otherwise pushing enter will pause and then start the game again rapidly (not wanted!).
  downtime++;
  pauseDowntime++;
  framesSinceCoin++;
  framesSincePowerup++;
}




function gameSetup(){
  radioPlayer.volume = .1;

  //make some coins for us to pick up hehe.
  if(coinPositions.length < 3) {
    makeCoins(40);
  }

  //make a few powerups as well..
  if(powerupPositions.length < 1) {
    makePowerups(1);
  }
  //i want the character to spawn in the middle of the page:)
  circleX = windowWidth/2;
  circleY = windowHeight/2;

  mySize = 100;
  mySpeed = 10;

  //toggle radio button position.
  size = 150;
  toggleButtonX = 100;
  toggleButtonY = 100;
  enemySpeed = 1.5;

  //volume button position.
  volumeButtonX = 500;
  volumeButtonY = 100;

  score = 0;
  lives = 1;

}

function makeCoins(numberOfCoins) {
  for(let i=0; i<numberOfCoins; i++) {
    //populate the coinPositions array with the positions of all the coins I want to collect hehe.
    let x = random(windowWidth-100);
    let y = random(windowHeight-100);
    append(coinPositions,x);
    append(coinPositions,y);
  }
}

function drawItems(itemPosList,itemSize,itemType) {
  fill(255);
  for(let i=0; i<itemPosList.length; i++) {

      if(itemType !== undefined && i<itemType.length) {
        if(powerupType == 0) {
          fill(152,104,252);
        }
        if(powerupType == 1) {
          
        }
        if(powerupType == 2) {
          
        }
      }

    //draw the coins at these x and y positions.
    if(i==0 || i%2==0){
      ellipse(itemPosList[i], itemPosList[i+1], itemSize, itemSize);
    }
  }
  fill(255);
}

function makePowerups(numberOfPowerups) {
  for(let i=0; i<numberOfPowerups; i++) {
    //populate the coinPositions array with the positions of all the coins I want to collect hehe.
    let x = random(windowWidth-100);
    let y = random(windowHeight-100);
    append(powerupPositions,x);
    append(powerupPositions,y);

    //give a random number that will be used to determine the type of powerup when its drawn.
    val = int(random(5));
    append(powerupType,val);
  }
}

function moveMe(){
  if (keyIsPressed) {
    // controls for our character
    if(pause == 0) {
      if (keyCode == RIGHT_ARROW) {
        circleX +=10;
        return;
      }  
      if (keyCode == LEFT_ARROW) {
          circleX -= 10;
          return;
      }
      if (keyCode == UP_ARROW) {
          circleY -= 10; 
          return;
      }
      if (keyCode == DOWN_ARROW) {
          circleY += 10; 
          return;
      }
    }
    //to decide if to pause the game
    if (keyCode === ENTER) {
      if(pauseDowntime > 25) {
        if (pause == 1) {
          pause = 0;
          pauseDowntime = 0;
          gameSetup();
          playing = true;
        } else{
          pause = 1;
          pauseDowntime = 0;
        }
      }
    }
  }
  if(pause == 1){
    menu();
  }
}

function moveMeNew(){
  if (keyIsPressed) {
    // controls for our character
    if(pause == 0) {
      if (keyIsDown(RIGHT_ARROW)) { 
        circleX +=mySpeed;
        return;
      } 
      if (keyIsDown(LEFT_ARROW)) { 
        circleX -= mySpeed;
        return;
      } 
      if (keyIsDown(UP_ARROW)) { 
        circleY -= mySpeed; 
        return;
      } 
      if (keyIsDown(DOWN_ARROW)) { 
          circleY += mySpeed; 
          return;
      }
    }
    //to decide if to pause the game
    if (keyCode === ENTER) {
      if(pauseDowntime > 25) {
        if (pause == 1) {
          pause = 0;
          pauseDowntime = 0;
          gameSetup();
          playing = true;
        } else{
          pause = 1;
          pauseDowntime = 0;
        }
      }
    }
  }
  if(pause == 1){
    menu();
  }
}


function returnPlayerToScreen(){
  if(circleX > (windowWidth + (size))) {
    circleX = 0 - size;
    return;  
  }
  if (circleX < (0 - (size)) ) {
    circleX = windowWidth + size;
    return;
  }

  if(circleY > (windowHeight + (size))) {
    circleY = 0 - size;
    return;
  }

  if (circleY < (0 - (size)) ) {
    circleY = windowHeight + size;
    return;
  }
}

function returnPlayerToScreenTest(){
  if(circleX > (windowWidth + (10))) {
    circleX = 0 - 10;
    return;  
  }
  if (circleX < (0 - (10)) ) {
    circleX = windowWidth + 10;
    return;
  }

  if(circleY > (windowHeight + (10))) {
    circleY = 0 - 10;
    return;
  }

  if (circleY < (0 - (10)) ) {
    circleY = windowHeight + 10;
    return;
  }
}

function isTouchingEnemy(){
  if(dist(circleX,circleY,toggleButtonX,toggleButtonY)< (mySize/2)+(size/2)) {
    return true;
  }
}

function isTouchingCoin(){
  for(i=0; i < coinPositions.length; i+=2){
    if(dist(circleX,circleY,coinPositions[i],coinPositions[i+1])< (mySize/2)+(coinSize/2)) {

        //remove both the x and the y positions of the coin from the coins list.
        //stop it from being drawn the next time the program loops.

        coinPositions.splice(i,2);

        //increase our size as reward:)
        //fuck it change the enemy speed as well.
        mySize++;
        mySpeed += .015
        enemySpeed += .3;

        //make a counter 0 so we know how recently we got a coin..
        framesSinceCoin = 0;
        score++;
        if(score % 4 == 0 && powerupPositions.length < 2) {
          makePowerups(1);
        }

        if (radioPlayer.volume +.1 < 1){
          radioPlayer.volume = radioPlayer.volume +.1;
        }     
      }
    }
  }

function isTouchingPowerup(){
  for(i=0; i < powerupPositions.length; i+=2){

    if(dist(circleX,circleY,powerupPositions[i],powerupPositions[i+1])< (mySize/2)+(powerupSize/2)) {

        //remove both the x and the y positions of the coin from the coins list.
        //stop it from being drawn the next time the program loops.

        powerupPositions.splice(i,2);

        //increase our size as reward:)
        //fuck it change the enemy speed as well.
        mySize++;
        enemySpeed = enemySpeed + .3;

        //make a counter 0 so we know how recently we got a coin..
        framesSincePowerup = 0;
        score++;

        //change the volume and enemy speed.
        newVol = radioPlayer.volume /2;
        enemySpeed = enemySpeed/1.5;

        changeChannel("random");

        if (score/20 < 1){
          radioPlayer.volume = newVol;
        }

        type = powerupType[i];
        powerupType.splice(i,3);
        
        if(type == 0) {
          changeChannel("thepit");
          enemySpeed = enemySpeed *(-1); //ENEMY RUN AWAY POWERUP TEST TEST TEST. WILL BREAK THE GAME 
          return;
          //channel = thePitChannel;
        } 
        if (type === 1) {
          changeChannel("hiphop")
          return;
        }
        if (type === 2) {
          changeChannel("poolside");
          return;
        }
        else{
          changeChannel(random);
          return;
        }
        
      }
    }
  }

function toggleRadio(state) {
  if(state == "on") {
    playStation(channel);
    playing = true;
  }
  if(state == "off") {
    radioPlayer.pause();
    playing = false;
  }
  if(state =="toggle") {
    if (playing){
      radioPlayer.pause();
      playing = false;
    } else {
      playStation(channel);
      playing = true;
    }
  }
  else {
    return;
  }
}

function changeChannel(newChannel) {
  //expects a name of the channel to change to or "random"...

  if(newChannel == "hiphop") {
    channel = hiphopChannel;
    return;
  }
  if(newChannel == "poolside") {
    channel = poolsideChannel;
    return;
  }
  if(newChannel == "memoryLane") {
    channel = memoryLaneChannel;
    return;
  }
  if(newChannel == "thepit") {
    channel = thePitChannel;
    return;
  }
  if(newChannel == "random") {
    val = int(random(4));
    if(val == 0) {
      channel = hiphopChannel;
      return;
    }
    if(val == 1) {
      channel = poolsideChannel;
      return;
    }
    if(val == 2) {
      channel = memoryLaneChannel;
      return;
    }
    if(val == 3) {
      channel = thePitChannel;
      return;
    }
  }
  console.log("changeChannel() wrong input");

}

function playStation(url) {
  if (radioPlayer.src !== url) {
      radioPlayer.src = url;
      radioPlayer.load();  // reload audio to apply new source
  }
  radioPlayer.play();
}

function chase(speed) {
  //write something that will have the enemy run off the screen after you if its a shorter distance...
  //if(dist(0,circleY,0,toggleButtonY) < dist(0,0,))

  if (circleX > toggleButtonX) {
    toggleButtonX = toggleButtonX +speed;
  } else {
    if (circleX < toggleButtonX) {
      toggleButtonX = toggleButtonX -speed;
  }
  }
  if (circleY > toggleButtonY) {
    toggleButtonY = toggleButtonY +speed;
  } else {
    if (circleY < toggleButtonY) {
      toggleButtonY = toggleButtonY -speed;
    }
  }
}


function menu() {
  fill(255);
  stroke(0);
  rect((windowWidth/2)-windowWidth/7,(windowHeight/2)-windowHeight/3.5, windowWidth/3.4, windowHeight/1.75, 20);

  fill(0);
  text("rad.io",windowWidth/2.05,windowHeight/4)
  noStroke();

  if(score > 0){
    text("uh oh blobby got you!",windowWidth/2.3,windowHeight/3)
    text("score: " + score,windowWidth/2.1,windowHeight/2)

    if(score < 10) {
      text("remember to use ur arrow keys to move :)",windowWidth/2.6,windowHeight/1.7)
    }
    if(score > 50) {
      text("bloody great score! :)",windowWidth/2.25,windowHeight/1.7)
    }
  }

  if(score == 0) {
    text("use ur arrow keys to move :)",windowWidth/2.4,windowHeight/3);

    text("small coins crank the volume and anger blobby",windowWidth/2.7,windowHeight/2.4);
    text("big powerup coins calm everyone down",windowWidth/2.6,windowHeight/2.2)

    text("collect points and dont let blobby get you!",windowWidth/2.62,windowHeight/1.8  );

    
  }
  stroke(0);
  text("push enter to start...",windowWidth/2.25,windowHeight/1.5  );

}
