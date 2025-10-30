console.log("started");

const defaultIntensity = 8;

const lText = localStorage.getItem("lText");
const lIntensity = localStorage.getItem("lIntensity") ?? defaultIntensity;

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

// ! currently unused
// TODO: add more punc. signs
/* const pre = ["(", "[", "{"];
const post = [".", ",", ":", ";", "-", ")", "}", "]", "\u2013", "\u2014"]; */

intensityInput.value = lIntensity ?? defaultIntensity;
intensityPercentage.innerText = intensityInput.value + "%";

resetBtn.addEventListener("click", () => {
    localStorage.setItem("lText", "");
    location.reload();
});
setIntensityBtn.addEventListener("click", () => {
    localStorage.setItem("lIntensity", intensityInput.value);
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

    let textArray = value.split(" ");

    for (const word of textArray) {
        const roll = Math.floor((Math.random() * 1) / (lIntensity / 100));
        if (roll !== 0) {
            const newE = document.createElement("span");
            newE.innerText = word;
            actualClozeArea.appendChild(newE);
        } else {
            const newE = document.createElement("input");
            newE.type = "text";
            newE.setAttribute("solution", word);
            actualClozeArea.appendChild(newE);
        }
    }
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
