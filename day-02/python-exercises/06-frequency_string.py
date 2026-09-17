# Problem: Count frequnecy of each character in a string.

text = "Bhushan Dhok"

frequency = {}

for char in text:
    if char in frequency:
        frequency[char] += 1
    else:
        frequency[char] = 1

print(frequency)