// Problem: Implement a Linked List 

class Node{
    constructor(data , next = null){
        this.data = data;
        this.next = next;
    }
}

function printLL(head){
    // Time complexity: O(n), because every linked-list node is visited once.
    let temp = head;
    let result = "";
    while(temp !== null){
        result = result + temp.data + " -> ";
        temp = temp.next;
    }
    console.log(result + "NULL");
}

let head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(3);
head.next.next.next = new Node(4);

printLL(head);
