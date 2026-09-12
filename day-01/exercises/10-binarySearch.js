// Problem: Given an array & a target element search it using binary search

function binarySearch(arr, target){
    // Time complexity: O(log n), because the sorted search range is halved each time.
    let i = 0;
    let j = arr.length - 1;

    while(i <= j){
        let mid = Math.floor((i + j) / 2);

        if(arr[mid] === target){
            return mid;
        }
        else if(arr[mid] < target){
            i = mid + 1;
        }
        else{
            j = mid - 1;
        }
    }
    return -1;
}

let arr = [10, 20, 30, 40, 50];
console.log(binarySearch(arr, 40));
console.log(binarySearch(arr, 60));
