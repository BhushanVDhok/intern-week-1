# Problem : Implementation of student class 

class Student:

    def __init__(self, name, marks):
        self.name = name
        self.marks = marks

    def display(self):
        print("Name:", self.name)
        print("Marks:", self.marks)

    def result(self):
        if self.marks >= 40:
            print("Pass")
        else:
            print("Fail")


student1 = Student("Bhushan", 75)

student1.display()
student1.result()