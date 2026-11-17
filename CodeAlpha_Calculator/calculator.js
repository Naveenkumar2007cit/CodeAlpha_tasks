/**
 * Scientific Calculator Engine (fx-991MS Simulation)
 * Pure JavaScript with error recovery and Audio API feedback
 */

const exprDisplay = document.getElementById("exprDisplay");
const resultDisplay = document.getElementById("resultDisplay");
const degIndicator = document.getElementById("degIndicator");
const radIndicator = document.getElementById("radIndicator");
const mIndicator = document.getElementById("mIndicator");
const shiftIndicator = document.getElementById("shiftIndicator");
const muteBtn = document.getElementById("muteBtn");

let currentExpr = "";
let lastAns = 0;
let isDeg = true;
let isShift = false;
let isAlpha = false;
let memoryVal = 0;
let soundEnabled = true;

// Web Audio API synthesized click tone
let audioCtx = null;
function playClickSound() {
    if (!soundEnabled) return;
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
        // Fallback silently if audio context restricted
    }
}

function toggleMute() {
    soundEnabled = !soundEnabled;
    muteBtn.textContent = soundEnabled ? "🔊" : "🔇";
}

function updateDisplays() {
    exprDisplay.textContent = currentExpr || "0";
}

function inputChar(char) {
    playClickSound();
    if (resultDisplay.textContent && !currentExpr) {
        // Continue from last calculation if user pressed an operator
        if (['+', '−', '×', '÷'].includes(char)) {
            currentExpr = lastAns.toString();
        }
        resultDisplay.textContent = "";
    }
    currentExpr += char;
    updateDisplays();
}

function inputFunc(fnName) {
    playClickSound();
    if (fnName === 'sqrt') {
        currentExpr += "√(";
    } else if (fnName === 'log10') {
        currentExpr += "log(";
    } else if (fnName === 'ln') {
        currentExpr += "ln(";
    }
    updateDisplays();
}

function inputPow(type) {
    playClickSound();
    if (type === 2) {
        currentExpr += "^2";
    } else if (type === 'y') {
        currentExpr += "^";
    }
    updateDisplays();
}

function inputInverse() {
    playClickSound();
    currentExpr += "^(-1)";
    updateDisplays();
}

function inputTrig(fn) {
    playClickSound();
    currentExpr += `${fn}(`;
    updateDisplays();
}

function recallAns() {
    playClickSound();
    currentExpr += "Ans";
    updateDisplays();
}

function deleteChar() {
    playClickSound();
    if (currentExpr.length > 0) {
        if (currentExpr.endsWith("Ans")) {
            currentExpr = currentExpr.slice(0, -3);
        } else if (currentExpr.endsWith("sin(") || currentExpr.endsWith("cos(") || currentExpr.endsWith("tan(") || currentExpr.endsWith("log(")) {
            currentExpr = currentExpr.slice(0, -4);
        } else if (currentExpr.endsWith("ln(") || currentExpr.endsWith("√(")) {
            currentExpr = currentExpr.slice(0, -3);
        } else {
            currentExpr = currentExpr.slice(0, -1);
        }
    }
    updateDisplays();
}

function clearEntry() {
    playClickSound();
    currentExpr = "";
    resultDisplay.textContent = "";
    updateDisplays();
}

function resetCalculator() {
    playClickSound();
    currentExpr = "";
    lastAns = 0;
    resultDisplay.textContent = "0";
    setTimeout(() => {
        resultDisplay.textContent = "";
        updateDisplays();
    }, 400);
}

function toggleAngleMode() {
    playClickSound();
    isDeg = !isDeg;
    if (isDeg) {
        degIndicator.classList.add("active");
        radIndicator.classList.remove("active");
    } else {
        degIndicator.classList.remove("active");
        radIndicator.classList.add("active");
    }
}

function toggleShift() {
    playClickSound();
    isShift = !isShift;
    shiftIndicator.classList.toggle("active", isShift);
}

function toggleAlpha() {
    playClickSound();
    isAlpha = !isAlpha;
}

function sanitizeAndParse(expr) {
    let parsed = expr;

    // Substitute Ans
    parsed = parsed.replace(/Ans/g, `(${lastAns})`);

    // Substitute Pi
    parsed = parsed.replace(/π/g, `(${Math.PI})`);

    // Operators
    parsed = parsed.replace(/×/g, '*');
    parsed = parsed.replace(/÷/g, '/');
    parsed = parsed.replace(/−/g, '-');

    // Square root
    parsed = parsed.replace(/√\(/g, 'Math.sqrt(');

    // Powers e.g. a^b -> Math.pow(a, b) or ES2016 **
    parsed = parsed.replace(/\^/g, '**');

    // Logs
    parsed = parsed.replace(/log\(/g, 'Math.log10(');
    parsed = parsed.replace(/ln\(/g, 'Math.log(');

    // Trigonometry with DEG / RAD conversion
    if (isDeg) {
        parsed = parsed.replace(/sin\(/g, 'Math.sin((Math.PI/180)*');
        parsed = parsed.replace(/cos\(/g, 'Math.cos((Math.PI/180)*');
        parsed = parsed.replace(/tan\(/g, 'Math.tan((Math.PI/180)*');
    } else {
        parsed = parsed.replace(/sin\(/g, 'Math.sin(');
        parsed = parsed.replace(/cos\(/g, 'Math.cos(');
        parsed = parsed.replace(/tan\(/g, 'Math.tan(');
    }

    return parsed;
}

function executeCalculation() {
    playClickSound();
    if (!currentExpr) return;

    try {
        const parsed = sanitizeAndParse(currentExpr);
        
        // Auto-close missing parentheses
        const openParens = (parsed.match(/\(/g) || []).length;
        const closeParens = (parsed.match(/\)/g) || []).length;
        let balanced = parsed;
        if (openParens > closeParens) {
            balanced += ')'.repeat(openParens - closeParens);
        }

        // Safe evaluation
        const evaluated = Function(`"use strict"; return (${balanced});`)();

        if (Number.isFinite(evaluated)) {
            // Round floating precision anomalies
            let formatted = parseFloat(evaluated.toFixed(10)).toString();
            lastAns = evaluated;
            resultDisplay.textContent = "= " + formatted;
            currentExpr = "";
        } else {
            resultDisplay.textContent = "Math ERROR";
        }
    } catch (err) {
        resultDisplay.textContent = "Syntax ERROR";
    }
}

// Physical Keyboard Support
document.addEventListener("keydown", (e) => {
    if (['0','1','2','3','4','5','6','7','8','9','.'].includes(e.key)) {
        inputChar(e.key);
    } else if (e.key === '+') {
        inputChar('+');
    } else if (e.key === '-') {
        inputChar('−');
    } else if (e.key === '*') {
        inputChar('×');
    } else if (e.key === '/') {
        e.preventDefault();
        inputChar('÷');
    } else if (e.key === '(' || e.key === ')') {
        inputChar(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        executeCalculation();
    } else if (e.key === 'Backspace') {
        deleteChar();
    } else if (e.key === 'Escape') {
        clearEntry();
    }
});
