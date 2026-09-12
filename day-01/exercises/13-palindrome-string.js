// Problem: Check if given string is palindrome or not

let s = "racecar";
let reverse = "";

// Time complexity: O(n), because the string is traversed once before comparison.
for(let i = s.length-1; i >= 0; i--){
    reverse = reverse + s[i];
}

if(s === reverse){
    console.log("Palindrome");
}
else{
    console.log("Not palindrome");
}
