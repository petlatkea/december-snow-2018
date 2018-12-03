
let ypos = 0;

function init() {
  let flakes = document.querySelectorAll(".snowflake");
  flakes[0].style.left = "50px";
  flakes[1].style.left = "100px";
  flakes[2].style.left = "150px";
  flakes[3].style.left = "200px";
  flakes[4].style.left = "250px";

  // start moving snowflakes
  move();
}

function reset(){
  ypos = -10;
}

function move() {
  let flakes = document.querySelectorAll(".snowflake");
  flakes[0].style.top = ypos + "px";
  flakes[1].style.top = ypos + "px";
  flakes[2].style.top = ypos + "px";
  flakes[3].style.top = ypos + "px";
  flakes[4].style.top = ypos + "px";

//  document.querySelector(".snowflake").style.top = ypos + "px";
  ypos++;

  let max = document.querySelector("#nightsky").clientHeight;

  if( ypos > max ) {
    reset();
  }

  requestAnimationFrame( move );
}

init();

