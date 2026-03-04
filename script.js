const words = document.querySelectorAll(".word");
const popup = document.getElementById("popup");
const popupWord = document.getElementById("popup-word");
const popupMeaning = document.getElementById("popup-meaning");
const popupMl = document.getElementById("popup-ml");
const popupDef = document.getElementById("popup-def");
const progressBar = document.getElementById("progress");
const quizBtn = document.getElementById("quizBtn");

const storyId = document.body.dataset.story;
updateProgress();

words.forEach(word => {
    word.addEventListener("click", () => {
        word.classList.add("active");
        setTimeout(()=> word.classList.remove("active"),800);

        const speech = new SpeechSynthesisUtterance(word.textContent);
        speech.lang = "de-DE";
        window.speechSynthesis.speak(speech);

        popupWord.textContent = word.textContent;
        popupMeaning.textContent = word.dataset.meaning;
        popupMl.textContent = word.dataset.ml;
        popupDef.textContent = word.dataset.def;
        popup.style.display = "block";

        const rect = word.getBoundingClientRect();
        popup.style.top = window.scrollY + rect.bottom + 10 + "px";
        popup.style.left = window.scrollX + rect.left + "px";
    });
});

document.addEventListener("click", e => { if(!e.target.classList.contains("word")) popup.style.display="none"; });

function updateProgress(){
    const percentage = 0;
    progressBar.style.width = percentage + "%";
}

quizBtn.addEventListener("click", ()=>{
    const randomWord = words[Math.floor(Math.random()*words.length)];
    const answer = prompt("What is the meaning of: "+randomWord.textContent+"?");
    if(answer && answer.toLowerCase()===randomWord.dataset.meaning.toLowerCase()){ alert("Correct!"); }
    else { alert("Correct answer: "+randomWord.dataset.meaning); }
});