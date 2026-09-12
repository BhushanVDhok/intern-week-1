// Problem: Sort the given array using bubble sort

function bubbleSort(){
    // Time complexity: O(n^2), due to the nested array passes.
    for(let i = 0; i < arr.length-1; i++){
        for(let j = 0; j < arr.length-1; j++){
            if(arr[j] > arr[j+1]){
                let temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp; 
            }
        }
    }
    return arr;
}

let arr = [5, 3, 8, 1, 2];
console.log(bubbleSort(arr));
