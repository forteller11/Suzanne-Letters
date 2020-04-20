'use strict';

window.onload = main;
let textbox;
let imageContainer;
let images = [];
let timeBetweenImages = 400;
let startOfAssciLowerCaseA = 97;
let lettersInAlphabet = 26;
function main() {
  console.log("main");
  textbox = window.document.getElementById("textbox");
  imageContainer = window.document.getElementById("SuzanneImageContainer")

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
    if (text[i] === " "){
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

    console.log(correspondingImage);

    correspondingImage.style.opacity = 1;
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
      },
    timeBetweenImages)
    }
    return;

  }
}

function imageFromName(imgName){
  let image = new Image();
  image.src = "images/letters/" + imgName + ".jpg";
  image.classList.add("opacityFade");
  console.log(image.src);
  image.style.opacity = 0;
  image.style.position = "absolute";
  imageContainer.appendChild(image);
  image.height = 256;
  images[imgName] = image;
  return image;
}
