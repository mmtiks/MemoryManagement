// VARIABLES
let alphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl";
if (document.getElementById("container") == null) throw new Error("no container element");
const container: HTMLElement | null = document.getElementById("container");
// initial data
let arr: string[] = [];
let letters: string[] = [];
let sizes: string[] = [];

// data to produce
let state: string[] = [];
let states: string[] = [];

// fragmentation numbers
let fragmentedArea: number = 0;
let totalArea: number = 0;
let fragmentedNumber: number = 0;
let totalNumber: number = 0;

// VISUALIZATION
function makeRows(rows: number, cols: number, states: string[]): void {
  if (container == null) throw new Error("No container");

  container.style.setProperty("--grid-rows", rows as unknown as string);
  container.style.setProperty("--grid-cols", cols as unknown as string);
  let cell = document.createElement("div");
  cell.innerText = "";
  container.appendChild(cell).className = "info-item";

  // UPPER ROW OF INDEXES
  let k: number = 1
  for (k; k < cols; k++) {
    let cell = document.createElement("div");
    cell.innerText = k as unknown as string;
    container.appendChild(cell).className = "info-item";
  }

  // COLOR FOR SLOTS
  let colors: string[] = [
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

  // WRITE DATA INTO GRID
  for (let r: number = 1; r <= rows; r++) {
    let state: string = states[r - 1];
    cell = document.createElement("div");
    cell.innerText = "Samm : " + r as unknown as string;
    container.appendChild(cell).className = "info-item";
    for (let c: number = 0; c < cols - 1; c++) {
      let cell = document.createElement("div");
      cell.style.backgroundColor = colors[alphabet.indexOf(state[c])];
      cell.innerText = state[c];
      container.appendChild(cell).className = "grid-item";
    }
  }
}

// LOAD PROCESSES FROM SELECTED OR CUSTOM
function loadProcesses(arr: string[]): string[] {
  let val = document.querySelector('input[name="patterns"]:checked') as HTMLInputElement | null;
  if (val == null) throw new Error("none checked");
  let str: string = val.value;
  let input: string | null =
    str == "numbers4"
      ? (document.getElementById(str) as HTMLInputElement).value
      : (document.getElementById(str) as HTMLInputElement).innerHTML;
  if (input == null) throw new Error("input is null");
  arr = input.split(";");
  return arr;
}

function clean() {
  // CLEAN ALL NEEDED FIELDS AND VARIABLES
  if (container == null) throw new Error("missing container");
  container.innerHTML = "";
  let failed: HTMLElement | null = document.getElementById("failed");
  if (failed == null) throw new Error("no fail statement");
  failed.innerHTML = "";
  letters = [];
  sizes = [];
  states = [];
  state = [];
  fragmentedArea = 0;
  totalArea = 0;
  fragmentedNumber = 0;
  totalNumber = 0;
}

function message(msg: string): void {
  let failed: HTMLElement | null = document.getElementById("failed");
  if (failed == null) throw new Error("no fail statement");
  failed.innerHTML = msg;
}


function start() {
  if (container == null) throw new Error("no container");
  clean();
  arr = loadProcesses(arr);

  arr.forEach((element) => {
    letters.push(element.split(",")[0]);
    sizes.push(element.split(",")[1]);
  });

  let stateLen: number = 48;

  // initialize state
  for (let i = 0; i < stateLen; i++) {
    state[i] = "-";
  }

  // read inputs and change state accordingly, 10 max
  for (let i = 0; i < 10; i++) {
    if (i < letters.length) {
      let letter = letters[i];
      let size = sizes[i];
      // if command is '-' then remove said element
      if (size[0] == '-') remove(state, letter);
      // if command is '+' then add element
      else if (size[0] == '+') add(state, letter, size.substring(1) as unknown as number);
      else add(state, letter, size as unknown as number);
    }
    // add generated state to array of states
    states.push(structuredClone(state));
  }
  // this case means that we have failed
  if (states.length < letters.length) {
    message(states.length as unknown as string);
  } else {
    // calculate stats of fragmentation
    fragmentedStats(state);
    let numF: number = Math.round(1000 * fragmentedNumber as number / totalNumber as number) / 10;
    let areaF: number = Math.round(1000 * fragmentedArea / totalArea) / 10;
    message("Fragmented files percentage" + numF as unknown as string + "%. Fragmented area percentage " + areaF as unknown as string + "%.");
  }

  // draw our generated grid
  makeRows(states.length, stateLen, states);
}


function add(state: string[], letter: string, size: number): string[] {
  // iterate over and add our letters
  for (let i = 0; i < state.length; i++) {
    if (state[i] == "-") {
      if (size <= 0) break;
      state[i] = letter;
      size--;
    }
  }

  return state;
}

function remove(state: string[], letter: string): string[] {
  // iterate over and remove all found letters
  for (let i = 0; i < state.length; i++) {
    if (state[i] == letter) {
      state[i] = "-";
    }
  }
  return state;
}


function fragmentedStats(state: string[]): void {
  // add letter objects to data with their area and whether they are fragmented or not
  let data = {};
  data[state[0]] = [1, false];
  let index;
  for (let i = 1; i < state.length; i++) {
    let letter = state[i];
    if (letter != "-") {
      index = Object.keys(data).indexOf(letter);
      if (index == -1){
        data[letter] = [1, false]; // key is not in data, initialize it
      }
      else {
        let n = data[letter][0]; 
        if (!data[letter][1]) { // if not yet registered as fragmented
          if (state[i - 1] != letter) {
            data[letter][1] = true; // if already in data and last letter is not the same then fragmented = true
          }
        }
        data[letter][0] = n + 1; // add to area
      }
    }
  }

  // iterate over data and add to needed variables
  let keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    let key = data[keys[i]];
    if (key[1]) {
      fragmentedNumber++;
      fragmentedArea += key[0];
    }
    totalNumber++;
    totalArea += key[0];
  }

}