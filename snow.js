
let ypos = 0;

function move() {
  document.querySelector(".snowflake").style.top = ypos + "px";
  ypos++;

  requestAnimationFrame( move );
}

move();
