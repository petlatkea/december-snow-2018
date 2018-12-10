



const SnowFlake = {
  ypos: 0,
  xpos: 0,
  speed: 0,
  element: null
};

const config = {
  maxX: document.querySelector("#nightsky").clientWidth,
  maxY: document.querySelector("#nightsky").clientHeight,
  minSpeed: 10,
  maxSpeed: 100
};

let snowflakes = [];

function init() {

  // go over all div elements in the HTML
  let elements = document.querySelectorAll(".snowflake");
  for( let i = 0; i < elements.length; i++ ) {
    // create a snowflake object
    let flake = Object.create(SnowFlake);
    // connect it to the HTML element
    flake.element = elements[i];
    // reset all the properties
    reset(flake);
    // store it in my array
    snowflakes.push(flake);
  }

  // start moving snowflakes
  move();
}

function reset(flake){
  flake.xpos = Math.random() * config.maxX;
  flake.ypos = -10;

  flake.speed = Math.random()*(config.maxSpeed-config.minSpeed)+config.minSpeed;
  flake.element.style.transform = "scale("+Math.random()+")";
}

let last;

function move() {
  let now = Date.now() /1000;
  let delta = now - (last || now);

 // console.log(delta);
  for( let i = 0; i < snowflakes.length; i++ ) {
    let flake = snowflakes[i];
    flake.element.style.top = flake.ypos + "px";
    flake.element.style.left = flake.xpos + "px";

//    flakes[i].style.transform ="translate("+xpos[i]+"px, "+ypos[i]+"px)";
    flake.ypos += flake.speed * delta;


    if( flake.ypos > config.maxY ) {
      reset(flake);
    }
  }

  last = now;

  requestAnimationFrame( move );
}

init();

