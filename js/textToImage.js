'use strict';

window.onload = main;
let textbox;
let imageContainer;
let currentCharacterDisplay;
let images = [];
let timeBetweenImages = 650;
let startOfAssciLowerCaseA = 97;
let lettersInAlphabet = 26;
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
    imageFromName(alphabet);
  }
  imageFromName('blank').style.opacity = 1;

  textbox.addEventListener('keydown', (text) => {
    if (text.key === "Enter") {
      textbox.placeholder = "";
      window.clearTimeout(AnimateImages);
      // for (let i = 0; i < currentCharacterDisplay.children.length; i ++){
      //   currentCharacterDisplay.removeChild(currentCharacterDisplay.children[i]);
      // }
      AnimateImages(textbox.value);
      textbox.value = "";
    }
  })
}

function MakeAllImagesTransparent(){
  for (let i = startOfAssciLowerCaseA; i < startOfAssciLowerCaseA + lettersInAlphabet; i++){
    images[String.fromCharCode(i)].style.opacity = 0;
  }
  images['blank'].style.opacity = 0;
}
function AnimateImages(text){
  MakeAllImagesTransparent();
  console.log(text);
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

    if (correspondingImage === null)
      continue;

    if (correspondingImage === undefined){
      if (text.length <= 1){ //if unknown text at end, end with blank
        images['blank'].style.opacity = 1;
        return;
      }
        else{ //if unknown char in center of text, skip it
          continue;
        }
    }

    correspondingImage.style.opacity = 1;
    DisplayTextImage(text[i]);
    let newText = text.slice(i+1);

    console.log("newtext "+newText);
    if (newText.length > 0){
      window.setTimeout(
        AnimateImages,
        timeBetweenImages,
        newText);
    } else { //set to blank when no text left
      window.setTimeout( () => {
        MakeAllImagesTransparent();
        images['blank'].style.opacity = 1;
        for (let i = 0; i < currentCharacterDisplay.children.length; i ++){
          let p = currentCharacterDisplay.children[i];
          window.setTimeout(IncreaseOpacityEachFrame, FRAME_RATE, p, -0.03)
        }
      },
    timeBetweenImages)
    }
    return;

  }
}

function DisplayTextImage(char){
  var p = document.createElement("text");
  p.style.color = "black";
  p.textContent = char;
  p.style.opacity = 0;
  p.classList.add("currentCharacterDisplay");
  currentCharacterDisplay.appendChild(p);
  window.setTimeout(IncreaseOpacityEachFrame, FRAME_RATE, p, 0.03);
}
function imageFromName(imgName){
  let image = new Image();
  image.src = "images/letters/" + imgName + ".jpg";
  image.classList.add("opacityFade");
  image.style.opacity = 0;
  image.style.position = "absolute";
  imageContainer.appendChild(image);
  image.height = 256;
  images[imgName] = image;
  return image;
}

function IncreaseOpacityEachFrame(element, step){
  let opacityNumber = parseFloat(element.style.opacity);
  element.style.opacity = opacityNumber + step;
  opacityNumber = parseFloat(element.style.opacity);
  if ((opacityNumber < 1) && (opacityNumber >= 0))
    window.setTimeout(IncreaseOpacityEachFrame, FRAME_RATE, element, step);
  else if  (opacityNumber < 0){
    element.parentElement.removeChild(element);
    //removeElement(element);
  }
}
