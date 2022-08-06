const $ = document;
const searchInput = $.querySelector("input");
const searchBtn = $.querySelector("button");

let audioSrc = null;
let defaultWord = "Hello";

function sendRequest(wordToSearch) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToSearch}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        alert(
          `Operation Unsuccessful :/ \nResponse Status Code : ${res.status}`
        );
        throw new Error(
          `Operation Unsuccessful :/ \nResponse Status Code : ${res.status}`
        );
      }
    })
    .then((data) => updateDOM(data));
}
function updateDOM(data) {
  console.log(data);
  const titleElem = $.querySelector(".searched");
  const phoneticElem = $.querySelector(".phonetic");
  const definitionsContainer = $.querySelector(".definitions");
  titleElem.textContent = data[0].word;
  phoneticElem.textContent = data[0].phonetic || data[0].phonetics[1].text;
  definitionsContainer.innerHTML = "";
  setSrc(data[0].phonetics);

  data[0].meanings.forEach((meaning) => {
    definitionsContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="definition">
    <span class="part_of_speech">${meaning.partOfSpeech}</span>
    <p class="des">
 ${meaning.definitions
   .map((definitionObj) => {
     return definitionObj.definition;
   })
   .join(" / ")}
    </p>
  </div>`
    );
  });
  setDefaultSearchWord(data[0].word);
}
function setSrc(phonetics) {
  phonetics.forEach((phoneticObj) => {
    if (phoneticObj.audio) {
      audioSrc = phoneticObj.audio;
    }
  });
}
function playAudio() {
  const audioElem = $.querySelector("audio");
  audioElem.src = audioSrc;
  audioElem.play();
}
function setDefaultSearchWord(word) {
  localStorage.setItem("defaultWord", word);
}
function getDefaultSearchWord() {
  const defualtWordLocal = localStorage.getItem("defaultWord");
  if (defualtWordLocal) {
    defaultWord = defualtWordLocal;
  }
}
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendRequest(searchInput.value.toLowerCase());
  }
});
searchBtn.addEventListener("click", () =>
  sendRequest(searchInput.value.toLowerCase())
);
window.addEventListener("load", getDefaultSearchWord);
window.addEventListener("load", () => sendRequest(defaultWord));
