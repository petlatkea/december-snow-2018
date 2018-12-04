
let ypos = 0;

function init() {
  let flakes = document.querySelectorAll(".snowflake");

  let start = 25;
  let increment = 50;
  for( let i = 0; i < flakes.length; i++ ) {
    let value = start + increment*i;
    flakes[i].style.left = value + "px";
  }

  // start moving snowflakes
  move();
}

function reset(){
  ypos = -10;
}

function move() {
  let flakes = document.querySelectorAll(".snowflake");

  for( let i = 0; i < flakes.length; i++ ) {
    flakes[i].style.top = ypos + "px";
  }

  ypos++;

  let max = document.querySelector("#nightsky").clientHeight;

  if( ypos > max ) {
    reset();
  }

  requestAnimationFrame( move );
}

init();

