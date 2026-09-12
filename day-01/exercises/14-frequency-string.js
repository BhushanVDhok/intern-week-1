// Problem: Given a string check every character frequency that appears in that string

let s = "hello";
let frequency = {};

// Time complexity: O(n), because every character is processed once.
for(let i = 0; i < s.length; i++){
    let ch = s[i];

    if(frequency[ch] === undefined){
        frequency[ch] = 1;
    }
    else{
        frequency[ch]++;
    }
}

console.log(frequency)
