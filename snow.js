
let ypos = 0;

function reset(){
  ypos = -10;
}

function move() {
  document.querySelector(".snowflake").style.top = ypos + "px";
  ypos++;

  let max = document.querySelector("#nightsky").clientHeight;

  if( ypos > max ) {
    reset();
  }

  requestAnimationFrame( move );
}

move();
