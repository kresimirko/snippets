console.log("started");

const lText = localStorage.getItem("lText");
const lIntensity = localStorage.getItem("lIntensity") ?? 50;

const resetBtn = document.getElementById("resetBtn");
const setIntensityBtn = document.getElementById("setIntensityBtn");
const intensityInput = document.getElementById("intensityInput");
const intensityPercentage = document.getElementById("intensityPercentage");
const textEnterConfirm = document.getElementById("textEnterConfirm");
const textEnterArea = document.getElementById("textEnterArea");
const enterContainer = document.getElementById("enterContainer");
const clozeContainer = document.getElementById("clozeContainer");
const clozeFinishBtn = document.getElementById("clozeFinishBtn");
const counterE = document.getElementById("counter");

// TODO: add more punc. signs
/* const pre = ["(", "[", "{"];
const post = [".", ",", ":", ";", "-", ")", "}", "]", "\u2013", "\u2014"]; */

intensityInput.value = lIntensity ?? 10;
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
    clozeFinishBtn.style.display = "";

    let textArray = value.split(" ");

    for (const word of textArray) {
        const roll = Math.floor((Math.random() * 1) / (lIntensity / 100));
        if (roll !== 0) {
            const newE = document.createElement("span");
            newE.innerText = word;
            clozeContainer.appendChild(newE);
        } else {
            const newE = document.createElement("input");
            newE.type = "text";
            newE.setAttribute("solution", word);
            clozeContainer.appendChild(newE);
            /* if (pre.includes(word[0])) {
                const sign = document.createElement("span");
                sign.innerText = word[0];
                clozeContainer.appendChild(sign);
            }
            if (post.includes(word[word.length - 1])) {
                const sign = document.createElement("span");
                sign.innerText = word[word.length - 1];
                clozeContainer.appendChild(sign);
            } */
        }
    }
}

function finish() {
    const children = clozeContainer.getElementsByTagName("input");
    let counter = 0;
    for (const child of children) {
        if (child.type === "text") {
            if (child.value === child.getAttribute("solution")) {
                child.style.backgroundColor = "darkgreen";
                counter++;
            } else if (child.value === "") {
                child.style.backgroundColor = "darkorange";
            } else {
                child.style.backgroundColor = "darkred";
            }
        }
    }
    counterE.innerText = "Correct count: " + counter;
    counterE.style.display = "";
}
