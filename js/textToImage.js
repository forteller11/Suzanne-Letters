'use strict';

window.onload = main;
let textbox;
let imageContainer;
let currentCharacterDisplay;
let images = [];
let timeBetweenImages = 450;
let startOfAssciLowerCaseA = 97;
let lettersInAlphabet = 26;
let characters = [];
let FRAME_RATE = 16.7;
function main() {
  console.log("main");
  textbox = window.document.getElementById("textbox");
  imageContainer = window.document.getElementById("SuzanneImageContainer");
  currentCharacterDisplay = window.document.getElementById("currentCharacterDisplay");
textbox.placeholder = "Type words here then press \"enter\"";
  //TODO cycle through alphabet in forloop, get images, then display them in aniamtion

  for (let i = startOfAssciLowerCaseA; i < startOfAssciLowerCaseA + lettersInAlphabet; i++){
    let alphabet = String.fromCharCode(i);
    let image = new ImageClass(alphabet, 0);
    images[alphabet] = image;
  }
  let blankImage = new ImageClass('blank', 1);
  images['blank'] = blankImage;
  blankImage.makeFirstChild();

  textbox.addEventListener('keydown', (text) => {
    if (text.key === "Enter") {
      textbox.placeholder = "";
      window.clearTimeout(AnimateImages);
      AnimateImages(textbox.value);
      textbox.value = "";
    }
  })
}

function AnimateImages(text){
  if (text[0] === undefined)
    images['blank'].style.opacity = 1;

  for (let i = 0; i < text.length; i++){

    let correspondingImage;
    //if a punctuation or space, make the image a blank
    if ((text[i] === " ") ||
        (text[i] === ",") ||
        (text[i] === ".") ||
        (text[i] === ":") ||
        (text[i] === ";")){
      correspondingImage = images['blank'];
    } else {
      correspondingImage = images[text[i]]
    }

    if (correspondingImage === undefined)
      continue;

      characters.push(new CharacterClass(text[i]));
      characters[characters.length-1].fadeIn();

    if (correspondingImage === undefined){
      if (text.length <= 1){ //if unknown text at end, end with blank
        correspondingImage.alpha = 0;
        correspondingImage.fadeIn();
        return;
      }
        else{ //if unknown char in center of text, skip it
          continue;
        }
    }

    correspondingImage.alpha = 0;
    correspondingImage.makeFirstChild();
    correspondingImage.fadeIn();
    let newText = text.slice(i+1);

    if (newText.length > 0){
      window.setTimeout(
        AnimateImages,
        timeBetweenImages,
        newText);
    } else { //set to blank when no text left
      window.setTimeout( () => {
        images['blank'].makeFirstChild();
        images['blank'].alpha = 0;
        images['blank'].fadeIn();
        fadeOutAllText();
      },
    timeBetweenImages)
    }
    return;

  }
}


function IncreaseOpacityEachFrame(element, step){
  let opacityNumber = parseFloat(element.style.opacity);
  element.style.opacity = opacityNumber + step;
  opacityNumber = parseFloat(element.style.opacity);

  if  (opacityNumber < 0){
    element.parentElement.removeChild(element);
  }
  else if ((opacityNumber < 1) && (opacityNumber >= 0)){
    window.setTimeout(IncreaseOpacityEachFrame, FRAME_RATE, element, step);
  }
}

class ImageClass {
  constructor(imgName, alpha = 1) {
    let image = new Image();
    image.src = "images/letters/" + imgName + ".jpg";
    image.classList.add("opacityFade");
    image.style.opacity = alpha;
    image.style.position = "absolute";
    imageContainer.appendChild(image);
    image.height = 256;
    this.image = image;
  }

  get alpha() {
    return this._alpha;
  }

  set alpha(newAlpha) {
    this._alpha = parseFloat(newAlpha);
    this.image.style.opacity = newAlpha;
  }

  makeFirstChild() {
    let parent = this.image.parentElement;
    parent.removeChild(this.image);
    parent.appendChild(this.image);
  }

  fadeIn(alphaStep=0.3) {
    this.alpha += alphaStep;

    if (isBetweenInclusive(this.alpha,0,1)){
      window.requestAnimationFrame(() => {
        this.fadeIn(alphaStep)
      });
    }

    this.alpha = clamp01(this.alpha);
  }
}
class CharacterClass{
  constructor(charName, alpha=0){
    let char = charName;
    if (char === 'blank')
      char = " ";
    if ((charName === " ") ||
        (charName === ",") ||
        (charName === ".") ||
        (charName === ":") ||
        (charName === ";")){
      char = "";
    }
    var p = document.createElement("text");
    p.textContent = char;
    p.style.opacity = alpha;
    p.classList.add("currentCharacterDisplay");
    currentCharacterDisplay.appendChild(p);
    this.character = p;

    this.name = charName;
    this._alpha = alpha;
  }

  get alpha() {
    return this._alpha;
  }

  set alpha(newAlpha) {
    this._alpha = parseFloat(newAlpha);
    this.character.style.opacity = newAlpha;
  }

  fadeIn(alphaStep=0.05) {
    this.alpha += alphaStep;

    if (isBetweenInclusive(this.alpha,0,1)){
      window.requestAnimationFrame(() => {
        this.fadeIn(alphaStep)
      });

      if (this.alpha < 0){
        console.log(this.character.parentElement);
      this.character.parentElement.removeChild(this.character);
      characters.splice(4, 1, this);
    }
    }

    this.alpha = clamp01(this.alpha);
  }
}

function clamp01(value){
  if (value > 1) return 1;
  if (value < 0) return 0;
  return value;
}

function isBetweenInclusive(value, min,max){

  if ((value >= min) && (value <= max)) return true;
  return false;
}

function fadeOutAllText(){
  for (let i = 0; i < characters.length; i++){
    characters[i].fadeIn(-0.01);
  }
}
