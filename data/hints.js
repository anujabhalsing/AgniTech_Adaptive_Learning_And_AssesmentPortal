// SkillTrace AI — Progressive Hint Ladders
// AI-generated. Each question can have up to 4 hint levels.
const HINTS = {
  // ─── Python Variables ────────────────────────────────────────────────────────
  q_pv_1: [
    { level: 1, type: "nudge",      text: "Think about how Python assigns values — it's simpler than Java or C++." },
    { level: 2, type: "concept",    text: "In Python, you just write: variable_name = value. No type keyword needed." },
    { level: 3, type: "pseudocode", text: "name = \"Alice\"  ← this is valid Python. Look for this pattern among the options." },
    { level: 4, type: "solution",   text: "The answer is (a): name = \"Alice\". Python doesn't need String or var keywords." }
  ],
  q_pv_4: [
    { level: 1, type: "nudge",      text: "What types are being added with + on line 2?" },
    { level: 2, type: "concept",    text: "Python cannot concatenate a string and an integer with +. One of them needs to be converted first." },
    { level: 3, type: "pseudocode", text: "Fix: \"You are \" + str(age) + \" years old.\" — convert age to string first." },
    { level: 4, type: "solution",   text: "The bug is (b): you need str(age) to convert the integer to a string before concatenating." }
  ],
  // ─── Python Conditions ──────────────────────────────────────────────────────
  q_pc_3: [
    { level: 1, type: "nudge",      text: "Look carefully at the symbol after 'score' in the if statement." },
    { level: 2, type: "concept",    text: "= is assignment; == is comparison. Inside if/while conditions, you almost always want ==." },
    { level: 3, type: "pseudocode", text: "if score == 100: ← this is the corrected version." },
    { level: 4, type: "solution",   text: "Answer: (b) — change = to == for comparison." }
  ],
  // ─── Python Loops ────────────────────────────────────────────────────────────
  q_pl_4: [
    { level: 1, type: "nudge",      text: "Trace through the loop: does 'count' ever change?" },
    { level: 2, type: "concept",    text: "A while loop continues until the condition becomes False. If the variable never changes, the condition never becomes False." },
    { level: 3, type: "pseudocode", text: "Add inside the loop:  count += 1  (or count = count + 1)" },
    { level: 4, type: "solution",   text: "Answer (b): count is never incremented, causing an infinite loop. Add count += 1 inside the while block." }
  ],
  // ─── Java Variables ──────────────────────────────────────────────────────────
  q_jv_2: [
    { level: 1, type: "nudge",      text: "Look at the end of the first line. Is anything missing?" },
    { level: 2, type: "concept",    text: "Every Java statement must end with a semicolon ;  — the compiler requires it." },
    { level: 3, type: "pseudocode", text: 'String name = "Alice";  ← note the semicolon at the end.' },
    { level: 4, type: "solution",   text: 'Answer (b): add a semicolon → String name = "Alice";' }
  ],
  // ─── C++ Pointers ────────────────────────────────────────────────────────────
  q_cp_1: [
    { level: 1, type: "nudge",      text: "This operator is sometimes called the 'address-of' operator." },
    { level: 2, type: "concept",    text: "Memory locations have addresses (like house numbers). & gives you the address of a variable." },
    { level: 3, type: "pseudocode", text: "int x = 10;\nint* ptr = &x;  // ptr holds the address of x" },
    { level: 4, type: "solution",   text: "Answer (b): & returns the memory address of the variable." }
  ],
  q_cp_2: [
    { level: 1, type: "nudge",      text: "Trace what *ptr = 25 does to the memory." },
    { level: 2, type: "concept",    text: "ptr holds the address of val. *ptr lets you read or write the value at that address." },
    { level: 3, type: "pseudocode", text: "*ptr = 25  means 'write 25 to the location that ptr points to', which is val." },
    { level: 4, type: "solution",   text: "Answer (b): val becomes 25 because *ptr = 25 writes through the pointer to val." }
  ],
  // ─── JavaScript ─────────────────────────────────────────────────────────────
  q_jsv_2: [
    { level: 1, type: "nudge",      text: "JavaScript has two equality operators. What is the difference between == and ===?" },
    { level: 2, type: "concept",    text: "== performs type coercion (converts types before comparing). === checks both value AND type without coercion." },
    { level: 3, type: "pseudocode", text: "5 == '5'  → true  (number coerced to string)\n5 === '5' → false (number ≠ string)" },
    { level: 4, type: "solution",   text: "Answer (c): true then false. == coerces types; === does not." }
  ],
  // ─── SQL ─────────────────────────────────────────────────────────────────────
  q_sql_3: [
    { level: 1, type: "nudge",      text: "The question says 'matching values in BOTH tables'. Which JOIN is the most restrictive?" },
    { level: 2, type: "concept",    text: "INNER JOIN returns only rows where the join condition is true for both tables. LEFT JOIN keeps all rows from the left table regardless." },
    { level: 3, type: "pseudocode", text: "SELECT * FROM a INNER JOIN b ON a.id = b.id\n-- only rows where a.id matches b.id" },
    { level: 4, type: "solution",   text: "Answer (c): INNER JOIN." }
  ],
  // ─── DSA ─────────────────────────────────────────────────────────────────────
  q_dsa_1: [
    { level: 1, type: "nudge",      text: "Binary search works on sorted arrays by repeatedly halving the search range." },
    { level: 2, type: "concept",    text: "If you have 1000 elements, binary search needs at most ~10 comparisons (log₂ 1000 ≈ 10). That's O(log n)." },
    { level: 3, type: "pseudocode", text: "Each step: compare middle element, discard half the array.\nSteps ≈ log₂(n)" },
    { level: 4, type: "solution",   text: "Answer (c): O(log n)." }
  ]
};
