// Problem: Find sum of numbers in given range

let n = 10;
let sum = 0;

// Time complexity: O(n), where n is the upper limit.
for(let i = 0; i <= n; i++){
    sum = sum + i;
}

console.log("Total sum is: "+sum);
