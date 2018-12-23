const Star = {
  ypos: 0,
  xpos: 0,
  element: null,
  size: 0,
  create() {
    // create div.snowflake and add it to the #nightsky
    let element = document.createElement("div");
    element.classList.add("star");
    document.querySelector("#stars").appendChild(element);
    this.element = element;

    this.reset();
  },
  reset() {
    this.xpos = Math.random() * config.maxX;
    this.ypos = Math.random() * config.maxY * 0.2;

    this.size = Math.random();
    this.rotation = Math.random() * 360;

    this.element.classList.remove("star");
    this.element.offsetHeight;
    this.element.classList.add("star");

    // reset self after 3 seconds
    setTimeout(resetMe, 3000 + Math.floor(Math.random() * 3000));

    const thisStar = this;

    function resetMe() {
      thisStar.reset();
    }
  },
  show() {
    this.element.style.top = this.ypos + "px";
    this.element.style.left = this.xpos + "px";

    this.element.style.transform =
      "scale(" + this.size + ") rotate(" + this.rotation + "deg)";
  },
  move(delta) {
    //
    this.rotation += 30 * delta;
  }
};

const stars = [];

function newStar() {
  const star = Object.create(Star);
  star.create();

  // store it in the array
  stars.push(star);
}
