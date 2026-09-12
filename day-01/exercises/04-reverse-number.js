// Problem: Find reverse of a number

let n = 12345;
let reverse = 0;

// Time complexity: O(log n), because one digit is processed per iteration.
while(n > 0){
    let digit = n % 10;
    reverse = reverse * 10 + digit;
    n = Math.floor(n / 10);
}

console.log("Reverse is: "+reverse);
