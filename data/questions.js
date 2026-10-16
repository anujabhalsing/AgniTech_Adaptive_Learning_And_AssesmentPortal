// SkillTrace AI — Quiz Questions
// AI-generated questions with verified answer keys. [AI-Generated]
const QUESTIONS = [
  // ═══════════════════════════════════════════════════════ PYTHON VARIABLES
  {
    id: "q_pv_1",
    topicId: "py_variables",
    langId: "python",
    type: "mcq",
    difficulty: "beginner",
    text: "Which of the following correctly declares a string variable in Python?",
    options: [
      { id: "a", text: 'name = "Alice"' },
      { id: "b", text: 'String name = "Alice"' },
      { id: "c", text: "name : string = Alice" },
      { id: "d", text: "var name = Alice" }
    ],
    correct: "a",
    explanation: "Python uses simple assignment without a type keyword. String values go inside quotes.",
    xp: 10
  },
  {
    id: "q_pv_2",
    topicId: "py_variables",
    langId: "python",
    type: "output",
    difficulty: "beginner",
    text: "What does this code print?",
    code: `x = 5
y = 2
print(x + y)`,
    options: [
      { id: "a", text: "52" },
      { id: "b", text: "7" },
      { id: "c", text: "x + y" },
      { id: "d", text: "Error" }
    ],
    correct: "b",
    explanation: "x and y are both integers, so + performs addition, giving 7.",
    xp: 10
  },
  {
    id: "q_pv_3",
    topicId: "py_variables",
    langId: "python",
    type: "mcq",
    difficulty: "beginner",
    text: "What does int('42') return?",
    options: [
      { id: "a", text: '"42" (a string)' },
      { id: "b", text: "42 (an integer)" },
      { id: "c", text: "42.0 (a float)" },
      { id: "d", text: "TypeError" }
    ],
    correct: "b",
    explanation: "int() converts a numeric string to an integer.",
    xp: 10
  },
  {
    id: "q_pv_4",
    topicId: "py_variables",
    langId: "python",
    type: "bug",
    difficulty: "beginner",
    text: "Find the bug in this code:",
    code: `age = 16
message = "You are " + age + " years old."
print(message)`,
    options: [
      { id: "a", text: 'age should be declared as String age = 16' },
      { id: "b", text: "Cannot concatenate str and int directly — use str(age)" },
      { id: "c", text: "print() is not a valid function" },
      { id: "d", text: "There is no bug" }
    ],
    correct: "b",
    explanation: "In Python you cannot add a string and an integer with +. Use str(age) to convert first.",
    xp: 15
  },
  {
    id: "q_pv_5",
    topicId: "py_variables",
    langId: "python",
    type: "fillin",
    difficulty: "beginner",
    text: "Complete this code to convert the string '3.14' to a float:",
    code: `pi = ___('3.14')
print(pi)  # should print 3.14`,
    options: [
      { id: "a", text: "int" },
      { id: "b", text: "str" },
      { id: "c", text: "float" },
      { id: "d", text: "convert" }
    ],
    correct: "c",
    explanation: "float() converts a string like '3.14' to the floating-point number 3.14.",
    xp: 10
  },

  // ═══════════════════════════════════════════════════════ PYTHON CONDITIONS
  {
    id: "q_pc_1",
    topicId: "py_conditions",
    langId: "python",
    type: "output",
    difficulty: "beginner",
    text: "What will this code print?",
    code: `x = 10
if x > 5:
    print("Big")
else:
    print("Small")`,
    options: [
      { id: "a", text: "Big" },
      { id: "b", text: "Small" },
      { id: "c", text: "Both Big and Small" },
      { id: "d", text: "Nothing" }
    ],
    correct: "a",
    explanation: "10 > 5 is True, so the if branch executes and prints 'Big'.",
    xp: 10
  },
  {
    id: "q_pc_2",
    topicId: "py_conditions",
    langId: "python",
    type: "mcq",
    difficulty: "beginner",
    text: "Which operator checks if two values are NOT equal in Python?",
    options: [
      { id: "a", text: "==" },
      { id: "b", text: "!=" },
      { id: "c", text: "<>" },
      { id: "d", text: "=/=" }
    ],
    correct: "b",
    explanation: "!= is the not-equal operator in Python. == checks equality.",
    xp: 10
  },
  {
    id: "q_pc_3",
    topicId: "py_conditions",
    langId: "python",
    type: "bug",
    difficulty: "beginner",
    text: "Spot the bug:",
    code: `score = 85
if score = 100:
    print("Perfect!")`,
    options: [
      { id: "a", text: "score should be a string" },
      { id: "b", text: "= should be == for comparison" },
      { id: "c", text: "Missing else clause" },
      { id: "d", text: "print uses wrong quotes" }
    ],
    correct: "b",
    explanation: "Single = is assignment. For comparison inside conditions, use == (double equals).",
    xp: 15
  },
  {
    id: "q_pc_4",
    topicId: "py_conditions",
    langId: "python",
    type: "output",
    difficulty: "beginner",
    text: "What does this print?",
    code: `a = 5
b = 10
if a > 3 and b < 20:
    print("Yes")
else:
    print("No")`,
    options: [
      { id: "a", text: "Yes" },
      { id: "b", text: "No" },
      { id: "c", text: "Error" },
      { id: "d", text: "Nothing" }
    ],
    correct: "a",
    explanation: "Both conditions are True (5 > 3 and 10 < 20), so 'and' produces True and 'Yes' is printed.",
    xp: 10
  },

  // ═══════════════════════════════════════════════════════ PYTHON LOOPS
  {
    id: "q_pl_1",
    topicId: "py_loops",
    langId: "python",
    type: "output",
    difficulty: "beginner",
    text: "How many times does this loop print?",
    code: `for i in range(3):
    print("hello")`,
    options: [
      { id: "a", text: "2 times" },
      { id: "b", text: "3 times" },
      { id: "c", text: "4 times" },
      { id: "d", text: "0 times" }
    ],
    correct: "b",
    explanation: "range(3) produces 0, 1, 2 — three values — so the loop body runs three times.",
    xp: 10
  },
  {
    id: "q_pl_2",
    topicId: "py_loops",
    langId: "python",
    type: "output",
    difficulty: "beginner",
    text: "What does this print?",
    code: `total = 0
for i in range(1, 4):
    total += i
print(total)`,
    options: [
      { id: "a", text: "3" },
      { id: "b", text: "6" },
      { id: "c", text: "10" },
      { id: "d", text: "0" }
    ],
    correct: "b",
    explanation: "range(1, 4) gives 1, 2, 3. 1 + 2 + 3 = 6.",
    xp: 10
  },
  {
    id: "q_pl_3",
    topicId: "py_loops",
    langId: "python",
    type: "mcq",
    difficulty: "beginner",
    text: "Which keyword stops a loop immediately?",
    options: [
      { id: "a", text: "stop" },
      { id: "b", text: "end" },
      { id: "c", text: "break" },
      { id: "d", text: "exit" }
    ],
    correct: "c",
    explanation: "break exits the innermost loop immediately. continue skips the rest of the current iteration.",
    xp: 10
  },
  {
    id: "q_pl_4",
    topicId: "py_loops",
    langId: "python",
    type: "bug",
    difficulty: "intermediate",
    text: "This while loop is broken. What is wrong?",
    code: `count = 0
while count < 5:
    print(count)`,
    options: [
      { id: "a", text: "while should be if" },
      { id: "b", text: "count is never incremented — infinite loop" },
      { id: "c", text: "print() is missing parentheses" },
      { id: "d", text: "count should start at 1" }
    ],
    correct: "b",
    explanation: "count stays 0 forever because there is no count += 1 inside the loop — creating an infinite loop.",
    xp: 15
  },

  // ═══════════════════════════════════════════════════════ PYTHON FUNCTIONS
  {
    id: "q_pf_1",
    topicId: "py_functions",
    langId: "python",
    type: "output",
    difficulty: "beginner",
    text: "What does this print?",
    code: `def double(n):
    return n * 2

print(double(5))`,
    options: [
      { id: "a", text: "5" },
      { id: "b", text: "10" },
      { id: "c", text: "25" },
      { id: "d", text: "Error" }
    ],
    correct: "b",
    explanation: "double(5) returns 5 * 2 = 10.",
    xp: 10
  },
  {
    id: "q_pf_2",
    topicId: "py_functions",
    langId: "python",
    type: "mcq",
    difficulty: "beginner",
    text: "What does a function return if there is no return statement?",
    options: [
      { id: "a", text: "0" },
      { id: "b", text: "False" },
      { id: "c", text: "None" },
      { id: "d", text: "An error" }
    ],
    correct: "c",
    explanation: "A function without a return statement implicitly returns None in Python.",
    xp: 10
  },
  {
    id: "q_pf_3",
    topicId: "py_functions",
    langId: "python",
    type: "output",
    difficulty: "beginner",
    text: "What does this print?",
    code: `def greet(name="World"):
    return "Hello, " + name + "!"

print(greet("Python"))
print(greet())`,
    options: [
      { id: "a", text: "Hello, Python!\nHello, World!" },
      { id: "b", text: "Hello, World!\nHello, Python!" },
      { id: "c", text: "Hello, Python!\nError" },
      { id: "d", text: "Hello, name!" }
    ],
    correct: "a",
    explanation: "First call passes 'Python' overriding the default. Second call uses the default 'World'.",
    xp: 10
  },

  // ═══════════════════════════════════════════════════════ PYTHON LISTS
  {
    id: "q_pli_1",
    topicId: "py_lists",
    langId: "python",
    type: "output",
    difficulty: "beginner",
    text: "What does this print?",
    code: `items = ["a", "b", "c", "d"]
print(items[1])`,
    options: [
      { id: "a", text: "a" },
      { id: "b", text: "b" },
      { id: "c", text: "c" },
      { id: "d", text: "1" }
    ],
    correct: "b",
    explanation: "List indices start at 0, so items[1] is the second element, 'b'.",
    xp: 10
  },
  {
    id: "q_pli_2",
    topicId: "py_lists",
    langId: "python",
    type: "output",
    difficulty: "beginner",
    text: "What is the length of this list after these operations?",
    code: `nums = [1, 2, 3]
nums.append(4)
nums.remove(2)
print(len(nums))`,
    options: [
      { id: "a", text: "2" },
      { id: "b", text: "3" },
      { id: "c", text: "4" },
      { id: "d", text: "5" }
    ],
    correct: "b",
    explanation: "Start: [1,2,3] (length 3). After append(4): [1,2,3,4] (4). After remove(2): [1,3,4] (3).",
    xp: 10
  },

  // ═══════════════════════════════════════════════════════ JAVA VARIABLES
  {
    id: "q_jv_1",
    topicId: "java_variables",
    langId: "java",
    type: "mcq",
    difficulty: "beginner",
    text: "Which data type stores a whole number in Java?",
    options: [
      { id: "a", text: "double" },
      { id: "b", text: "String" },
      { id: "c", text: "int" },
      { id: "d", text: "float" }
    ],
    correct: "c",
    explanation: "int stores 32-bit whole numbers. double and float store decimals. String stores text.",
    xp: 10
  },
  {
    id: "q_jv_2",
    topicId: "java_variables",
    langId: "java",
    type: "bug",
    difficulty: "beginner",
    text: "What is wrong with this Java code?",
    code: `String name = "Alice"
System.out.println(name);`,
    options: [
      { id: "a", text: "String should be lowercase" },
      { id: "b", text: "Missing semicolon after the string declaration" },
      { id: "c", text: "println is not a valid method" },
      { id: "d", text: "Nothing is wrong" }
    ],
    correct: "b",
    explanation: "Every Java statement must end with a semicolon. The first line is missing ;",
    xp: 15
  },
  {
    id: "q_jv_3",
    topicId: "java_variables",
    langId: "java",
    type: "output",
    difficulty: "beginner",
    text: "What does this print?",
    code: `int x = 10;
double y = x;
System.out.println(y);`,
    options: [
      { id: "a", text: "10" },
      { id: "b", text: "10.0" },
      { id: "c", text: "Error" },
      { id: "d", text: "0.0" }
    ],
    correct: "b",
    explanation: "Widening conversion from int to double is automatic. 10 becomes 10.0.",
    xp: 10
  },

  // ═══════════════════════════════════════════════════════ JAVA CONDITIONS
  {
    id: "q_jc_1",
    topicId: "java_conditions",
    langId: "java",
    type: "output",
    difficulty: "beginner",
    text: "What is printed?",
    code: `int n = 4;
for (int i = 1; i <= n; i++) {
    System.out.print(i + " ");
}`,
    options: [
      { id: "a", text: "1 2 3 4 5" },
      { id: "b", text: "1 2 3 4" },
      { id: "c", text: "0 1 2 3" },
      { id: "d", text: "1 2 3" }
    ],
    correct: "b",
    explanation: "i starts at 1 and runs while i <= 4, so it prints 1, 2, 3, 4.",
    xp: 10
  },
  {
    id: "q_jc_2",
    topicId: "java_conditions",
    langId: "java",
    type: "mcq",
    difficulty: "beginner",
    text: "In Java, what type must a condition in an if statement evaluate to?",
    options: [
      { id: "a", text: "int" },
      { id: "b", text: "String" },
      { id: "c", text: "boolean" },
      { id: "d", text: "Any type" }
    ],
    correct: "c",
    explanation: "Unlike C/C++, Java if conditions must be exactly boolean — non-zero integers are NOT treated as true.",
    xp: 10
  },

  // ═══════════════════════════════════════════════════════ JAVA CLASSES
  {
    id: "q_jcl_1",
    topicId: "java_classes",
    langId: "java",
    type: "mcq",
    difficulty: "intermediate",
    text: "What keyword creates a new object in Java?",
    options: [
      { id: "a", text: "create" },
      { id: "b", text: "new" },
      { id: "c", text: "object" },
      { id: "d", text: "alloc" }
    ],
    correct: "b",
    explanation: "new allocates memory on the heap and calls the constructor to initialise the object.",
    xp: 10
  },
  {
    id: "q_jcl_2",
    topicId: "java_classes",
    langId: "java",
    type: "mcq",
    difficulty: "intermediate",
    text: "Inside a constructor, what does 'this' refer to?",
    options: [
      { id: "a", text: "The superclass" },
      { id: "b", text: "The current object being created" },
      { id: "c", text: "The calling method" },
      { id: "d", text: "A static field" }
    ],
    correct: "b",
    explanation: "this refers to the current object instance — useful to distinguish between fields and parameters with the same name.",
    xp: 10
  },

  // ═══════════════════════════════════════════════════════ C++ VARIABLES
  {
    id: "q_cv_1",
    topicId: "cpp_variables",
    langId: "cpp",
    type: "output",
    difficulty: "beginner",
    text: "What does this C++ code output?",
    code: `int a = 7;
int b = 2;
cout << a / b;`,
    options: [
      { id: "a", text: "3.5" },
      { id: "b", text: "3" },
      { id: "c", text: "4" },
      { id: "d", text: "Error" }
    ],
    correct: "b",
    explanation: "Integer division truncates the decimal part. 7 / 2 = 3 (not 3.5).",
    xp: 10
  },
  {
    id: "q_cv_2",
    topicId: "cpp_variables",
    langId: "cpp",
    type: "mcq",
    difficulty: "beginner",
    text: "Which keyword prevents a variable from being modified after initialisation in C++?",
    options: [
      { id: "a", text: "static" },
      { id: "b", text: "final" },
      { id: "c", text: "const" },
      { id: "d", text: "readonly" }
    ],
    correct: "c",
    explanation: "const in C++ prevents reassignment. Java uses final; Python has no true constants.",
    xp: 10
  },

  // ═══════════════════════════════════════════════════════ C++ POINTERS
  {
    id: "q_cp_1",
    topicId: "cpp_pointers",
    langId: "cpp",
    type: "mcq",
    difficulty: "advanced",
    text: "What does the & operator do when applied to a variable?",
    options: [
      { id: "a", text: "Multiplies it by 2" },
      { id: "b", text: "Returns its memory address" },
      { id: "c", text: "Creates a copy of it" },
      { id: "d", text: "Converts it to a boolean" }
    ],
    correct: "b",
    explanation: "& is the address-of operator. int* p = &x; stores the address of x in pointer p.",
    xp: 15
  },
  {
    id: "q_cp_2",
    topicId: "cpp_pointers",
    langId: "cpp",
    type: "output",
    difficulty: "advanced",
    text: "What is printed?",
    code: `int val = 10;
int* ptr = &val;
*ptr = 25;
cout << val;`,
    options: [
      { id: "a", text: "10" },
      { id: "b", text: "25" },
      { id: "c", text: "address" },
      { id: "d", text: "Error" }
    ],
    correct: "b",
    explanation: "*ptr = 25 writes 25 to the memory location pointed to by ptr, which is val. So val becomes 25.",
    xp: 15
  },

  // ═══════════════════════════════════════════════════════ JAVASCRIPT
  {
    id: "q_jsv_1",
    topicId: "js_variables",
    langId: "javascript",
    type: "mcq",
    difficulty: "beginner",
    text: "Which keyword declares a block-scoped, reassignable variable in modern JavaScript?",
    options: [
      { id: "a", text: "var" },
      { id: "b", text: "let" },
      { id: "c", text: "const" },
      { id: "d", text: "def" }
    ],
    correct: "b",
    explanation: "let is block-scoped and can be reassigned. const is block-scoped but cannot be reassigned. var is function-scoped and generally avoided in modern code.",
    xp: 10
  },
  {
    id: "q_jsv_2",
    topicId: "js_variables",
    langId: "javascript",
    type: "output",
    difficulty: "beginner",
    text: "What does this print?",
    code: `let x = 5;
let y = "5";
console.log(x == y);
console.log(x === y);`,
    options: [
      { id: "a", text: "true\ntrue" },
      { id: "b", text: "false\nfalse" },
      { id: "c", text: "true\nfalse" },
      { id: "d", text: "false\ntrue" }
    ],
    correct: "c",
    explanation: "== performs type coercion (5 == '5' is true). === checks both value AND type (5 === '5' is false because number ≠ string).",
    xp: 15
  },

  // ═══════════════════════════════════════════════════════ SQL
  {
    id: "q_sql_1",
    topicId: "sql_select",
    langId: "sql",
    type: "mcq",
    difficulty: "beginner",
    text: "Which SQL statement retrieves all columns from a table called 'students'?",
    options: [
      { id: "a", text: "GET ALL FROM students" },
      { id: "b", text: "SELECT * FROM students" },
      { id: "c", text: "FETCH students" },
      { id: "d", text: "SHOW TABLE students" }
    ],
    correct: "b",
    explanation: "SELECT * FROM tablename retrieves all columns. * is a wildcard meaning 'all columns'.",
    xp: 10
  },
  {
    id: "q_sql_2",
    topicId: "sql_where",
    langId: "sql",
    type: "mcq",
    difficulty: "beginner",
    text: "Which query returns only students with age greater than 18?",
    options: [
      { id: "a", text: "SELECT * FROM students IF age > 18" },
      { id: "b", text: "SELECT * FROM students WHERE age > 18" },
      { id: "c", text: "SELECT * FROM students HAVING age > 18" },
      { id: "d", text: "FILTER students WHERE age > 18" }
    ],
    correct: "b",
    explanation: "WHERE filters rows before they are returned. HAVING is used with GROUP BY for aggregate conditions.",
    xp: 10
  },
  {
    id: "q_sql_3",
    topicId: "sql_joins",
    langId: "sql",
    type: "mcq",
    difficulty: "intermediate",
    text: "Which JOIN returns only rows that have matching values in BOTH tables?",
    options: [
      { id: "a", text: "LEFT JOIN" },
      { id: "b", text: "RIGHT JOIN" },
      { id: "c", text: "INNER JOIN" },
      { id: "d", text: "FULL OUTER JOIN" }
    ],
    correct: "c",
    explanation: "INNER JOIN returns only rows where the join condition matches in both tables. LEFT JOIN includes all rows from the left table even without a match.",
    xp: 15
  },

  // ═══════════════════════════════════════════════════════ DSA
  {
    id: "q_dsa_1",
    topicId: "dsa_searching",
    langId: "dsa",
    type: "mcq",
    difficulty: "beginner",
    text: "What is the time complexity of binary search?",
    options: [
      { id: "a", text: "O(n)" },
      { id: "b", text: "O(n²)" },
      { id: "c", text: "O(log n)" },
      { id: "d", text: "O(1)" }
    ],
    correct: "c",
    explanation: "Binary search halves the search space with each step, giving O(log n) time — much faster than linear search O(n) on large sorted arrays.",
    xp: 15
  },
  {
    id: "q_dsa_2",
    topicId: "dsa_arrays",
    langId: "dsa",
    type: "mcq",
    difficulty: "beginner",
    text: "What is the time complexity of accessing an element in an array by its index?",
    options: [
      { id: "a", text: "O(n)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(1)" },
      { id: "d", text: "O(n²)" }
    ],
    correct: "c",
    explanation: "Arrays store elements contiguously in memory, so computing the address from an index takes constant O(1) time regardless of array size.",
    xp: 10
  },
  {
    id: "q_dsa_3",
    topicId: "dsa_stacks_queues",
    langId: "dsa",
    type: "mcq",
    difficulty: "intermediate",
    text: "Which data structure follows the LIFO (Last In, First Out) principle?",
    options: [
      { id: "a", text: "Queue" },
      { id: "b", text: "Stack" },
      { id: "c", text: "Linked List" },
      { id: "d", text: "Binary Tree" }
    ],
    correct: "b",
    explanation: "A stack uses LIFO — the last item pushed is the first to be popped. Think of a stack of plates.",
    xp: 10
  }
];
