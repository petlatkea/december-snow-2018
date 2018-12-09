
let ypos = [];
let xpos = [];
let speed = [];
let flakes = document.querySelectorAll(".snowflake");

function init() {

  let start = 25;
  let increment = 50;
  for( let i = 0; i < flakes.length; i++ ) {
    let max = document.querySelector("#nightsky").clientWidth;
    let value = Math.random() * max;
    flakes[i].style.left = value + "px";

    reset(i);
  }

  // start moving snowflakes
  move();
}

function reset(i){
  let maxX = document.querySelector("#nightsky").clientWidth;
  xpos[i] = Math.random() * maxX;
  ypos[i] = -10;
  let min = 0.17;
  let maxSpeed = 10;
  speed[i] = Math.random()*(maxSpeed-min)+min;
  flakes[i].style.transform = "scale("+Math.random()+")";
}

function move() {

  for( let i = 0; i < flakes.length; i++ ) {
    flakes[i].style.top = ypos[i] + "px";
    flakes[i].style.left = xpos[i] + "px";
    ypos[i]+= speed[i];

    let max = document.querySelector("#nightsky").clientHeight;

    if( ypos[i] > max ) {
      reset(i);
    }
  }


  requestAnimationFrame( move );
}

init();

