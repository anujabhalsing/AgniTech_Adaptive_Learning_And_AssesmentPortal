// SkillTrace AI — Lesson Content
// AI-generated educational content. Labelled [AI-Generated] until reviewed.
const LESSONS = {
  // ─── PYTHON ────────────────────────────────────────────────────────────────
  py_variables: {
    topicId: "py_variables",
    title: "Python Variables & Data Types",
    label: "AI-Generated",
    overview: "A variable is a named storage location that holds a value. In Python, you don't need to declare the type — Python figures it out automatically from the value you assign.",
    objectives: [
      "Create and assign variables",
      "Identify the four main primitive types",
      "Convert between types using int(), float(), str()"
    ],
    sections: [
      {
        heading: "What is a Variable?",
        content: "A variable is like a labelled box. You give it a name, put a value inside, and refer to it by that name later.",
        code: `# Assigning values to variables
name = "Alice"      # str (text)
age  = 18           # int (whole number)
score = 9.5         # float (decimal)
passed = True       # bool (True or False)

print(name)   # Output: Alice
print(age)    # Output: 18`,
        language: "python",
        output: "Alice\n18"
      },
      {
        heading: "Checking the Type",
        content: "Use the built-in type() function to inspect what kind of data a variable holds.",
        code: `x = 42
print(type(x))   # <class 'int'>

y = 3.14
print(type(y))   # <class 'float'>

z = "hello"
print(type(z))   # <class 'str'>`,
        language: "python",
        output: "<class 'int'>\n<class 'float'>\n<class 'str'>"
      },
      {
        heading: "Type Conversion",
        content: "Sometimes you need to convert one type to another. Python provides int(), float(), and str() for this.",
        code: `age_text = "21"           # This is a string
age_num  = int(age_text)  # Convert to integer

print(age_num + 1)        # Output: 22
print(str(age_num))       # Output: "22" (back to string)`,
        language: "python",
        output: "22\n22"
      }
    ],
    commonMistakes: [
      "Using a variable before assigning it — Python raises a NameError.",
      "Concatenating a string and an integer directly: 'Age: ' + 18 raises TypeError. Use str(18) first.",
      "Variable names are case-sensitive: score and Score are different variables."
    ],
    tryIt: {
      prompt: "Create three variables: your name (string), your age (int), and your height in metres (float). Print all three on separate lines.",
      starterCode: `# Your code here
name = ___
age  = ___
height = ___
print(name)
print(age)
print(height)`,
      hint: "Replace ___ with your values. Strings go inside quotes.",
      solutionCode: `name   = "Alex"
age    = 17
height = 1.72
print(name)
print(age)
print(height)`
    }
  },

  py_conditions: {
    topicId: "py_conditions",
    title: "Python Conditions & If Statements",
    label: "AI-Generated",
    overview: "Conditions allow your program to take different paths based on whether something is true or false. The if/elif/else structure is the primary decision-making tool in Python.",
    sections: [
      {
        heading: "Basic if Statement",
        content: "An if statement runs a block of code only when its condition evaluates to True.",
        code: `temperature = 35

if temperature > 30:
    print("It's hot outside!")
print("Program continues here")`,
        language: "python",
        output: "It's hot outside!\nProgram continues here"
      },
      {
        heading: "if / elif / else",
        content: "elif adds additional conditions; else catches everything that didn't match.",
        code: `score = 72

if score >= 90:
    print("Grade: A")
elif score >= 75:
    print("Grade: B")
elif score >= 60:
    print("Grade: C")
else:
    print("Grade: F")`,
        language: "python",
        output: "Grade: C"
      },
      {
        heading: "Comparison & Logical Operators",
        content: "Use ==, !=, <, >, <=, >= to compare. Combine conditions with and, or, not.",
        code: `age   = 20
member = True

if age >= 18 and member:
    print("Access granted")
else:
    print("Access denied")`,
        language: "python",
        output: "Access granted"
      }
    ],
    commonMistakes: [
      "Using = (assignment) instead of == (comparison) in conditions.",
      "Forgetting the colon : at the end of if/elif/else lines.",
      "Incorrect indentation — Python uses indentation to define blocks."
    ],
    tryIt: {
      prompt: "Write a program that checks if a number is positive, negative, or zero.",
      starterCode: `number = 7
if ___:
    print("Positive")
elif ___:
    print("Negative")
else:
    print("Zero")`,
      hint: "Use > 0 for positive and < 0 for negative.",
      solutionCode: `number = 7
if number > 0:
    print("Positive")
elif number < 0:
    print("Negative")
else:
    print("Zero")`
    }
  },

  py_loops: {
    topicId: "py_loops",
    title: "Python Loops",
    label: "AI-Generated",
    overview: "Loops repeat a block of code multiple times. Python has two main loops: for (iterates over a sequence) and while (repeats while a condition is true).",
    sections: [
      {
        heading: "for Loop with range()",
        content: "range(n) generates numbers from 0 up to (but not including) n.",
        code: `for i in range(5):
    print(i)
# Output: 0 1 2 3 4 (each on a new line)`,
        language: "python",
        output: "0\n1\n2\n3\n4"
      },
      {
        heading: "for Loop over a List",
        content: "You can iterate directly over a list — no index needed.",
        code: `fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)`,
        language: "python",
        output: "apple\nbanana\ncherry"
      },
      {
        heading: "while Loop",
        content: "A while loop keeps running as long as its condition remains True.",
        code: `count = 1
while count <= 5:
    print(count)
    count += 1`,
        language: "python",
        output: "1\n2\n3\n4\n5"
      },
      {
        heading: "break and continue",
        content: "break exits the loop immediately; continue skips the rest of the current iteration.",
        code: `for n in range(10):
    if n == 6:
        break       # stops here
    if n % 2 == 0:
        continue    # skips even numbers
    print(n)`,
        language: "python",
        output: "1\n3\n5"
      }
    ],
    commonMistakes: [
      "Creating an infinite while loop by forgetting to update the loop variable.",
      "Off-by-one: range(5) goes 0–4, not 1–5. Use range(1, 6) for 1–5.",
      "Modifying a list while iterating over it can cause unexpected behaviour."
    ],
    tryIt: {
      prompt: "Print all even numbers from 2 to 20 using a for loop.",
      starterCode: `for i in range(___):
    if i % 2 == ___:
        print(i)`,
      hint: "range(2, 21) gives you 2 through 20. Even numbers have remainder 0 when divided by 2.",
      solutionCode: `for i in range(2, 21):
    if i % 2 == 0:
        print(i)`
    }
  },

  py_functions: {
    topicId: "py_functions",
    title: "Python Functions",
    label: "AI-Generated",
    overview: "A function is a named, reusable block of code. Functions help you avoid repetition and make your programs easier to read and test.",
    sections: [
      {
        heading: "Defining and Calling a Function",
        content: "Use def to define a function. Call it by writing its name followed by parentheses.",
        code: `def greet():
    print("Hello, learner!")

greet()   # Call the function`,
        language: "python",
        output: "Hello, learner!"
      },
      {
        heading: "Parameters and Arguments",
        content: "Parameters are placeholders inside the function; arguments are the real values you pass.",
        code: `def greet(name):
    print("Hello, " + name + "!")

greet("Alice")
greet("Bob")`,
        language: "python",
        output: "Hello, Alice!\nHello, Bob!"
      },
      {
        heading: "Return Values",
        content: "A function can compute something and send back a result with return.",
        code: `def add(a, b):
    return a + b

result = add(3, 7)
print(result)   # 10`,
        language: "python",
        output: "10"
      },
      {
        heading: "Default Arguments",
        content: "You can give parameters default values so callers don't have to provide them.",
        code: `def greet(name, greeting="Hello"):
    print(greeting + ", " + name + "!")

greet("Alice")             # uses default
greet("Bob", "Hi")         # overrides default`,
        language: "python",
        output: "Hello, Alice!\nHi, Bob!"
      }
    ],
    commonMistakes: [
      "Calling a function before it is defined — Python will raise a NameError.",
      "Forgetting return — without it the function returns None.",
      "Mismatching number of arguments to parameters raises TypeError."
    ],
    tryIt: {
      prompt: "Write a function called square that takes a number and returns its square.",
      starterCode: `def square(n):
    return ___

print(square(4))   # Should print 16
print(square(7))   # Should print 49`,
      hint: "Return n multiplied by n, or use n ** 2.",
      solutionCode: `def square(n):
    return n ** 2

print(square(4))
print(square(7))`
    }
  },

  py_lists: {
    topicId: "py_lists",
    title: "Python Lists",
    label: "AI-Generated",
    overview: "A list is an ordered, mutable (changeable) collection of items. Lists are one of the most used data structures in Python.",
    sections: [
      {
        heading: "Creating and Indexing Lists",
        content: "Lists use square brackets. Indexing starts at 0. Negative indices count from the end.",
        code: `colours = ["red", "green", "blue"]
print(colours[0])    # red
print(colours[2])    # blue
print(colours[-1])   # blue (last item)`,
        language: "python",
        output: "red\nblue\nblue"
      },
      {
        heading: "Modifying Lists",
        content: "append() adds to the end; remove() deletes by value; pop() removes by index.",
        code: `nums = [10, 20, 30]
nums.append(40)
print(nums)    # [10, 20, 30, 40]

nums.remove(20)
print(nums)    # [10, 30, 40]`,
        language: "python",
        output: "[10, 20, 30, 40]\n[10, 30, 40]"
      },
      {
        heading: "Iterating over a List",
        content: "Combine for loops with lists for clean, readable iteration.",
        code: `scores = [85, 92, 78, 96]
total = 0
for s in scores:
    total += s
print("Average:", total / len(scores))`,
        language: "python",
        output: "Average: 87.75"
      }
    ],
    commonMistakes: [
      "IndexError: accessing an index that doesn't exist — check len(list) first.",
      "Using list.sort() changes the list in-place and returns None; sorted(list) returns a new sorted list.",
      "Lists are mutable — assigning b = a means both a and b point to the same list."
    ],
    tryIt: {
      prompt: "Create a list of 5 numbers. Print the largest number using the max() function and the list length using len().",
      starterCode: `numbers = [___]
print("Max:", ___)
print("Count:", ___)`,
      hint: "max(numbers) returns the largest item. len(numbers) returns the count.",
      solutionCode: `numbers = [4, 17, 3, 9, 12]
print("Max:", max(numbers))
print("Count:", len(numbers))`
    }
  },

  // ─── JAVA ──────────────────────────────────────────────────────────────────
  java_variables: {
    topicId: "java_variables",
    title: "Java Variables & Data Types",
    label: "AI-Generated",
    overview: "Java is a statically typed language — every variable must have a declared type before use. The compiler checks types at compile time, catching many errors early.",
    sections: [
      {
        heading: "Declaring Variables",
        content: "The pattern is: type name = value; — the semicolon is required.",
        code: `int age = 18;
double height = 1.75;
String name = "Alice";
boolean passed = true;

System.out.println(name + " is " + age + " years old.");`,
        language: "java",
        output: "Alice is 18 years old."
      },
      {
        heading: "Primitive vs Reference Types",
        content: "Primitive types (int, double, boolean, char) store values directly. Reference types (String, arrays, objects) store a reference to the data.",
        code: `// Primitive
int x = 10;
int y = x;    // y is a copy
x = 20;
System.out.println(y); // still 10

// String (reference type)
String s = "Hello";
System.out.println(s.length()); // 5`,
        language: "java",
        output: "10\n5"
      },
      {
        heading: "Type Casting",
        content: "Widening (int to double) is automatic. Narrowing (double to int) requires explicit cast.",
        code: `int a = 7;
double b = a;          // widening — automatic
System.out.println(b); // 7.0

double pi = 3.14;
int approx = (int) pi; // narrowing — explicit cast
System.out.println(approx); // 3`,
        language: "java",
        output: "7.0\n3"
      }
    ],
    commonMistakes: [
      "Using int for decimal numbers — use double or float instead.",
      "Comparing Strings with == — use .equals() for content comparison.",
      "Forgetting the semicolon at the end of statements."
    ],
    tryIt: {
      prompt: "Declare a variable for your favourite number as an int and print a sentence about it.",
      starterCode: `int favourite = ___;
System.out.println("My favourite number is " + ___);`,
      hint: "Fill in a number and use the variable name in the print statement.",
      solutionCode: `int favourite = 7;
System.out.println("My favourite number is " + favourite);`
    }
  },

  java_conditions: {
    topicId: "java_conditions",
    title: "Java Conditions & Loops",
    label: "AI-Generated",
    overview: "Java uses curly braces {} to define blocks, making the structure explicit and readable.",
    sections: [
      {
        heading: "if / else if / else",
        content: "Java if statements require boolean conditions — 0 is not false in Java.",
        code: `int score = 82;

if (score >= 90) {
    System.out.println("Grade A");
} else if (score >= 75) {
    System.out.println("Grade B");
} else {
    System.out.println("Grade C or below");
}`,
        language: "java",
        output: "Grade B"
      },
      {
        heading: "for Loop",
        content: "The classic C-style for loop: initialise; condition; update.",
        code: `for (int i = 1; i <= 5; i++) {
    System.out.println("Count: " + i);
}`,
        language: "java",
        output: "Count: 1\nCount: 2\nCount: 3\nCount: 4\nCount: 5"
      },
      {
        heading: "while Loop",
        content: "while repeats while the condition is true. Always ensure the condition eventually becomes false.",
        code: `int n = 10;
while (n > 0) {
    System.out.println(n);
    n -= 3;
}`,
        language: "java",
        output: "10\n7\n4\n1"
      }
    ],
    commonMistakes: [
      "Using = instead of == in conditions — Java will refuse to compile if the result isn't boolean.",
      "Infinite loops from forgetting to update the loop variable.",
      "Missing curly braces — omitting them is legal but risky with multiple statements."
    ],
    tryIt: {
      prompt: "Print all multiples of 3 from 3 to 30 using a for loop.",
      starterCode: `for (int i = ___; i <= 30; i += ___) {
    System.out.println(i);
}`,
      hint: "Start at 3 and increment by 3 each step.",
      solutionCode: `for (int i = 3; i <= 30; i += 3) {
    System.out.println(i);
}`
    }
  },

  java_classes: {
    topicId: "java_classes",
    title: "Java Classes & Objects",
    label: "AI-Generated",
    overview: "A class is a blueprint describing the state (fields) and behaviour (methods) of objects. An object is a specific instance of that class.",
    sections: [
      {
        heading: "Defining a Class",
        content: "Fields hold data; methods define behaviour; the constructor initialises an object.",
        code: `public class Dog {
    String name;
    int age;

    // Constructor
    public Dog(String name, int age) {
        this.name = name;
        this.age  = age;
    }

    public void bark() {
        System.out.println(name + " says: Woof!");
    }
}`,
        language: "java",
        output: ""
      },
      {
        heading: "Creating Objects",
        content: "Use new to allocate memory and call the constructor.",
        code: `Dog d1 = new Dog("Rex", 3);
Dog d2 = new Dog("Bella", 5);

d1.bark();                    // Rex says: Woof!
System.out.println(d2.name);  // Bella`,
        language: "java",
        output: "Rex says: Woof!\nBella"
      }
    ],
    commonMistakes: [
      "Forgetting new — without it you have a null reference, not an object.",
      "Confusing the field and the parameter when both have the same name — use this.name to refer to the field.",
      "Calling a method on a null reference causes NullPointerException."
    ],
    tryIt: {
      prompt: "Create a Car class with fields make and year, a constructor, and a method info() that prints 'Make: ... Year: ...'.",
      starterCode: `public class Car {
    String make;
    int year;

    public Car(String make, int year) {
        this.___ = make;
        this.___ = year;
    }

    public void info() {
        System.out.println("Make: " + make + " Year: " + year);
    }
}`,
      hint: "Use this.make and this.year in the constructor.",
      solutionCode: `public class Car {
    String make;
    int year;

    public Car(String make, int year) {
        this.make = make;
        this.year = year;
    }

    public void info() {
        System.out.println("Make: " + make + " Year: " + year);
    }
}`
    }
  },

  // ─── C++ ──────────────────────────────────────────────────────────────────
  cpp_variables: {
    topicId: "cpp_variables",
    title: "C++ Variables & Data Types",
    label: "AI-Generated",
    overview: "C++ is statically typed like Java, but gives you more control over memory. Every variable requires a type, and you use cout to print output.",
    sections: [
      {
        heading: "Declaring Variables",
        content: "Declare type then name. Initialise at the same time to avoid undefined behaviour.",
        code: `#include <iostream>
using namespace std;

int main() {
    int age = 20;
    double gpa = 3.8;
    char grade = 'A';
    bool passed = true;

    cout << "Age: " << age << endl;
    cout << "GPA: " << gpa << endl;
    return 0;
}`,
        language: "cpp",
        output: "Age: 20\nGPA: 3.8"
      },
      {
        heading: "Constants",
        content: "const prevents a variable's value from being changed after initialisation.",
        code: `const double PI = 3.14159;
// PI = 3.14; // This would cause a compile error
cout << PI << endl;`,
        language: "cpp",
        output: "3.14159"
      }
    ],
    commonMistakes: [
      "Using a variable without initialising it — the value is undefined in C++ (not 0 automatically).",
      "Integer division truncates: 7 / 2 = 3, not 3.5. Use 7.0 / 2 for a double result.",
      "Forgetting #include <iostream> and using namespace std;"
    ],
    tryIt: {
      prompt: "Declare a constant for the speed of light (299792458 m/s) and print it.",
      starterCode: `#include <iostream>
using namespace std;
int main() {
    const int SPEED_OF_LIGHT = ___;
    cout << ___ << endl;
    return 0;
}`,
      hint: "Assign the number 299792458 to the constant.",
      solutionCode: `#include <iostream>
using namespace std;
int main() {
    const int SPEED_OF_LIGHT = 299792458;
    cout << SPEED_OF_LIGHT << endl;
    return 0;
}`
    }
  },

  cpp_pointers: {
    topicId: "cpp_pointers",
    title: "C++ Pointers",
    label: "AI-Generated",
    overview: "A pointer is a variable that stores the memory address of another variable. Pointers give you direct control over memory and are essential for dynamic allocation and efficient data structures.",
    sections: [
      {
        heading: "Address-of & and Dereference *",
        content: "& gives you the address of a variable. * lets you access the value at an address.",
        code: `int x = 42;
int* ptr = &x;   // ptr holds the address of x

cout << x;       // 42  (value)
cout << &x;      // e.g. 0x61ff08 (address — varies)
cout << ptr;     // same address
cout << *ptr;    // 42  (dereference — value at address)`,
        language: "cpp",
        output: "42\n[address]\n[address]\n42"
      },
      {
        heading: "Modifying Through a Pointer",
        content: "Changing *ptr changes the original variable — they share the same memory.",
        code: `int score = 80;
int* p = &score;
*p = 95;           // modifies score through the pointer
cout << score;     // 95`,
        language: "cpp",
        output: "95"
      }
    ],
    commonMistakes: [
      "Dereferencing a null or uninitialised pointer causes undefined behaviour (likely a crash).",
      "Confusing the pointer type (int*) with the dereference operator (*p).",
      "Memory leaks from allocating with new without a matching delete."
    ],
    tryIt: {
      prompt: "Create an integer variable age = 25, a pointer to it, then use the pointer to change age to 30 and print the new value.",
      starterCode: `int age = 25;
int* ___ = &age;
*___ = 30;
cout << age << endl;`,
      hint: "Name the pointer ptr and use *ptr to write through it.",
      solutionCode: `int age = 25;
int* ptr = &age;
*ptr = 30;
cout << age << endl;`
    }
  }
};
