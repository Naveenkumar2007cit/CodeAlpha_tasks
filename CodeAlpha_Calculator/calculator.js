const display = document.getElementById("display");
let lastAns = 0;
let isDeg = true;

function append(value) {
    display.value += value;
}

function trig(fn) {
    display.value += isDeg
        ? `Math.${fn}(Math.PI/180*`
        : `Math.${fn}(`;
}

function calculate() {
    try {
        lastAns = eval(display.value);
        display.value = lastAns;
    } catch {
        display.value = "Error";
    }
}

function recallAns() {
    display.value += lastAns;
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function clearAll() {
    display.value = "";
}

function toggleMode() {
    isDeg = !isDeg;
    alert(isDeg ? "DEG Mode" : "RAD Mode");
}
