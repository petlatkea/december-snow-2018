
let ypos = [];

function init() {
  let flakes = document.querySelectorAll(".snowflake");

  let start = 25;
  let increment = 50;
  for( let i = 0; i < flakes.length; i++ ) {
    let value = start + increment*i;
    flakes[i].style.left = value + "px";
    ypos[i] = Math.random()*100;
  }

  // start moving snowflakes
  move();
}

function reset(i){
  ypos[i] = -10;
}

function move() {
  let flakes = document.querySelectorAll(".snowflake");

  for( let i = 0; i < flakes.length; i++ ) {
    flakes[i].style.top = ypos[i] + "px";
    ypos[i]++;

    let max = document.querySelector("#nightsky").clientHeight;

    if( ypos[i] > max ) {
      reset(i);
    }
  }


  requestAnimationFrame( move );
}

init();

