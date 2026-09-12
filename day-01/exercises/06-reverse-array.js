// Problem: Given an array of elements we have to reverse it 

function reverseArray(arr){
    // Time complexity: O(n), because each array element is visited at most once.
    let i = 0;
    let j = arr.length - 1;

    while(i < j){
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        i++;
        j--;
    }
    return arr;
}

const arr = [10, 20, 30, 40, 50];
console.log(reverseArray(arr));
