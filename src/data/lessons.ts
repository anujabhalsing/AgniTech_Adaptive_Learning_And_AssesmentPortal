import { Lesson } from '../types';

export const lessons: Lesson[] = [
  // ── PYTHON: Variables ──
  {
    id: 'lesson-py-variables-1',
    topicId: 'py-variables',
    title: 'What is a Variable?',
    content: `A **variable** is a named storage location in your program's memory. Think of it as a labelled box where you can store a value and retrieve it later.

In Python, you create a variable simply by assigning a value to a name using the \`=\` operator. Python is **dynamically typed** — you don't have to declare the type; Python figures it out automatically.

**Common data types:**
- \`int\` — whole numbers: \`42\`, \`-7\`, \`0\`
- \`float\` — decimal numbers: \`3.14\`, \`-0.5\`
- \`str\` — text in quotes: \`"hello"\`, \`'world'\`
- \`bool\` — True or False

You can check the type of any value with \`type()\`.`,
    codeExample: `# Assigning variables
name = "Alice"
age = 20
height = 5.7
is_student = True

# Printing values
print(name)       # Alice
print(age)        # 20
print(type(age))  # <class 'int'>

# Type conversion
age_str = str(age)   # "20"
score = float("9.5") # 9.5
count = int(3.9)     # 3  (truncates, doesn't round)`,
    language: 'python',
    output: `Alice
20
<class 'int'>`,
    commonMistakes: [
      'Using a variable before assigning a value (NameError)',
      'Mixing up = (assignment) and == (comparison)',
      'Variable names with spaces — use underscores: my_score not my score',
      'int("hello") raises ValueError — only convert valid numeric strings',
    ],
    keyPoints: [
      'Variables are created on assignment — no declaration needed',
      'Python is case-sensitive: age ≠ Age ≠ AGE',
      'Use descriptive names: student_count not x',
      'type() returns the data type of any value',
    ],
    aiGenerated: true,
  },

  // ── PYTHON: Conditions ──
  {
    id: 'lesson-py-conditions-1',
    topicId: 'py-conditions',
    title: 'Making Decisions with if/elif/else',
    content: `Programs need to make decisions. The **if statement** runs a block of code only when a condition is True.

Python uses **indentation** (4 spaces) to define code blocks — there are no curly braces.

**Comparison operators:**
- \`==\` equal to
- \`!=\` not equal to
- \`>\` greater than, \`<\` less than
- \`>=\` greater than or equal, \`<=\` less than or equal

**Logical operators:** \`and\`, \`or\`, \`not\``,
    codeExample: `score = 75

if score >= 90:
    print("Grade: A")
elif score >= 75:
    print("Grade: B")
elif score >= 60:
    print("Grade: C")
else:
    print("Grade: F")

# Combining conditions
age = 20
has_id = True

if age >= 18 and has_id:
    print("Entry allowed")
else:
    print("Entry denied")`,
    language: 'python',
    output: `Grade: B
Entry allowed`,
    commonMistakes: [
      'Using = instead of == in conditions',
      'Missing the colon : at the end of if/elif/else',
      'Incorrect indentation causing IndentationError',
      'Forgetting that elif is only checked when all previous conditions are False',
    ],
    keyPoints: [
      'Only one branch executes — Python picks the first True condition',
      'else is optional and catches everything else',
      'elif saves nesting compared to multiple if statements',
      'Conditions evaluate to True or False',
    ],
    aiGenerated: true,
  },

  // ── PYTHON: Loops ──
  {
    id: 'lesson-py-loops-1',
    topicId: 'py-loops',
    title: 'Repeating with Loops',
    content: `**Loops** let you repeat a block of code multiple times without writing it out each time.

**for loop** — used when you know how many times to repeat, or when iterating over a collection.

**while loop** — used when you want to repeat until a condition becomes False.

\`range(start, stop, step)\` generates a sequence of numbers — very handy with for loops.`,
    codeExample: `# for loop with range
for i in range(1, 6):    # 1, 2, 3, 4, 5
    print(i)

# for loop over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# while loop
count = 0
while count < 3:
    print("Count:", count)
    count += 1          # Without this, infinite loop!

# break and continue
for n in range(1, 10):
    if n == 5:
        break           # Stop the loop
    if n % 2 == 0:
        continue        # Skip even numbers
    print(n)            # Prints 1, 3`,
    language: 'python',
    output: `1
2
3
4
5
apple
banana
cherry
Count: 0
Count: 1
Count: 2
1
3`,
    commonMistakes: [
      'range(5) gives 0-4, not 1-5',
      'Forgetting to update the while condition → infinite loop',
      'Modifying a list while iterating over it (iterate over a copy instead)',
      'Off-by-one: range(1, n) gives n-1 iterations',
    ],
    keyPoints: [
      'for loops are preferred when the number of iterations is known',
      'while loops are preferred for event-driven repetition',
      'break exits the loop immediately',
      'continue skips to the next iteration',
    ],
    aiGenerated: true,
  },

  // ── PYTHON: Functions ──
  {
    id: 'lesson-py-functions-1',
    topicId: 'py-functions',
    title: 'Writing and Using Functions',
    content: `A **function** is a reusable block of code with a name. Instead of writing the same logic multiple times, you define it once and call it wherever needed.

Define with \`def\`, give it a name, list parameters in parentheses, and add a colon.

Use \`return\` to send a value back to the caller.

**Scope:** Variables defined inside a function are *local* — they don't exist outside.`,
    codeExample: `# Simple function
def greet(name):
    message = "Hello, " + name + "!"
    return message

result = greet("Alice")
print(result)         # Hello, Alice!

# Default parameters
def power(base, exponent=2):
    return base ** exponent

print(power(3))       # 9  (uses default exponent)
print(power(2, 10))   # 1024

# Multiple return values
def min_max(numbers):
    return min(numbers), max(numbers)

lo, hi = min_max([4, 1, 9, 2])
print(lo, hi)         # 1 9`,
    language: 'python',
    output: `Hello, Alice!
9
1024
1 9`,
    commonMistakes: [
      'Forgetting return — the function returns None silently',
      'Calling a function before defining it (though Python reads the file top-to-bottom)',
      'Confusing parameters (in the definition) with arguments (the values passed in)',
      'Modifying a global variable inside a function without the global keyword',
    ],
    keyPoints: [
      'Functions avoid code duplication (DRY — Do not Repeat Yourself)',
      'Parameters are local to the function',
      'Default values make parameters optional',
      'A function can return multiple values as a tuple',
    ],
    aiGenerated: true,
  },

  // ── PYTHON: Lists ──
  {
    id: 'lesson-py-lists-1',
    topicId: 'py-lists',
    title: 'Working with Lists',
    content: `A **list** is an ordered, mutable collection of items. Lists can hold any mix of types and can grow or shrink at runtime.

Items are accessed by **index** starting at 0. Negative indices count from the end.

**Slicing** lets you extract a sub-list: \`my_list[start:end]\`.`,
    codeExample: `# Creating a list
scores = [85, 92, 78, 95, 88]

print(scores[0])       # 85  (first element)
print(scores[-1])      # 88  (last element)
print(scores[1:4])     # [92, 78, 95]  (slice)

# Modifying lists
scores.append(100)     # Add to end
scores.insert(0, 70)   # Insert at index 0
scores.remove(78)      # Remove first occurrence of 78
popped = scores.pop()  # Remove & return last item

# Useful operations
print(len(scores))     # Length
print(sum(scores))     # Sum
print(sorted(scores))  # Returns sorted copy

# Iterating
for score in scores:
    if score >= 90:
        print(score, "- Excellent!")`,
    language: 'python',
    output: `85
88
[92, 78, 95]
5
440
[70, 85, 88, 92, 95]
92 - Excellent!
95 - Excellent!`,
    commonMistakes: [
      'IndexError when accessing an index beyond the list length',
      'sort() sorts in-place and returns None; sorted() returns a new list',
      'Copying a list: b = a copies the reference; use b = a.copy() or b = a[:]',
      'remove() removes the first match, not all occurrences',
    ],
    keyPoints: [
      'Lists are zero-indexed',
      'Lists are mutable — you can change, add, and remove items',
      'append() adds one item; extend() adds all items from another list',
      'in operator checks membership: "x" in my_list',
    ],
    aiGenerated: true,
  },

  // ── JAVA: Variables ──
  {
    id: 'lesson-java-variables-1',
    topicId: 'java-variables',
    title: 'Java Variables & Primitive Types',
    content: `Java is a **statically typed** language — you must declare the type of every variable before using it.

**Primitive types** are the building blocks:
- \`int\` — whole numbers (−2B to +2B)
- \`double\` — decimal numbers
- \`boolean\` — true or false
- \`char\` — a single character
- \`long\`, \`float\`, \`short\`, \`byte\` — other numeric types

**String** (with a capital S) is not a primitive — it's an object, but used like one.`,
    codeExample: `public class Variables {
    public static void main(String[] args) {
        int age = 20;
        double height = 5.9;
        boolean isStudent = true;
        char grade = 'A';
        String name = "Alice";

        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Grade: " + grade);

        // Type casting
        double d = 9.99;
        int i = (int) d;   // Truncates to 9
        System.out.println(i);

        // Final (constant) variable
        final double PI = 3.14159;
        System.out.println(PI);
    }
}`,
    language: 'java',
    output: `Name: Alice
Age: 20
Grade: A
9
3.14159`,
    commonMistakes: [
      'Forgetting semicolons at the end of statements',
      'Using = instead of == for comparison',
      'Dividing two ints: 5/2 gives 2, not 2.5 — cast first: (double)5/2',
      'String comparison: use .equals() not == for String objects',
    ],
    keyPoints: [
      'Java requires type declarations — no implicit typing',
      'final makes a variable a constant',
      'Use System.out.println() to print to the console',
      'String concatenation uses the + operator',
    ],
    aiGenerated: true,
  },

  // ── C++: Pointers ──
  {
    id: 'lesson-cpp-pointers-1',
    topicId: 'cpp-pointers',
    title: 'Understanding Pointers',
    content: `A **pointer** is a variable that stores the **memory address** of another variable rather than a direct value.

- \`&variable\` gives you the address of a variable
- \`int* ptr\` declares a pointer to an int
- \`*ptr\` dereferences the pointer — accesses the value at that address

Pointers are fundamental to C++ for dynamic memory, arrays, and passing large objects efficiently.`,
    codeExample: `#include <iostream>
using namespace std;

int main() {
    int x = 42;
    int* ptr = &x;     // ptr holds the address of x

    cout << "Value of x:     " << x << endl;
    cout << "Address of x:   " << &x << endl;
    cout << "ptr holds:      " << ptr << endl;
    cout << "Value via ptr:  " << *ptr << endl;

    // Modify x through the pointer
    *ptr = 100;
    cout << "x is now: " << x << endl;

    // Pointer arithmetic
    int arr[] = {10, 20, 30};
    int* p = arr;
    cout << *p << endl;     // 10
    cout << *(p+1) << endl; // 20
    cout << *(p+2) << endl; // 30

    return 0;
}`,
    language: 'cpp',
    output: `Value of x:     42
Address of x:   0x7ffd...
ptr holds:      0x7ffd...
Value via ptr:  42
x is now: 100
10
20
30`,
    commonMistakes: [
      'Dereferencing a null or uninitialised pointer → crash',
      'Forgetting the * when declaring: int* p not int p',
      'Confusing & (address-of) with * (dereference)',
      'Memory leaks from forgetting to delete dynamically allocated memory',
    ],
    keyPoints: [
      'Pointers store memory addresses, not values',
      '& (address-of) and * (dereference) are inverse operations',
      'Array name is essentially a pointer to the first element',
      'Always initialise pointers before use — or set to nullptr',
    ],
    aiGenerated: true,
  },
];
