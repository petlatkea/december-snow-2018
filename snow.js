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
  stopped: false,
  create() {
    let div = document.createElement("div");
    div.classList.add("snowflake");
    document.querySelector("#nightsky").appendChild(div);
    this.element = div;
  },
  reset() {
    this.xpos = Math.random() * config.maxX;
    this.ypos = -10;

    this.speed = Math.random()*(config.maxSpeed-config.minSpeed)+config.minSpeed;
    this.size = Math.random();
    this.element.style.transform = "scale("+this.size+")";
    this.weight = Math.random();
    this.stopped = false;
  },
  show() {
    this.element.style.top = this.ypos + "px";
    this.element.style.left = this.xpos + "px";
  },
  move(delta) {
    if( !this.stopped ) {
      this.ypos += this.speed * delta;
      this.xpos += config.windSpeed *this.weight * delta;
      if( this.xpos > config.maxX ) {
        this.xpos = 0;
      }

      // find the xindex
      let index = Math.floor(this.xpos);
      let height = landed[index];

      if( this.ypos >= config.maxY - height ) {

        // land the snowflake
        landSnowflake(this);

        // then reset the flake
        this.reset();
        // stop this snowflake
//        this.stopped = true;
//        landed[index] += 10*this.size;
//        newSnowFlake();
      }
    }
  }
};

let snowflakes = [];
let landed = [];

function newSnowFlake() {
  let flake = Object.create(SnowFlake);
  // create a HTML element
  flake.create();

  // reset all the properties
  flake.reset();

  // store it in my array
  snowflakes.push(flake);
}

function landSnowflake( flake ) {
  // TODO: get xpos and ypos from flake!
  let x = Math.floor(flake.xpos);
  let y = config.maxY-1 - landed[x];

  landed[x]++;

  const ctx = config.ctx;
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, 2, 2);
}

function init() {

  // go over all div elements in the HTML
  //let elements = document.querySelectorAll(".snowflake");

  for( let i = 0; i < 1000; i++ ) {
    // create a snowflake object
    newSnowFlake();
  }

  // init landed array
  for( let x=0; x < config.maxX; x++ ) {
    landed[x] =0;
  }

  // find the canvas
  const canvas = document.getElementById('canvas');
  canvas.width = config.maxX;
  canvas.height = config.maxY;
const ctx = canvas.getContext('2d');
  config.ctx = ctx;


  // do something with it ...


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

