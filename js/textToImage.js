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

  for (let i = startOfAssciLowerCaseA; i < startOfAssciLowerCaseA + lettersInAlphabet; i++) {
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
      AnimateImages(new InputText(textbox.value));
      textbox.value = "";
    }
  })
}
class InputText {
  constructor(string) {
    this._text = string;
    this._index = 0;
    this.previousImageKey = undefined;
    this.currentImageKey = this.calculateImageKeyFromCharacter(this.currentCharacter);
  }


  get previousCharacter() {
    if (this._index === 0)
      return undefined;
    return this._text[this._index - 1];
  }
  get currentCharacter() {
    if (this.pastEndOfText())
      return undefined;
    return this._text[this._index];
  }

  pastEndOfText() {
    if (this._index >= this._text.length)
      return true;
    return false;
  }

  incrementCharacter() {
    this._index++;
    this.previousImageKey = this.currentImageKey;
    this.currentImageKey = this.calculateImageKeyFromCharacter(this.currentCharacter);
  }

  calculateImageKeyFromCharacter(char){
    if ((InputText.isAlphabet(char) === false) || (this.pastEndOfText()) )
      return 'blank';
    else
      return char;
  }

  static isPunctuation(char) {
    if ((char === " ") ||
      (char === ",") ||
      (char === ".") ||
      (char === ":") ||
      (char === ";"))
      return true;
    else return false;
  }

  static isAlphabet(char) {
    for (let i = 97; i < 97 + 26; i++) {
      if (char === String.fromCharCode(i))
        return true;
    }
    return false;
  }
}

function AnimateImages(input) {

  while (
    (InputText.isAlphabet(input.currentCharacter) === false) &&
    (InputText.isPunctuation(input.currentCharacter) === false) &&
    (input.pastEndOfText(input.currentCharacter) === false)) {
    input.incrementCharacter();
    AnimateImages(input);
    return;
  }

  characters.push(new CharacterClass(input.currentCharacter));
  characters[characters.length - 1].fadeIn();

  let correspondingImage = images[input.currentImageKey];

  if (!(input.currentImageKey === input.previousImageKey)){
    correspondingImage.alpha = 0;
    correspondingImage.makeFirstChild();
    correspondingImage.fadeIn();
  }

  if (input.pastEndOfText() === false) {
    input.incrementCharacter();
    window.setTimeout(
     AnimateImages,
     timeBetweenImages,
     input);
  };

  if (input.pastEndOfText()){
    window.setTimeout(fadeOutAllText, timeBetweenImages);
    //prune array
    for (let i = 0; i < characters.length; i++) {
      if (characters[i].character === null)
        characters.splice(i,1);
    }
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

  fadeIn(alphaStep = 0.3) {
    this.alpha += alphaStep;

    if (isBetweenInclusive(this.alpha, 0, 1)) {
      window.requestAnimationFrame(() => {
        this.fadeIn(alphaStep)
      });
    }

    this.alpha = clamp01(this.alpha);
  }
}
class CharacterClass {
  constructor(charName, alpha = 0) {
    let char = charName;
    if (char === undefined)
      char = "";

    let p = document.createElement("text");
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
  this._alpha = newAlpha;
  if (!(this.character === null))
    this.character.style.opacity = newAlpha;
}

fadeIn(alphaStep = 0.06) {
  this.alpha += alphaStep;

  if ((this.alpha < 0) && (!(this.character === null))) {
    let parent = this.character.parentElement;
    this.character.remove();
    this.character = null;
  }

  if (isBetweenInclusive(this.alpha, 0, 1)) {
    window.requestAnimationFrame(() => {
      this.fadeIn(alphaStep)
    });

  }

  this.alpha = clamp01(this.alpha);
}
}

function clamp01(value) {
  if (value > 1) return 1;
  if (value < 0) return 0;
  return value;
}

function isBetweenInclusive(value, min, max) {

  if ((value >= min) && (value <= max)) return true;
  return false;
}

function fadeOutAllText() {
  for (let i = 0; i < characters.length; i++) {
    characters[i].fadeIn(-0.01);
  }
}
