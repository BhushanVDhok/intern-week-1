// Problem: Finding max element from the given array

function maxElement(arr){
    // Time complexity: O(n), because the array is scanned once.
    let max = arr[0];
    for(let i = 0; i < arr.length; i++){
        if(arr[i] > max){
            max = arr[i];
        }
    }
    return max;
}

const arr = [-9, -10, -1, 0, -3];
const max = maxElement(arr);
console.log("Maximum element from the given array is: "+ max);
