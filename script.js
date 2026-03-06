document.addEventListener("DOMContentLoaded", async function () {

const form = document.getElementById("anagramForm");
const input = document.querySelector("input[name='letters']");
const results = document.getElementById("results");
const statusLine = document.getElementById("statusLine");

let dictionary = [];

/* Load dictionary */
try {

const response = await fetch("/static/dictionary.txt");
const text = await response.text();

dictionary = text
.split(/\r?\n/)
.map(w => w.trim())
.filter(w => w.length > 0);

console.log("Dictionary loaded:", dictionary.length);

} catch(err) {

console.error("Dictionary failed to load", err);

}

/* Frequency calculator */

function frequency(word){

const freq = new Array(26).fill(0);

word = word.toUpperCase();

for(let i=0;i<word.length;i++){

const code = word.charCodeAt(i) - 65;

if(code >= 0 && code < 26){
freq[code]++;
}

}

return freq;

}

/* Check if word can be built */

function canForm(userFreq, wordFreq){

for(let i=0;i<26;i++){

if(wordFreq[i] > userFreq[i]) return false;

}

return true;

}

/* Submit event */

form.addEventListener("submit", function(e){

e.preventDefault();

const letters = input.value.replace(/\s/g,"");

const userFreq = frequency(letters);

let matches = [];

/* Scan dictionary */

for(let i=0;i<dictionary.length;i++){

const word = dictionary[i];

const wordFreq = frequency(word);

if(canForm(userFreq, wordFreq)){
matches.push(word);
}

}

/* Python identical sort */

matches.sort(function(a,b){

if(a.length !== b.length){
return a.length - b.length;
}

for(let i=0;i<Math.min(a.length,b.length);i++){

const diff = a.charCodeAt(i) - b.charCodeAt(i);

if(diff !== 0) return diff;

}

return 0;

});

/* Render */

results.innerHTML = "";

for(let i=0;i<matches.length;i++){

const div = document.createElement("div");
div.className = "anagram-word";

const link = document.createElement("a");

link.href = "#";
link.textContent = " " + matches[i] + " ";

div.appendChild(link);

results.appendChild(div);

}

statusLine.textContent =
matches.length + " words in '" + letters.toUpperCase() + "'";

});

});