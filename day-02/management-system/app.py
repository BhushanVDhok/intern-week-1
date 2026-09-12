"""Simple JSON-based Employee Management System."""
import json
from pathlib import Path

DATA_FILE = Path(__file__).with_name("data.json")


def load_employees():
    try:
        if not DATA_FILE.exists():
            return []
        with DATA_FILE.open(encoding="utf-8") as file:
            data = json.load(file)
        if not isinstance(data, list):
            raise ValueError("Data must be a list.")
        return data
    except (OSError, json.JSONDecodeError, ValueError) as error:
        print(f"Could not load data: {error}")
        return []


def save_employees(employees):
    try:
        with DATA_FILE.open("w", encoding="utf-8") as file:
            json.dump(employees, file, indent=2)
    except OSError as error:
        print(f"Could not save data: {error}")


def get_number(prompt, number_type=float):
    while True:
        try:
            return number_type(input(prompt).strip())
        except ValueError:
            print("Please enter a valid number.")


def find_employee(employees, employee_id):
    return next((item for item in employees if item["id"] == employee_id), None)


def show_employees(employees):
    if not employees:
        print("No employees found.")
        return
    print("\nID  Name                 Department       Salary")
    print("-" * 55)
    for item in employees:
        print(f"{item['id']:<3} {item['name']:<20} {item['department']:<16} {item['salary']:.2f}")


def add_employee(employees):
    employee_id = get_number("Employee ID: ", int)
    if find_employee(employees, employee_id):
        print("That ID already exists.")
        return
    name = input("Name: ").strip()
    department = input("Department: ").strip()
    salary = get_number("Salary: ")
    if not name or not department or salary < 0:
        print("Name/department cannot be empty and salary cannot be negative.")
        return
    employees.append({"id": employee_id, "name": name, "department": department, "salary": salary})
    save_employees(employees)
    print("Employee added.")


def update_employee(employees):
    item = find_employee(employees, get_number("Employee ID to update: ", int))
    if not item:
        print("Employee not found.")
        return
    name = input(f"Name [{item['name']}]: ").strip()
    department = input(f"Department [{item['department']}]: ").strip()
    salary = input(f"Salary [{item['salary']}]: ").strip()
    if name:
        item["name"] = name
    if department:
        item["department"] = department
    if salary:
        try:
            value = float(salary)
            if value < 0:
                raise ValueError
            item["salary"] = value
        except ValueError:
            print("Salary was not changed; it must be a non-negative number.")
    save_employees(employees)
    print("Employee updated.")


def delete_employee(employees):
    item = find_employee(employees, get_number("Employee ID to delete: ", int))
    if not item:
        print("Employee not found.")
        return
    employees.remove(item)
    save_employees(employees)
    print("Employee deleted.")


def search_employees(employees):
    keyword = input("Search by name or ID: ").strip().lower()
    show_employees([item for item in employees if keyword in item["name"].lower() or keyword == str(item["id"])])


def filter_employees(employees):
    department = input("Department: ").strip().lower()
    show_employees([item for item in employees if item["department"].lower() == department])


def sort_employees(employees):
    choice = input("Sort by 1) name or 2) salary: ").strip()
    if choice == "1":
        show_employees(sorted(employees, key=lambda item: item["name"].lower()))
    elif choice == "2":
        show_employees(sorted(employees, key=lambda item: item["salary"], reverse=True))
    else:
        print("Invalid choice.")


def show_statistics(employees):
    if not employees:
        print("No data available.")
        return
    salaries = [item["salary"] for item in employees]
    departments = {}
    for item in employees:
        departments[item["department"]] = departments.get(item["department"], 0) + 1
    highest = max(employees, key=lambda item: item["salary"])
    print(f"\nTotal employees: {len(employees)}")
    print(f"Average salary: {sum(salaries) / len(salaries):.2f}")
    print(f"Minimum salary: {min(salaries):.2f}")
    print(f"Maximum salary: {max(salaries):.2f}")
    print(f"Highest paid: {highest['name']} ({highest['salary']:.2f})")
    print("Employees by department:")
    for department, count in departments.items():
        print(f"- {department}: {count}")


def main():
    employees = load_employees()
    actions = {
        "1": lambda: show_employees(employees), "2": lambda: add_employee(employees),
        "3": lambda: update_employee(employees), "4": lambda: delete_employee(employees),
        "5": lambda: search_employees(employees), "6": lambda: filter_employees(employees),
        "7": lambda: sort_employees(employees), "8": lambda: show_statistics(employees),
    }
    while True:
        print("\n--- Employee Management System ---")
        print("1.List  2.Add  3.Update  4.Delete")
        print("5.Search  6.Filter  7.Sort  8.Statistics  9.Exit")
        choice = input("Choose an option: ").strip()
        if choice == "9":
            print("Exiting....")
            break
        action = actions.get(choice)
        if action:
            action()
        else:
            print("Choose a number from 1 to 9.")


if __name__ == "__main__":
    main()
