let myFont;

let tgd, tga;
let backgroundFill;
let dimUp, dimCounter;
let rotationSpeed;
let btnPlus, btnMinus, btnSwitch;
let bDigital;

const BACKGR_LOWER_LIMIT = 50;
const BACKGR_UPPER_LIMIT = 100;

let lastTimeString = "";
let lastMinTimeHash = 0;
let lastSecTimeHash = 0;

//WebGL requires fonts to be preloaded
function preload() {
  myFont = loadFont("Inconsolata.otf");
}

function setup() {
  //Set up the basic canvas
  createCanvas(windowWidth, windowHeight, WEBGL);
  backgroundFill = BACKGR_LOWER_LIMIT;

  //Set up graphics for digital
  tgd = createGraphics(100, 100, WEBGL);
  tgd.textFont(myFont);
  tgd.textSize(26);
  tgd.textAlign(CENTER, CENTER);

  //Set up graphics for analogue
  tga = createGraphics(100, 100, WEBGL);
  tga.textFont(myFont);
  tga.textSize(10);
  tga.fill(212);
  tga.textAlign(CENTER, CENTER);

  //Set auxilliary variables
  dimUp = true;
  dimCounter = 0;
  rotationSpeed = 80;
  bDigital = false;

  //Set font for canvas needed for WebGL
  textFont(myFont);
  
  drawControls();
}

function btnPressedPlus(){
  //print("btn pressed");
  if (rotationSpeed < 300) rotationSpeed += 20;
}

function btnPressedMinus(){
  //print("btn pressed");
  if (rotationSpeed > 20) rotationSpeed -= 20;
}
function btnPressedSwitch(){
  //print("btn pressed");
  bDigital = !bDigital;
}

function drawControls() {
  btnPlus = createButton('+');
  btnPlus.position(20, 0);
  btnPlus.mousePressed(btnPressedPlus);
 
  btnMinus = createButton('-');
  btnMinus.position(0, 0);
  btnMinus.mousePressed(btnPressedMinus);

  btnPlus = createButton('A/D');
  btnPlus.position(50, 0);
  btnPlus.mousePressed(btnPressedSwitch);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function getTimeString() {
  let aMinute = "" + minute();
  if (aMinute.length < 2) aMinute = "0" + aMinute;
  let anHour = "" + hour();
  if (anHour.length < 2) anHour = "0" + anHour;

  return anHour + ":" + aMinute;
}

function getBackgroundColor() {
  if (dimCounter > 4) {
    dimCounter = 0;
    if (backgroundFill >= BACKGR_UPPER_LIMIT) dimUp = false;
    if (backgroundFill <= BACKGR_LOWER_LIMIT) dimUp = true;
    if (dimUp) backgroundFill += 1;
    else backgroundFill -= 1;
  } else {
    dimCounter += 1;
  }
  return backgroundFill;
}

function createSecTimeHash() {
  return second() + minute() * 100 + hour() * 10000;
}

function createMinTimeHash() {
  return minute() + hour() * 100;
}

function drawDigital() {
  let newMinTimeHash = createMinTimeHash();
  if (lastMinTimeHash == newMinTimeHash) {
    //No need to redraw digital
    return tgd;
  }
  lastMinTimeHash = newMinTimeHash;
  tgd.background(20, 40, 255);
  tgd.fill(212);
  tgd.text(getTimeString(), 0, 0);
  return tgd;
}

function getHrAngle() {
  //Timtalets andel av ett tolftedels varv plus minuternas påverkan. Justerat moturs med 90 grader så 12 kommer uppåt och inte till kl 3
  return radians((360 * (hour() % 12)) / 12 + (30 * minute()) / 60 - 90);
}

function getMinAngle() {
  return radians((360 * minute()) / 60 - 90);
}

function getSecAngle() {
  return radians((360 * second()) / 60 - 90);
}

function drawAnalogue() {
  let newTimeHash = createSecTimeHash();
  if (lastSecTimeHash == newTimeHash) {
    //No need to redraw clock image
    return tga;
  }

  lastSecTimeHash = newTimeHash;
  tga.background(20, 40, 225);

  //Center dot
  tga.ellipse(0, 0, 2);

  //Digits
  tga.fill(222);
  tga.stroke(222);
  tga.text("12", 0, -40);
  tga.text("3", 40, 0);
  tga.text("6", 0, 40);
  tga.text("9", -40, 0);

  //Hour hand
  let hh_length = 25;
  let hx = hh_length * cos(getHrAngle());
  let hy = hh_length * sin(getHrAngle());
  tga.fill(222);
  tga.stroke(200);
  tga.strokeWeight(2.5);
  tga.line(0, 0, hx, hy);

  //Minute hand
  let mh_length = 30;
  let mx = mh_length * cos(getMinAngle());
  let my = mh_length * sin(getMinAngle());
  tga.fill(222);
  tga.stroke(200);
  tga.strokeWeight(1.5);
  tga.line(0, 0, mx, my);

  //Second hand
  let sh_length = 35;
  let sx = sh_length * cos(getSecAngle());
  let sy = sh_length * sin(getSecAngle());
  tga.fill(220, 0, 0);
  tga.stroke(220, 0, 0);
  tga.strokeWeight(0.5);
  tga.line(0, 0, sx, sy);

  //Center peg
  tga.fill(90, 0, 0);
  tga.stroke(90, 0, 0);
  tga.strokeWeight(1.0);
  tga.ellipse(0, 0, 2);

  return tga;
}

function draw() {
  background(getBackgroundColor(), 0, 0);
  rotateY((frameCount / 10000) * rotationSpeed);
  rotateX((frameCount / 10000) * rotationSpeed);
  texture(bDigital ? drawDigital() : drawAnalogue());
  stroke(10, 20, 180);
  box(300, 300);
}

