document.addEventListener("DOMContentLoaded", async function () {

const form = document.getElementById("anagramForm");
const input = document.querySelector("input[name='letters']");
const results = document.getElementById("results");
const statusLine = document.getElementById("statusLine");

let dictionary = [];

/* ---------- Frequency calculator ---------- */

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

/* ---------- Load dictionary once ---------- */

try {

const response = await fetch("/static/dictionary.txt");
const text = await response.text();

dictionary = text
.split(/\r?\n/)
.map(w => w.trim())
.filter(w => w.length > 0)
.map(word => ({
word: word,
freq: frequency(word)
}));

console.log("Dictionary loaded:", dictionary.length);

} catch(err){

console.error("Dictionary failed to load", err);

}

/* ---------- Check if letters can form word ---------- */

function canForm(userFreq, wordFreq){

for(let i=0;i<26;i++){

if(wordFreq[i] > userFreq[i]) return false;

}

return true;

}

/* ---------- Submit handler ---------- */

form.addEventListener("submit", function(e){

e.preventDefault();

const letters = input.value.replace(/\s/g,"");

const userFreq = frequency(letters);

let matches = [];

/* scan dictionary */

for(let i=0;i<dictionary.length;i++){

const entry = dictionary[i];

if(canForm(userFreq, entry.freq)){
matches.push(entry.word);
}

}

/* identical ordering as Python */

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

/* render results */

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