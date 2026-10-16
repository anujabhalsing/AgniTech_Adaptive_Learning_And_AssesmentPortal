// SkillTrace AI — Topic Definitions
// AI-generated content. Topics are separated from UI for easy expansion.
const TOPICS = [
  // ── PYTHON ──────────────────────────────────────────────────────────
  {
    id: "py_variables",
    langId: "python",
    title: "Variables & Data Types",
    icon: "📦",
    difficulty: "beginner",
    prerequisites: [],
    estimatedMinutes: 15,
    objectives: [
      "Declare variables in Python",
      "Understand int, float, str, and bool types",
      "Use type() and type conversion functions"
    ],
    summary: "Variables are named containers that store data. Python infers the type automatically.",
    xpReward: 50
  },
  {
    id: "py_conditions",
    langId: "python",
    title: "Conditions & If Statements",
    icon: "🔀",
    difficulty: "beginner",
    prerequisites: ["py_variables"],
    estimatedMinutes: 20,
    objectives: [
      "Write if, elif, and else statements",
      "Use comparison and logical operators",
      "Understand indentation rules"
    ],
    summary: "Conditions let your program make decisions based on data.",
    xpReward: 60
  },
  {
    id: "py_loops",
    langId: "python",
    title: "Loops",
    icon: "🔄",
    difficulty: "beginner",
    prerequisites: ["py_conditions"],
    estimatedMinutes: 25,
    objectives: [
      "Use for loops with range() and lists",
      "Use while loops",
      "Apply break and continue"
    ],
    summary: "Loops let you repeat actions without rewriting code.",
    xpReward: 70
  },
  {
    id: "py_functions",
    langId: "python",
    title: "Functions",
    icon: "🧩",
    difficulty: "beginner",
    prerequisites: ["py_loops"],
    estimatedMinutes: 30,
    objectives: [
      "Define and call functions",
      "Use parameters and return values",
      "Understand scope and default arguments"
    ],
    summary: "Functions group reusable blocks of code under a name.",
    xpReward: 80
  },
  {
    id: "py_lists",
    langId: "python",
    title: "Lists",
    icon: "📋",
    difficulty: "beginner",
    prerequisites: ["py_functions"],
    estimatedMinutes: 25,
    objectives: [
      "Create and index lists",
      "Use list methods: append, remove, sort",
      "Iterate over lists with loops"
    ],
    summary: "Lists store ordered collections of items in a single variable.",
    xpReward: 75
  },
  // ── JAVA ──────────────────────────────────────────────────────────────
  {
    id: "java_variables",
    langId: "java",
    title: "Variables & Data Types",
    icon: "📦",
    difficulty: "beginner",
    prerequisites: [],
    estimatedMinutes: 20,
    objectives: [
      "Declare typed variables in Java",
      "Understand int, double, String, boolean",
      "Use casting between types"
    ],
    summary: "Java is statically typed — every variable needs a declared type.",
    xpReward: 50
  },
  {
    id: "java_conditions",
    langId: "java",
    title: "Conditions & Loops",
    icon: "🔄",
    difficulty: "beginner",
    prerequisites: ["java_variables"],
    estimatedMinutes: 25,
    objectives: [
      "Write if/else and switch statements",
      "Use for, while, and do-while loops",
      "Apply break and continue"
    ],
    summary: "Control flow tells your program what to do and when to repeat.",
    xpReward: 65
  },
  {
    id: "java_classes",
    langId: "java",
    title: "Classes & Objects",
    icon: "🏗️",
    difficulty: "intermediate",
    prerequisites: ["java_conditions"],
    estimatedMinutes: 35,
    objectives: [
      "Define classes with fields and methods",
      "Instantiate objects with new",
      "Use constructors and this keyword"
    ],
    summary: "Classes are blueprints; objects are the real-world instances built from them.",
    xpReward: 90
  },
  {
    id: "java_inheritance",
    langId: "java",
    title: "Inheritance",
    icon: "🧬",
    difficulty: "intermediate",
    prerequisites: ["java_classes"],
    estimatedMinutes: 35,
    objectives: [
      "Extend classes with extends keyword",
      "Override methods with @Override",
      "Use super to call parent behaviour"
    ],
    summary: "Inheritance lets a class reuse and extend behaviour from another class.",
    xpReward: 95
  },
  {
    id: "java_polymorphism",
    langId: "java",
    title: "Polymorphism",
    icon: "🎭",
    difficulty: "intermediate",
    prerequisites: ["java_inheritance"],
    estimatedMinutes: 30,
    objectives: [
      "Understand runtime vs compile-time polymorphism",
      "Use method overriding",
      "Reference a subclass object through a parent type"
    ],
    summary: "Polymorphism lets the same method name behave differently depending on the object.",
    xpReward: 100
  },
  // ── C++ ───────────────────────────────────────────────────────────────
  {
    id: "cpp_variables",
    langId: "cpp",
    title: "Variables & Data Types",
    icon: "📦",
    difficulty: "beginner",
    prerequisites: [],
    estimatedMinutes: 20,
    objectives: [
      "Declare typed variables in C++",
      "Understand int, double, char, bool",
      "Use cout for output"
    ],
    summary: "C++ requires explicit types and uses cout to display output.",
    xpReward: 50
  },
  {
    id: "cpp_conditions",
    langId: "cpp",
    title: "Conditions & Loops",
    icon: "🔄",
    difficulty: "beginner",
    prerequisites: ["cpp_variables"],
    estimatedMinutes: 25,
    objectives: [
      "Write if/else and switch in C++",
      "Use for, while, do-while loops",
      "Apply break and continue"
    ],
    summary: "Control flow structures in C++ are similar to other languages but have strict syntax.",
    xpReward: 65
  },
  {
    id: "cpp_functions",
    langId: "cpp",
    title: "Functions",
    icon: "🧩",
    difficulty: "beginner",
    prerequisites: ["cpp_conditions"],
    estimatedMinutes: 30,
    objectives: [
      "Define and call functions",
      "Use return types and parameters",
      "Understand function prototypes"
    ],
    summary: "Functions in C++ must declare a return type and can be declared before use.",
    xpReward: 75
  },
  {
    id: "cpp_arrays",
    langId: "cpp",
    title: "Arrays",
    icon: "📊",
    difficulty: "intermediate",
    prerequisites: ["cpp_functions"],
    estimatedMinutes: 30,
    objectives: [
      "Declare and initialize arrays",
      "Access elements by index",
      "Iterate over arrays with loops"
    ],
    summary: "Arrays hold a fixed number of elements of the same type in contiguous memory.",
    xpReward: 80
  },
  {
    id: "cpp_pointers",
    langId: "cpp",
    title: "Pointers",
    icon: "👉",
    difficulty: "advanced",
    prerequisites: ["cpp_arrays"],
    estimatedMinutes: 40,
    objectives: [
      "Understand memory addresses and pointers",
      "Use & and * operators",
      "Pass pointers to functions"
    ],
    summary: "Pointers store memory addresses, giving you direct control over data in memory.",
    xpReward: 110
  },
  // ── JAVASCRIPT ────────────────────────────────────────────────────────
  {
    id: "js_variables",
    langId: "javascript",
    title: "Variables & Types",
    icon: "📦",
    difficulty: "beginner",
    prerequisites: [],
    estimatedMinutes: 15,
    objectives: [
      "Use let, const, and var",
      "Understand dynamic typing",
      "Use typeof to inspect types"
    ],
    summary: "JavaScript variables are dynamically typed — the type is determined at runtime.",
    xpReward: 50
  },
  {
    id: "js_functions",
    langId: "javascript",
    title: "Functions",
    icon: "🧩",
    difficulty: "beginner",
    prerequisites: ["js_variables"],
    estimatedMinutes: 20,
    objectives: [
      "Write function declarations and expressions",
      "Use arrow functions",
      "Understand closures at a basic level"
    ],
    summary: "Functions are first-class citizens in JavaScript — they can be passed and returned.",
    xpReward: 65
  },
  {
    id: "js_arrays",
    langId: "javascript",
    title: "Arrays",
    icon: "📋",
    difficulty: "beginner",
    prerequisites: ["js_functions"],
    estimatedMinutes: 20,
    objectives: [
      "Create and manipulate arrays",
      "Use map, filter, and forEach",
      "Spread and destructure arrays"
    ],
    summary: "JavaScript arrays are dynamic and come with powerful built-in methods.",
    xpReward: 70
  },
  {
    id: "js_dom",
    langId: "javascript",
    title: "DOM Basics",
    icon: "🌐",
    difficulty: "intermediate",
    prerequisites: ["js_arrays"],
    estimatedMinutes: 25,
    objectives: [
      "Select elements with querySelector",
      "Modify text and attributes",
      "Create and append elements"
    ],
    summary: "The DOM lets JavaScript interact with and modify HTML on a live page.",
    xpReward: 80
  },
  {
    id: "js_events",
    langId: "javascript",
    title: "Events",
    icon: "⚡",
    difficulty: "intermediate",
    prerequisites: ["js_dom"],
    estimatedMinutes: 25,
    objectives: [
      "Add event listeners",
      "Understand event bubbling",
      "Prevent default behaviour"
    ],
    summary: "Events let you respond to user actions like clicks, key presses, and form submissions.",
    xpReward: 80
  },
  // ── HTML/CSS ──────────────────────────────────────────────────────────
  {
    id: "html_structure",
    langId: "html_css",
    title: "HTML Structure",
    icon: "🏗️",
    difficulty: "beginner",
    prerequisites: [],
    estimatedMinutes: 15,
    objectives: [
      "Understand the HTML document structure",
      "Use semantic tags: header, main, footer",
      "Nest elements correctly"
    ],
    summary: "HTML provides the skeleton of every web page using nested tags.",
    xpReward: 40
  },
  {
    id: "html_forms",
    langId: "html_css",
    title: "Headings, Forms & Links",
    icon: "📝",
    difficulty: "beginner",
    prerequisites: ["html_structure"],
    estimatedMinutes: 20,
    objectives: [
      "Use heading tags h1–h6",
      "Build a form with input and button",
      "Create links with anchor tags"
    ],
    summary: "Forms collect user data; headings and links structure content and navigation.",
    xpReward: 50
  },
  {
    id: "css_selectors",
    langId: "html_css",
    title: "CSS Selectors",
    icon: "🎯",
    difficulty: "beginner",
    prerequisites: ["html_forms"],
    estimatedMinutes: 20,
    objectives: [
      "Use element, class, and ID selectors",
      "Apply pseudo-classes like :hover",
      "Understand specificity"
    ],
    summary: "Selectors tell the browser which HTML elements to style.",
    xpReward: 55
  },
  {
    id: "css_boxmodel",
    langId: "html_css",
    title: "Box Model",
    icon: "📐",
    difficulty: "beginner",
    prerequisites: ["css_selectors"],
    estimatedMinutes: 20,
    objectives: [
      "Understand margin, border, padding, content",
      "Use box-sizing: border-box",
      "Control element dimensions"
    ],
    summary: "Every HTML element is a box — understanding the box model is key to layout.",
    xpReward: 60
  },
  {
    id: "css_flexbox",
    langId: "html_css",
    title: "Flexbox Layout",
    icon: "📦",
    difficulty: "intermediate",
    prerequisites: ["css_boxmodel"],
    estimatedMinutes: 25,
    objectives: [
      "Create flex containers and items",
      "Use justify-content and align-items",
      "Build a responsive navigation bar"
    ],
    summary: "Flexbox makes one-dimensional layouts simple and responsive.",
    xpReward: 75
  },
  // ── SQL ────────────────────────────────────────────────────────────────
  {
    id: "sql_select",
    langId: "sql",
    title: "SELECT Basics",
    icon: "🔍",
    difficulty: "beginner",
    prerequisites: [],
    estimatedMinutes: 15,
    objectives: [
      "Write SELECT * and SELECT column queries",
      "Use aliases with AS",
      "Select from a single table"
    ],
    summary: "SELECT is the most fundamental SQL command — it retrieves data from tables.",
    xpReward: 45
  },
  {
    id: "sql_where",
    langId: "sql",
    title: "WHERE & Filtering",
    icon: "🔎",
    difficulty: "beginner",
    prerequisites: ["sql_select"],
    estimatedMinutes: 20,
    objectives: [
      "Filter rows with WHERE",
      "Use AND, OR, NOT",
      "Use LIKE and IN"
    ],
    summary: "WHERE clauses filter query results to only the rows you need.",
    xpReward: 55
  },
  {
    id: "sql_orderby",
    langId: "sql",
    title: "ORDER BY & LIMIT",
    icon: "📊",
    difficulty: "beginner",
    prerequisites: ["sql_where"],
    estimatedMinutes: 15,
    objectives: [
      "Sort results with ORDER BY ASC/DESC",
      "Limit rows with LIMIT",
      "Combine ORDER BY with WHERE"
    ],
    summary: "ORDER BY sorts query results; LIMIT controls how many rows are returned.",
    xpReward: 50
  },
  {
    id: "sql_joins",
    langId: "sql",
    title: "JOINs",
    icon: "🔗",
    difficulty: "intermediate",
    prerequisites: ["sql_orderby"],
    estimatedMinutes: 30,
    objectives: [
      "Use INNER JOIN to combine tables",
      "Understand LEFT JOIN and RIGHT JOIN",
      "Use table aliases in joins"
    ],
    summary: "JOINs combine rows from multiple tables based on a related column.",
    xpReward: 90
  },
  {
    id: "sql_groupby",
    langId: "sql",
    title: "GROUP BY & Aggregates",
    icon: "📈",
    difficulty: "intermediate",
    prerequisites: ["sql_joins"],
    estimatedMinutes: 25,
    objectives: [
      "Use COUNT, SUM, AVG, MIN, MAX",
      "Group results with GROUP BY",
      "Filter groups with HAVING"
    ],
    summary: "Aggregate functions summarize data; GROUP BY organizes results into groups.",
    xpReward: 85
  },
  // ── DSA ────────────────────────────────────────────────────────────────
  {
    id: "dsa_arrays",
    langId: "dsa",
    title: "Arrays",
    icon: "📊",
    difficulty: "beginner",
    prerequisites: [],
    estimatedMinutes: 20,
    objectives: [
      "Understand time/space complexity basics",
      "Traverse, insert, and delete in arrays",
      "Recognise when to use arrays"
    ],
    summary: "Arrays are the simplest data structure — contiguous memory with O(1) access by index.",
    xpReward: 55
  },
  {
    id: "dsa_searching",
    langId: "dsa",
    title: "Searching",
    icon: "🔍",
    difficulty: "beginner",
    prerequisites: ["dsa_arrays"],
    estimatedMinutes: 20,
    objectives: [
      "Implement linear search",
      "Implement binary search",
      "Compare O(n) vs O(log n)"
    ],
    summary: "Searching finds a target value — binary search is dramatically faster on sorted data.",
    xpReward: 65
  },
  {
    id: "dsa_sorting",
    langId: "dsa",
    title: "Sorting",
    icon: "🔢",
    difficulty: "intermediate",
    prerequisites: ["dsa_searching"],
    estimatedMinutes: 35,
    objectives: [
      "Implement bubble sort and selection sort",
      "Understand merge sort at a conceptual level",
      "Compare sorting complexities"
    ],
    summary: "Sorting arranges data in order — knowing multiple algorithms shows depth of understanding.",
    xpReward: 90
  },
  {
    id: "dsa_linkedlists",
    langId: "dsa",
    title: "Linked Lists",
    icon: "🔗",
    difficulty: "intermediate",
    prerequisites: ["dsa_sorting"],
    estimatedMinutes: 30,
    objectives: [
      "Understand nodes and pointers",
      "Traverse a linked list",
      "Insert and delete nodes"
    ],
    summary: "Linked lists use nodes and pointers — efficient for insertions but slow for random access.",
    xpReward: 85
  },
  {
    id: "dsa_stacks_queues",
    langId: "dsa",
    title: "Stacks & Queues",
    icon: "📚",
    difficulty: "intermediate",
    prerequisites: ["dsa_linkedlists"],
    estimatedMinutes: 25,
    objectives: [
      "Implement a stack with push/pop",
      "Implement a queue with enqueue/dequeue",
      "Apply stacks to bracket matching"
    ],
    summary: "Stacks (LIFO) and queues (FIFO) are fundamental building blocks used in many algorithms.",
    xpReward: 80
  },
  // ── C ─────────────────────────────────────────────────────────────────
  {
    id: "c_variables",
    langId: "c",
    title: "Variables & Data Types",
    icon: "📦",
    difficulty: "beginner",
    prerequisites: [],
    estimatedMinutes: 20,
    objectives: [
      "Declare variables in C",
      "Understand int, float, char, double",
      "Use printf and scanf"
    ],
    summary: "C is strictly typed and requires explicit declarations before use.",
    xpReward: 50
  },
  {
    id: "c_conditions",
    langId: "c",
    title: "Conditions & Loops",
    icon: "🔄",
    difficulty: "beginner",
    prerequisites: ["c_variables"],
    estimatedMinutes: 25,
    objectives: [
      "Write if/else and switch in C",
      "Use for, while, do-while loops"
    ],
    summary: "Control flow in C is the foundation for all procedural programs.",
    xpReward: 60
  },
  {
    id: "c_functions",
    langId: "c",
    title: "Functions",
    icon: "🧩",
    difficulty: "beginner",
    prerequisites: ["c_conditions"],
    estimatedMinutes: 30,
    objectives: [
      "Define and call functions",
      "Use function prototypes",
      "Pass by value"
    ],
    summary: "Functions in C must declare a return type and be declared before use.",
    xpReward: 75
  },
  {
    id: "c_arrays",
    langId: "c",
    title: "Arrays & Strings",
    icon: "📊",
    difficulty: "intermediate",
    prerequisites: ["c_functions"],
    estimatedMinutes: 30,
    objectives: [
      "Declare and iterate arrays",
      "Work with C strings (char arrays)",
      "Use strlen and strcpy"
    ],
    summary: "C strings are null-terminated character arrays — no built-in String type.",
    xpReward: 80
  }
];
