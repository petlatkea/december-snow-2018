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

    // give it a random z-index from 0 - 4
    this.element.style.zIndex = Math.floor(Math.random()*4);

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

      // check if landed on a letterTop
      let y = Math.floor(this.ypos);
      if( y == letterTops[index] ) {
        // land on letter!



  //landed[x]++;

          const ctx = config.ctx;
        ctx.fillStyle = 'white';
        ctx.fillRect(index, y, 1, 1);
      }

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
  let y = config.maxY - landed[x];

  landed[x]++;

  const ctx = config.ctx;
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, 1, 1);
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


  // draw text
  ctx.font = '148px serif';
  ctx.fillStyle = "red";
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  ctx.fillText('Merry Jul', config.maxX/2, 100);

  // analyze the image
  let myImageData = ctx.getImageData(0, 0, config.maxX, config.maxY);



  // loop throug every x value
  for( let x=0; x < myImageData.width; x++ ) {

    letterTops[x] = config.maxY;
    // loop through y value on this X
    for( let y=0; y < myImageData.height; y++ ) {

      let index = 4*(y*myImageData.width+x);

      let r= myImageData.data[index];
      let g= myImageData.data[index+1];
      let b= myImageData.data[index+2];
      let a= myImageData.data[index+3];

      if( a != 0 ) {
        // non-transparent pixel at position x,y
        letterTops[x] = y;
        break;

      }

     // console.log("for x,y (%d,%d), a is: %d", x,y,a);
    }

  }

  // start moving snowflakes
  animate();
}

let letterTops = [];
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

  // avoid the spikes
  for( let x= 0; x < landed.length; x++ ) {
    let thisheight = landed[x];
    let nextheight = landed[x+1];

    // if this is to much taller than next, move snowflake to the next
    if( thisheight-2 > nextheight ) {
      // remove a pixel
      config.ctx.clearRect(x, config.maxY-landed[x],1,1);
      landed[x]--;

      config.ctx.fillRect(x+1, config.maxY-landed[x+1],1,1);
      landed[x+1]++;
    }

    if( x > 0 && thisheight-1 > landed[x-1] ) {
      // remove a pixel here
      config.ctx.clearRect(x, config.maxY-landed[x],1,1);
      landed[x]--;

      // add a pixel to the left
      config.ctx.fillRect(x-1, config.maxY-landed[x-1],1,1);
      landed[x-1]++;

    }
  }
  last = now;

  requestAnimationFrame( animate );
}

init();

