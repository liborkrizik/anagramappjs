document.addEventListener("DOMContentLoaded", async () => {

const form = document.getElementById("anagramForm");
const input = document.querySelector("input[name='letters']");
const results = document.getElementById("results");
const stats = document.getElementById("stats");

let dictionary = [];

/* load dictionary */

const response = await fetch("/static/dictionary.txt");
const text = await response.text();

/* preserve exact dictionary order */

dictionary = text
.split("\n")
.map(w => w.trim())
.filter(w => w.length > 0);

console.log("dictionary loaded:", dictionary.length);

/* frequency */

function frequency(word){

const freq = new Array(26).fill(0);

word = word.toUpperCase();

for(let char of word){

const index = char.charCodeAt(0) - 65;

if(index >= 0 && index < 26){
freq[index]++;
}

}

return freq;

}

/* letter check */

function canForm(userFreq, wordFreq){

for(let i = 0; i < 26; i++){

if(wordFreq[i] > userFreq[i]) return false;

}

return true;

}

/* submit */

form.addEventListener("submit", (e) => {

e.preventDefault();

const letters = input.value.replace(/\s/g,"");

const userFreq = frequency(letters);

let matches = [];

for(let word of dictionary){

const wordFreq = frequency(word);

if(canForm(userFreq, wordFreq)){
matches.push(word);
}

}

/* python-style sorting */

matches.sort((a,b)=>{

if(a.length !== b.length) return a.length - b.length;

for(let i=0;i<Math.min(a.length,b.length);i++){

const diff = a.charCodeAt(i) - b.charCodeAt(i);

if(diff !== 0) return diff;

}

return 0;

});

/* render */

results.innerHTML="";

matches.forEach(word=>{

const div=document.createElement("div");
div.className="anagram-word";

div.innerHTML=`<a href="#">${word}</a>`;

results.appendChild(div);

});

stats.textContent =
matches.length + " words found for '" + letters.toUpperCase() + "'";

});

});