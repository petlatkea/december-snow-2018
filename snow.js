const config = {
  maxX: document.querySelector("#nightsky").clientWidth,
  maxY: document.querySelector("#nightsky").clientHeight,
  minSpeed: 10,
  maxSpeed: 100,
  windSpeed: 50
};




const SnowFlake = {
  ypos: 0,
  xpos: 0,
  speed: 0,
  element: null,
  reset() {
    this.xpos = Math.random() * config.maxX;
    this.ypos = -10;

    this.speed = Math.random()*(config.maxSpeed-config.minSpeed)+config.minSpeed;
    this.element.style.transform = "scale("+Math.random()+")";
  },
  show() {
    this.element.style.top = this.ypos + "px";
    this.element.style.left = this.xpos + "px";
  },
  move(delta) {
    this.ypos += this.speed * delta;
    this.xpos += config.windSpeed * delta;
    if( this.xpos > config.maxX ) {
      this.xpos = 0;
    }

    if( this.ypos > config.maxY ) {
      this.reset();
    }
  }
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
    flake.reset();

    // store it in my array
    snowflakes.push(flake);
  }

  // start moving snowflakes
  animate();
}


let last;





function animate() {
  let now = Date.now() /1000;
  let delta = now - (last || now);

 // console.log(delta);
  for( let i = 0; i < snowflakes.length; i++ ) {
    let flake = snowflakes[i];
    flake.show();

//    flakes[i].style.transform ="translate("+xpos[i]+"px, "+ypos[i]+"px)";
    flake.move(delta);
  }

  last = now;

  requestAnimationFrame( animate );
}

init();

