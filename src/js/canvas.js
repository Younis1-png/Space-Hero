const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
import platformImg from "../img/platform.png";
import backgroundImg from "../img/background.png";
import hills from "../img/hills.png";
import smallPlatform from "../img/platformSmallTall.png";
import spriteRunLeft from "../img/spriteRunLeft.png";
import spriteStandLeft from "../img/spriteStandLeft.png";
import spriteRunRight from "../img/spriteRunRight.png";
import spriteStandRight from "../img/spriteStandRight.png";

// set the width/ height to the whole screen
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5; // make our player drop faster

// Our player class properties
class Player {
  constructor() {
    (this.speed = 10),
      (this.position = {
        x: 100,
        y: 100,
      }),
      (this.width = 66),
      (this.height = 150),
      (this.velocity = {
        //
        x: 0,
        y: 0,
      }),
      (this.image = createImage(spriteStandRight)),
      (this.frames = 0);
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875,
      },
    };

    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    // c.fillStyle = "red"; // set color to red
    // c.fillRect(this.position.x, this.position.y, this.width, this.height); // define our player
  }

  update() {
    this.frames++;
    if (
      (this.frames > 59 && this.currentSprite === this.sprites.stand.right) ||
      (this.frames > 59 && this.currentSprite === this.sprites.stand.left)
    ) {
      this.frames = 0;
    } else if (
      (this.frames > 29 && this.currentSprite === this.sprites.run.right) ||
      (this.frames > 29 && this.currentSprite === this.sprites.run.left)
    ) {
      this.frames = 0;
    }

    this.draw();
    this.position.y += this.velocity.y; // add our velocity y to our player over time
    // add our gravity, allows us to do it faster
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      // we want our payer to keep falling
      // this.velocity.y = 0;
    }
  }
}

// platform class
class Platform {
  constructor({ x, y, image }) {
    (this.position = {
      x: x,
      y: y,
    }),
      (this.image = image),
      (this.width = image.width),
      (this.height = image.height);
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

// Generic object class
class GenericObj {
  constructor({ x, y, image }) {
    (this.position = {
      x: x,
      y: y,
    }),
      (this.image = image),
      (this.width = image.width),
      (this.height = image.height);
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function createImage(imgSrc) {
  const image = new Image();
  image.src = imgSrc;
  return image;
}

let platformImage = createImage(platformImg);
let platformSmall = createImage(smallPlatform);

let player = new Player();

// no platform or object create until we call the function init
let platforms = [];
let genericObjects = [];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
};

let scrollOfSet = 0;
let lastKey;

// this will init all our initial values
function init() {
  platformImage = createImage(platformImg);

  player = new Player();

  platforms = [
    new Platform({
      x: platformImage.width * 4 + 320,
      y: 250,
      image: platformSmall,
    }),
    new Platform({
      x: platformImage.width * 8 + 320,
      y: 250,
      image: platformSmall,
    }),
    new Platform({
      x: platformImage.width * 9 + 320,
      y: 250,
      image: platformSmall,
    }),
    new Platform({ x: -1, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
    new Platform({
      x: platformImage.width * 2 + 150,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 3 + 300,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 5 + 300,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 6 + 300,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 7 + 300,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 10 + 300,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 11 + 300,
      y: 470,
      image: platformImage,
    }),
  ];

  genericObjects = [
    new GenericObj({
      x: -1,
      y: -1,
      image: createImage(backgroundImg),
    }),
    new GenericObj({
      x: -1,
      y: -1,
      image: createImage(hills),
    }),
  ];

  scrollOfSet = 0;
}

init();
// Animation function
function animate() {
  requestAnimationFrame(animate); // this is a function, we want to put the argument of function we want to loop
  c.fillStyle = " white";
  c.fillRect(0, 0, canvas.width, canvas.height); // (x, y, width, height )is clear our canvas and call our draw() right after it: The goal is to mintain our player shape

  genericObjects.forEach((genericObjects) => {
    genericObjects.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  // the reason why we have it here is because of the clearReact()
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOfSet === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    // move our platform at the same rate Left and right
    if (keys.right.pressed) {
      scrollOfSet += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });

      genericObjects.forEach((genericObjects) => {
        genericObjects.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOfSet > 0) {
      scrollOfSet -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObjects) => {
        genericObjects.position.x += player.speed * 0.66;
      });
    }
  }

  // Platform collision detection, make our play if it jup over the platform to stay on
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  //sprint conditional
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  }

  if (scrollOfSet > platformImage.width * 11 + 300) {
    // oue win condition
    console.log("You win");
  }

  // our lose condition and restart
  if (player.position.y > canvas.height) {
    console.log("You lose");
    init();
  }
}

animate();

// Event Listener
window.addEventListener("keydown", (event) => {
  console.log(event.keyCode);
  switch (event.keyCode) {
    case 65:
      // console.log("left");
      keys.left.pressed = true;

      // player.currentSprite = player.sprites.run.left;
      // player.currentCropWidth = player.sprites.run.cropWidth;
      // player.width = player.sprites.run.width;

      lastKey = "left";
      break;

    case 68:
      // console.log("right");
      keys.right.pressed = true;
      // player.currentSprite = player.sprites.run.right;
      // player.currentCropWidth = player.sprites.run.cropWidth;
      // player.width = player.sprites.run.width;

      lastKey = "right";
      break;

    case 87:
      console.log("up");
      //   keys.right.pressed = true;
      player.velocity.y -= 15;
      break;

    case 37:
      console.log("left");
      break;

    case 39:
      console.log("right");
      break;
  }
});

// Event Listener letting go of the key
window.addEventListener("keyup", (event) => {
  console.log(event.keyCode);
  switch (event.keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = false;
      player.currentSprite = player.sprites.stand.left;
      player.currentCropWidth = player.sprites.stand.cropWidth;
      player.width = player.sprites.stand.width;
      break;

    case 68:
      console.log("right");
      // player.velocity.x = 0
      keys.right.pressed = false;
      player.currentSprite = player.sprites.stand.right;
      player.currentCropWidth = player.sprites.stand.cropWidth;
      player.width = player.sprites.stand.width;
      break;

    case 87:
      console.log("up");
      player.velocity.y = 0;
      break;

    case 37:
      console.log("left");
      break;

    case 39:
      console.log("right");
      break;
  }
});
