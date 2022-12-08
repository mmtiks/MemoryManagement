// https://stackoverflow.com/questions/57550082/creating-a-16x16-grid-using-javascript
// VARIABLES
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl";
if (document.getElementById("container") == null)
    throw new Error("no container element");
var container = document.getElementById("container");
var arr = [];
var letters = [];
var fragmentedArea = 0;
var totalArea = 0;
var fragmentedNumber = 0;
var totalNumber = 0;
var fragArray = [];
var normArray = [];
var sizes = [];
var state = [];
var states = [];
// VISUALIZATION
function makeRows(rows, cols, states) {
    if (container == null)
        throw new Error("No container");
    container.style.setProperty("--grid-rows", rows);
    container.style.setProperty("--grid-cols", cols);
    var cell = document.createElement("div");
    cell.innerText = "";
    container.appendChild(cell).className = "info-item";
    var k = 1;
    for (k; k < cols; k++) {
        var cell_1 = document.createElement("div");
        cell_1.innerText = k;
        container.appendChild(cell_1).className = "info-item";
    }
    var colors = [
        "#0CF574",
        "deepskyblue",
        "#D7EBBA",
        "#A5FFD6",
        "#C33149",
        "#C29979",
        "#EC4E20",
        "#E0FF4F",
        "#FF9505",
        "#EEB1D5",
    ];
    for (var r = 1; r <= rows; r++) {
        var state_1 = states[r - 1];
        cell = document.createElement("div");
        cell.innerText = "Samm : " + r;
        container.appendChild(cell).className = "info-item";
        for (var c = 0; c < cols - 1; c++) {
            var cell_2 = document.createElement("div");
            cell_2.style.backgroundColor = colors[alphabet.indexOf(state_1[c])];
            cell_2.innerText = state_1[c];
            container.appendChild(cell_2).className = "grid-item";
        }
    }
}
function loadProcesses(arr) {
    var val = document.querySelector('input[name="patterns"]:checked');
    if (val == null)
        throw new Error("none checked");
    var str = val.value;
    var input = str == "numbers4"
        ? document.getElementById(str).value
        : document.getElementById(str).innerHTML;
    if (input == null)
        throw new Error("input is null");
    arr = input.split(";");
    return arr;
}
function clean() {
    if (container == null)
        throw new Error("missing container");
    container.innerHTML = "";
    var failed = document.getElementById("failed");
    if (failed == null)
        throw new Error("no fail statement");
    failed.innerHTML = "";
    letters = [];
    sizes = [];
    states = [];
    state = [];
}
function message(msg) {
    var failed = document.getElementById("failed");
    if (failed == null)
        throw new Error("no fail statement");
    failed.innerHTML = msg;
}
function start() {
    fragArray = [];
    fragmentedArea = 0;
    totalArea = 0;
    fragmentedNumber = 0;
    totalNumber = 0;
    if (container == null)
        throw new Error("no container");
    clean();
    arr = loadProcesses(arr);
    arr.forEach(function (element) {
        letters.push(element.split(",")[0]);
        sizes.push(element.split(",")[1]);
    });
    for (var i = 0; i < 48; i++) {
        state[i] = "-";
    }
    for (var i = 0; i < 10; i++) {
        if (i < letters.length) {
            var letter = letters[i];
            var size = sizes[i];
            if (size[0] == '-')
                remove(state, letter);
            else if (size[0] == '+')
                add(state, letter, size.substring(1));
            else
                add(state, letter, size);
        }
        states.push(structuredClone(state));
    }
    if (states.length < letters.length) {
        message(states.length);
    }
    else {
        fragmentedStats(state);
        var numF = Math.round(1000 * fragmentedNumber / totalNumber) / 10;
        var areaF = Math.round(1000 * fragmentedArea / totalArea) / 10;
        message("Allesjäänud failidest on fragmenteerunud " + numF + "%. Fragmenteerunud failidele kuulub " + areaF + "% kasutatud ruumist.");
    }
    container.innerHTML = "";
    makeRows(states.length, 48, states);
}
function add(state, letter, size) {
    for (var i = 0; i < state.length; i++) {
        if (state[i] == "-") {
            if (size <= 0)
                break;
            state[i] = letter;
            size--;
        }
    }
    return state;
}
function remove(state, letter) {
    var holder = 0;
    for (var i = 0; i < state.length; i++) {
        if (state[i] == letter) {
            state[i] = "-";
            holder++;
        }
    }
    return state;
}
function fragmentedStats(state) {
    var data = {};
    data[state[0]] = [1, false];
    var index;
    for (var i = 1; i < state.length; i++) {
        var letter = state[i];
        if (letter != "-") {
            index = Object.keys(data).indexOf(letter);
            if (index == -1) {
                data[letter] = [1, false];
            }
            else {
                var n = data[letter][0];
                if (!data[letter][1]) {
                    if (state[i - 1] != letter) {
                        data[letter][1] = true;
                    }
                }
                data[letter][0] = n + 1;
            }
        }
    }
    console.log(data);
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        var key = data[keys[i]];
        if (key[1]) {
            fragmentedNumber++;
            fragmentedArea += key[0];
        }
        totalNumber++;
        totalArea += key[0];
    }
}
