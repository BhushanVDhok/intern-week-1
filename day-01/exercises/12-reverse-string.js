// Given a string reverse it's every character and return a reversed string

let s = "hello";
let reverse = "";

// Time complexity: O(n), because the string is traversed once.
for(let i = s.length-1; i >= 0; i--){
    reverse = reverse + s[i];
}

console.log(reverse);
