import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

console.log("started");

const defaultIntensity = 8;
const defaultIgnoreHeadings = true;

const lText = localStorage.getItem("lText");
const lIntensity = localStorage.getItem("lIntensity") ?? defaultIntensity;
const lIgnoreHeadings = localStorage.getItem("lIgnoreHeadings") ?? defaultIgnoreHeadings;

const actualClozeArea = document.getElementById("actualClozeArea");
const resetBtn = document.getElementById("resetBtn");
const setIntensityBtn = document.getElementById("setIntensityBtn");
const intensityInput = document.getElementById("intensityInput");
const intensityPercentage = document.getElementById("intensityPercentage");
const textEnterConfirm = document.getElementById("textEnterConfirm");
const textEnterArea = document.getElementById("textEnterArea");
const enterContainer = document.getElementById("enterContainer");
const clozeContainer = document.getElementById("clozeContainer");
const clozeFinishBtn = document.getElementById("clozeFinishBtn");
const clozeShowBtn = document.getElementById("clozeShowBtn");
const clozeClearBtn = document.getElementById("clozeClearBtn");
const counterE = document.getElementById("counter");
const ignoreHeadingsCheckbox = document.getElementById("ignoreHeadings");

// ! currently unused
// TODO: add more punc. signs
/* const pre = ["(", "[", "{"];
const post = [".", ",", ":", ";", "-", ")", "}", "]", "\u2013", "\u2014"]; */

const an = "1234567890abcdefghijklmnopqrstuvwxyzšđčćž".split("");

intensityInput.value = lIntensity;
intensityPercentage.innerText = intensityInput.value + "%";
ignoreHeadingsCheckbox.checked = lIgnoreHeadings === "true";

resetBtn.addEventListener("click", () => {
    localStorage.setItem("lText", "");
    location.reload();
});
setIntensityBtn.addEventListener("click", () => {
    localStorage.setItem("lIntensity", intensityInput.value);
    location.reload();
});
ignoreHeadingsCheckbox.addEventListener("click", () => {
    console.log(ignoreHeadingsCheckbox.checked);
    localStorage.setItem("lIgnoreHeadings", ignoreHeadingsCheckbox.checked);
    location.reload();
});
clozeFinishBtn.addEventListener("click", finish);
clozeShowBtn.addEventListener("click", show);
clozeClearBtn.addEventListener("click", clear);

if (!lText) {
    textEnterConfirm.addEventListener("click", () => {
        const value = textEnterArea.value;
        if (value) {
            localStorage.setItem("lText", value);
            begin(value);
        }
    });
} else {
    begin(lText);
}

function begin(value) {
    enterContainer.style.display = "none";
    clozeContainer.style.display = "";

    let charArray = value.split("");

    let currentCharIsAlNum = false;
    let isInHeading = false;
    let fullMd = "";
    let nextWord = "";
    for (const char of charArray) {
        if (char === "#")
            isInHeading = true;
        if (char === "\n")
            isInHeading = false;
        if (isInHeading && ignoreHeadingsCheckbox.checked) {
            fullMd += char;
            continue;
        }
        
        currentCharIsAlNum = an.includes(char.toLowerCase());

        if (!currentCharIsAlNum) {
            if (nextWord.length > 0) {
                const roll = Math.floor((Math.random() * 1) / (lIntensity / 100));
                if (roll === 0)
                    fullMd += `<input type="text" solution="${nextWord}" />`;
                else
                    fullMd += nextWord;
            }
            nextWord = "";
            fullMd += char;
            continue;
        }

        nextWord += char;
    }

    console.log(fullMd);
    const parsed = marked.parse(fullMd);
    actualClozeArea.innerHTML = parsed;
}

function finish() {
    const children = actualClozeArea.getElementsByTagName("input");
    let counter = 0;
    for (const child of children) {
        if (child.value === child.getAttribute("solution")) {
            child.style.backgroundColor = "darkgreen";
            counter++;
        } else if (child.value === "") {
            child.style.backgroundColor = "darkorange";
        } else {
            child.style.backgroundColor = "darkred";
        }
    }
    counterE.innerText = "Correct count: " + counter + "/" + children.length;
    counterE.style.display = "";
}

function show() {
    const children = actualClozeArea.getElementsByTagName("input");
    for (const child of children)
        child.value = child.getAttribute("solution");
}

function clear() {
    const children = actualClozeArea.getElementsByTagName("input");
    for (const child of children)
        child.value = "";
}
