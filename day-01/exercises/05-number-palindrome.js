// Problem: Check if a number is palindrome or not 

let n = 121;
let original = n;
let reverse = 0;

// Time complexity: O(log n), because one digit is processed per iteration.
while(n > 0){
    let digit = n % 10;
    reverse = reverse * 10 + digit;
    n = Math.floor(n / 10);
}

if(original == reverse){
    console.log("Palindrome");
}
else{
    console.log("Not palindrome");
}
