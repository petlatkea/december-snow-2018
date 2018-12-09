
let ypos = [];
let xpos = [];
let speed = [];
let flakes = document.querySelectorAll(".snowflake");
let maxX = document.querySelector("#nightsky").clientWidth;
let maxY = document.querySelector("#nightsky").clientHeight;

function init() {

  let start = 25;
  let increment = 50;
  for( let i = 0; i < flakes.length; i++ ) {
//    let max = document.querySelector("#nightsky").clientWidth;
//    let value = Math.random() * max;
//    flakes[i].style.left = value + "px";

    reset(i);
  }

  // start moving snowflakes
  move();
}

function reset(i){
  xpos[i] = Math.random() * maxX;
  ypos[i] = -10;
  let min = 10;
  let maxSpeed = 100;
  speed[i] = Math.random()*(maxSpeed-min)+min;
  flakes[i].style.transform = "scale("+Math.random()+")";
}

let last;

function move() {
  let now = Date.now() /1000;
  let delta = now - (last || 0);

 // console.log(delta);
  for( let i = 0; i < flakes.length; i++ ) {
    flakes[i].style.top = ypos[i] + "px";
    flakes[i].style.left = xpos[i] + "px";

//    flakes[i].style.transform ="translate("+xpos[i]+"px, "+ypos[i]+"px)";
    ypos[i]+= speed[i] * delta;


    if( ypos[i] > maxY ) {
      reset(i);
    }
  }

  last = now;

  requestAnimationFrame( move );
}

init();

