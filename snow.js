// configuration object
const config = {
  ctx: null,
  maxX: document.querySelector("#nightsky").clientWidth,
  maxY: document.querySelector("#nightsky").clientHeight,
  minSpeed: 10,
  maxSpeed: 100,
  windSpeed: 50
};

function resized() {
  console.log("resized");

  let oldx = config.maxX;
  let oldy = config.maxY;

  config.maxX = document.querySelector("#nightsky").clientWidth;
  config.maxY = document.querySelector("#nightsky").clientHeight;

  let ratioX = config.maxX / oldx;
  let ratioY = config.maxY / oldy;

  // move all the snowflakes to new x-positions
  for (let i = 0; i < snowflakes.length; i++) {
    let snowflake = snowflakes[i];

    snowflake.xpos = snowflake.xpos * ratioX;
    snowflake.ypos = snowflake.ypos * ratioY;
  }

  initCanvas();

  //re-initialize text for new size
  initText();
  initTrees();

  initPlatforms();
  findNeighbouringPlatforms();
}

// Prototype SnowFlake
const SnowFlake = {
  ypos: 0,
  xpos: 0,
  speed: 0,
  element: null,
  stopped: false,
  create() {
    // create div.snowflake and add it to the #nightsky
    let element = document.createElement("div");
    element.classList.add("snowflake");
    document.querySelector("#nightsky").appendChild(element);
    this.element = element;

    this.reset();
  },
  reset() {
    this.xpos = Math.random() * config.maxX;
    this.ypos = -10;

    this.speed =
      Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
    this.size = Math.random();
    this.weight = Math.random();
    this.stopped = false;

    // give it a random z-index from 0 - 4
    this.zIndex = Math.floor(Math.random() * 4);

    // apply new styles.
    this.element.style.zIndex = this.zIndex;
    this.element.style.transform = "scale(" + this.size + ")";
  },
  show() {
    this.element.style.top = this.ypos + "px";
    this.element.style.left = this.xpos + "px";
  },
  move(delta) {
    if (!this.stopped) {
      this.ypos += this.speed * delta;
      this.xpos += config.windSpeed * this.weight * delta;
      if (this.xpos > config.maxX) {
        this.xpos = 0; // TODO: Check if this causes landing at position 0
      }

      // check if snowflake has landed
      // find rounded x and y values
      let x = Math.floor(this.xpos);
      let y = Math.floor(this.ypos);

      // check landing on each platform in this x
      let platforms = allPlatforms[x];
      let lowest = platforms[platforms.length - 1];
      // loop through them, check if snowflake hits one of them
      for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i];

        // if y == this platform - then land snowflake
        if (
          y === platform.base - platform.height ||
          (platform === lowest && y >= platform.base - platform.height)
        ) {
          landSnowflake(this, platform);
          this.reset();
          break;
        }
      }
    }
  }
};

// array of all the snowflakes on the screen
const snowflakes = [];

function newSnowFlake() {
  const flake = Object.create(SnowFlake);
  flake.create();

  // store it in the array
  snowflakes.push(flake);
}

function landSnowflake(flake, platform) {
  let x = platform.x;
  let y = platform.base - platform.height;

  platform.height++;

  // draw landed snowflake as a pixel
  const ctx = config.ctx;
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, 1, 1);
}

function initCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.width = config.maxX;
  canvas.height = config.maxY;

  // remember the context
  config.ctx = canvas.getContext("2d");
}

function initText() {
  const text = "December Snow";
  let fontsize = config.maxX / 10;
  let width = 0;
  while (width < config.maxX * 0.9) {
    config.ctx.font = "bold " + fontsize + "px serif";
    width = config.ctx.measureText(text).width;
    fontsize += 5;
  }

  config.ctx.fillStyle = "#964219";
  config.ctx.textBaseline = "top";
  config.ctx.textAlign = "center";
  config.ctx.fillText(text, config.maxX / 2, 280);
}

