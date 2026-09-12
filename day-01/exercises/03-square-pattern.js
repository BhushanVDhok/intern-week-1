// Problem: Print a pattern of asterisk sign

let n = 5;
// Time complexity: O(n^2), because two loops each run n times.
for(let i = 1; i <= n; i++){
    let row = "";
    for(let j = 1; j <= n; j++){
        row = row + " * ";
    }

    console.log(row);
}
