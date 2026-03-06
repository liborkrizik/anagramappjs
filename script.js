document.addEventListener("DOMContentLoaded", function(){

const form = document.getElementById("anagramForm");
const input = document.querySelector("input[name='letters']");
const results = document.getElementById("results");
const status = document.getElementById("statusLine");

let dictionary = [];
let dictionaryLoaded = false;

/* ---------- frequency calculator ---------- */

function freq(word){

const f = new Array(26).fill(0);
word = word.toUpperCase();

for(let i=0;i<word.length;i++){

const c = word.charCodeAt(i) - 65;

if(c >= 0 && c < 26) f[c]++;

}

return f;

}

/* ---------- check if letters can form word ---------- */

function canForm(userFreq, wordFreq){

for(let i=0;i<26;i++){

if(wordFreq[i] > userFreq[i]) return false;

}

return true;

}

/* ---------- load dictionary (with precomputed frequencies) ---------- */

async function loadDictionary(){

try{

const r = await fetch("/static/dictionary.txt");

if(!r.ok) throw new Error("Dictionary fetch failed");

const t = await r.text();

dictionary = t.split(/\r?\n/)
.map(w => w.trim())
.filter(w => w.length > 0)
.map(word => ({
word: word,
freq: freq(word)
}));

dictionaryLoaded = true;

console.log("Dictionary loaded:", dictionary.length);

}
catch(e){

console.error("Dictionary failed:", e);
status.textContent = "Dictionary failed to load";

}

}

loadDictionary();

/* ---------- form submit ---------- */

form.addEventListener("submit", function(e){

e.preventDefault();

if(!dictionaryLoaded){

status.textContent = "Loading dictionary...";
return;

}

const letters = input.value.replace(/\s/g,"");
const userFreq = freq(letters);

let matches = [];

/* scan dictionary */

for(let i=0;i<dictionary.length;i++){

const entry = dictionary[i];

if(canForm(userFreq, entry.freq)) matches.push(entry.word);

}

/* python-style sort */

matches.sort(function(a,b){

if(a.length !== b.length) return a.length - b.length;

for(let i=0;i<Math.min(a.length,b.length);i++){

const d = a.charCodeAt(i) - b.charCodeAt(i);

if(d !== 0) return d;

}

return 0;

});

/* render */

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

status.textContent =
matches.length + " words in '" + letters.toUpperCase() + "'";

});

});