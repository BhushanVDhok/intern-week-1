# Problem: Simple Calculator with exception Handling

def calculator(a, b, operator):
    try:
        if operator == "+":
            return a + b
        elif operator == "-":
            return a - b
        elif operator == "*":
            return a * b
        elif operator == "/":
            return a / b
        else:
            return "Invalid operator"

    except ZeroDivisionError:
        return "Cannot divide by zero"


a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
operator = input("Enter operator: ")

print(calculator(a, b, operator))