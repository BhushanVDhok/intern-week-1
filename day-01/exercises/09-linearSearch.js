// Problem: Given an array & a target element search it using linear search

function linearSearch(arr, target){
    // Time complexity: O(n) in the worst case, when the target is absent or last.
    for(let i = 0; i < arr.length; i++){
        if(arr[i] === target){
            return true;
        }
    }
    return false;
}

let arr = [10, 20, 30, 40, 50];

console.log(linearSearch(arr, 30));
console.log(linearSearch(arr, 60));
