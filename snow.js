// configuration object
const config = {
  ctx: null,
  maxX: document.querySelector("#nightsky").clientWidth,
  maxY: document.querySelector("#nightsky").clientHeight,
  minSpeed: 10,
  maxSpeed: 100,
  windSpeed: 50
};

/** Called on every resize - calculates the X and Y ratio, moves the
    snowflakes, re-inits the canvas, calculates new platforms, and
    moves the landed snow to the new platforms */
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

  // remember oldPlatforms
  const oldPlatforms = allPlatforms.slice();

  initPlatforms();
  findNeighbouringPlatforms();

  // recreate snow from old platforms onto the new
  recreateSnow(oldPlatforms, ratioX, ratioY);
  redrawSnow();
}

/** Re-creates the snow from the oldPlatforms on the new platforms -
    as precisely as possible ... */
function recreateSnow(oldPlatforms, ratioX, ratioY) {
  for (let x = 0; x < allPlatforms.length; x++) {
    // find the matching old x
    let oldX = Math.floor(x / ratioX);

    //console.log("new x %d - old x %d", x, oldX);
    let platforms = allPlatforms[x];
    let oPlatforms = oldPlatforms[oldX];

    // loop through all the new platforms
    for (let i = 0; i < platforms.length; i++) {
      // for each one, find the closest matching old platform
      let platform = platforms[i];

      let approxY = platform.base / ratioY;
      let closest = null;
      let smallestDist = Number.MAX_SAFE_INTEGER;
      for (let j = 0; j < oPlatforms.length; j++) {
        let oPlatform = oPlatforms[j];
        let dist = Math.abs(approxY - oPlatform.base);
        if (dist < smallestDist) {
          smallestDist = dist;
          closest = oPlatform;
        }
      }

      // If there was a closest (don't see how not ... )
      // add snow to it
      if (closest) {
        platform.height += Math.floor(closest.height / ratioY);
      }
    }
  }
}

/** avoids spikes on every animation, by moving landed snowflakes to
    either right or left neighbour, if possible. */
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

/** analyze the platforms to find the neighbours used by avoidSpikes */
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

/** redraws all the snowflakes on every platform */
function redrawSnow() {
  config.ctx.fillStyle = "white";

  for (let x = 0; x < allPlatforms.length; x++) {
    const platforms = allPlatforms[x];
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];

      config.ctx.fillRect(
        x,
        platform.base - platform.height,
        1,
        platform.height
      );
    }
  }
}

/** drops 5-10 snowflakes on every platform - not used, but nice for testing */
function dropRandomSnow(minimum = 5) {
  for (let x = 0; x < allPlatforms.length; x++) {
    const platforms = allPlatforms[x];
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];

      platform.height += Math.floor(Math.random() * 5) + minimum;
    }
  }
}

/** Prototype SnowFlake */
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

/** create a new snowflake, and adds it to the array - kind of a constructor */
function newSnowFlake() {
  const flake = Object.create(SnowFlake);
  flake.create();

  // store it in the array
  snowflakes.push(flake);
}

/** land a snowflake on a platform */
function landSnowflake(flake, platform) {
  let x = platform.x;
  let y = platform.base - platform.height;

  platform.height++;

  // draw landed snowflake as a pixel
  const ctx = config.ctx;
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, 1, 1);
}

/** init the canvas for drawing landed snow, text and trees */
function initCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.width = config.maxX;
  canvas.height = config.maxY;

  // remember the context
  config.ctx = canvas.getContext("2d");
}

/** init the text on the canvas - adapts to the size of the screen */
function initText() {
  const text = "December Snow";
  let fontsize = config.maxX / 10;
  let width = 0;
  // try to get the width of the text to be 90% of the width of the screen
  while (width < config.maxX * 0.9) {
    config.ctx.font = "bold " + fontsize + "px serif";
    width = config.ctx.measureText(text).width;
    fontsize += 5;
  }

  config.ctx.fillStyle = "#964219";
  config.ctx.textBaseline = "top";
  config.ctx.textAlign = "center";
  config.ctx.fillText(text, config.maxX / 2, config.maxY * 0.2);
}

/** analyse the canvas, and create platforms for the snow to land on */
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

/** draw trees on the canvas - that the snow can also land on */
function initTrees() {
  // draw a single tree at the bottom of the scene
  function drawTree(id, size, xpos) {
    let image = document.querySelector("#" + id);

    let newHeight = size * config.maxY;
    let newWidth = (image.width * newHeight) / image.height;

    // draw it to the canvas
    config.ctx.drawImage(
      image,
      xpos,
      config.maxY - newHeight,
      newWidth,
      newHeight
    );
  }

  // draw "random" trees on the scene - be artistic!
  drawTree("tree1", 0.5, 0);
  drawTree("tree2", 0.4, config.maxX * 0.25);
  drawTree("tree3", 0.3, config.maxX * 0.6);
  drawTree("tree1", 0.5, config.maxX * 0.8);
}

/** initialize the entire snowyscene with snowflakes, trees, and stars */
function init() {
  // create 1000 snowflakes
  for (let i = 0; i < 1000; i++) {
    newSnowFlake();
  }

  // create 5 stars
  for (let j = 0; j < 5; j++) {
    newStar();
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

  // go through all the stars - defined in stars.js
  for (let j = 0; j < stars.length; j++) {
    let star = stars[j];
    star.move(delta);
    star.show();
  }

  // avoid the spikes
  avoidSpikes();

  // remember when we last were called
  last = now;
}

window.addEventListener("load", init);
