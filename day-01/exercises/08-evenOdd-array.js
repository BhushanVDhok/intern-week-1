// Problem: Count how many elements are even & odd in given array

let arr = [10,15,22,7,8,13];

let even = 0;
let odd = 0;

// Time complexity: O(n), because each array element is checked once.
for(let i = 0; i < arr.length; i++){
    if(arr[i] % 2 === 0){
        even++;
    }
    else{
        odd++;
    }
}

console.log("No of even elements are: "+even);
console.log("No of odd elements are: "+odd);