function initPlatforms() {
  allPlatforms = [];
  let canvasPixels = config.ctx.getImageData(0, 0, config.maxX, config.maxY);

  // loop throug every x value
  for (let x = 0; x < canvasPixels.width; x++) {
    let platforms = [];
    allPlatforms[x] = platforms;

    let inAPlatform = false;
    // loop through y value on this X
    for (let y = 0; y < canvasPixels.height; y++) {
      let index = 4 * (y * canvasPixels.width + x);

      let r = canvasPixels.data[index];
      let g = canvasPixels.data[index + 1];
      let b = canvasPixels.data[index + 2];
      let a = canvasPixels.data[index + 3];

      if (!inAPlatform && a > 50) {
        // non-transparent pixel at position x,y

        // add a new platform!
        platforms.push({ x: x, base: y, height: 0 });
        inAPlatform = true;
      } else if (inAPlatform && a < 10) {
        // transparent pixel!
        // no longer in a platform
        inAPlatform = false;
      }
    }
    // push the new platform to the array of platforms
    platforms.push({ x: x, base: config.maxY - 1, height: 0 });
  }
}

function findNeighbouringPlatforms() {
  for (let x = 0; x < allPlatforms.length; x++) {
    let platforms = allPlatforms[x];
    for (let i = 0; i < platforms.length; i++) {
      let platform = platforms[i];

      let smallestDistance = Number.MAX_SAFE_INTEGER;
      let possibleNeighbours = allPlatforms[x + 1];
      let closestNeighbour = null;
      if (possibleNeighbours) {
        for (let j = 0; j < possibleNeighbours.length; j++) {
          let neighbour = possibleNeighbours[j];
          let dist = Math.abs(platform.base - neighbour.base);

          // is smallest possible distance
          if (dist < smallestDistance) {
            smallestDistance = dist;
            closestNeighbour = neighbour;
          }
        }

        if (smallestDistance < 10) {
          platform.next = closestNeighbour;
          closestNeighbour.prev = platform;
        }
      }
    }
  }
}

function drawTree(id, size, xpos) {
  let image = document.querySelector("#" +id);

  let newHeight = size * config.maxY;
  let newWidth = image.width * newHeight / image.height;

  // draw it to the canvas
  config.ctx.drawImage(image,xpos,config.maxY-newHeight,newWidth,newHeight);
}

function initTrees() {
  // find the image
  drawTree("tree1", .5, 0);
  drawTree("tree2", .4, config.maxX * .25);
  drawTree("tree3", .3, config.maxX * .60);
  drawTree("tree1", .5, config.maxX * .8);
}

function init() {
  // create 1000 snowflakes
  for (let i = 0; i < 1000; i++) {
    newSnowFlake();
  }

  // init the canvas, and get the context
  initCanvas();

  // draw text
  initText();

  // draw trees
  initTrees();

  // analyze the image/text
  initPlatforms();

  // find neighbouring platforms
  findNeighbouringPlatforms();

  // start moving snowflakes
  animate();

  window.addEventListener("resize", resized);
}

let allPlatforms = [];

let last;

function avoidSpikes() {
  for (let x = 0; x < allPlatforms.length; x++) {
    let platforms = allPlatforms[x];
    for (let i = 0; i < platforms.length; i++) {
      let platform = platforms[i];

      let next = platform.next;
      let prev = platform.prev;

      if (platform.height > 2) {
        if (
          next &&
          platform.base - platform.height + 2 < next.base - next.height
        ) {
          // move a snowflake from platform to next
          config.ctx.clearRect(x, platform.base - platform.height, 1, 1);
          platform.height--;

          config.ctx.fillRect(x + 1, next.base - next.height, 1, 1);
          next.height++;
        }

        if (
          prev &&
          platform.base - platform.height + 1 < prev.base - prev.height
        ) {
          // move a snowflake from platform to prev
          config.ctx.clearRect(x, platform.base - platform.height, 1, 1);
          platform.height--;

          config.ctx.fillRect(x - 1, prev.base - prev.height, 1, 1);
          prev.height++;
        }
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  let now = Date.now() / 1000;
  let delta = now - (last || now);

  // go through all the snowflakes
  for (let i = 0; i < snowflakes.length; i++) {
    let flake = snowflakes[i];
    flake.move(delta);
    flake.show();
  }

  // avoid the spikes
  avoidSpikes();

  // remember when we last were called
  last = now;
}

window.addEventListener("load", init);
