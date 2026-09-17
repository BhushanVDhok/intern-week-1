# Problem : Find the largest number in a list.

numbers = [10, 25, 7, 40, 15]

largest = numbers[0]

for num in numbers:
    if num > largest:
        largest = num

print("Largest:", largest)