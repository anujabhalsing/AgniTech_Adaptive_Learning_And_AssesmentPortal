import { CodingChallenge } from '../types';

export const codingChallenges: CodingChallenge[] = [
  {
    id: 'cc-py-sum-array',
    topicId: 'py-lists',
    languageId: 'python',
    title: 'Sum of Array',
    description: `Given a list of integers, return the sum of all elements without using Python's built-in \`sum()\` function.

This problem tests your ability to iterate over a list and accumulate a running total.`,
    inputFormat: 'A single line containing space-separated integers.',
    outputFormat: 'A single integer — the sum of the input numbers.',
    constraints: '1 ≤ n ≤ 1000 numbers. Each number: −10⁵ ≤ x ≤ 10⁵',
    examples: [
      { input: '1 2 3 4 5',       output: '15',    explanation: '1+2+3+4+5 = 15' },
      { input: '10 -3 7',         output: '14',    explanation: '10 + (−3) + 7 = 14' },
      { input: '0',               output: '0' },
    ],
    starterCode: {
      python: `# Read input
nums = list(map(int, input().split()))

# TODO: compute the sum WITHOUT using sum()
total = 0
# your code here

print(total)`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);

let total = 0;
// your code here

console.log(total);`,
    },
    difficulty: 'easy',
    xpReward: 60,
    testCases: [
      { id: 'tc-sa-1', challengeId: 'cc-py-sum-array', input: '1 2 3 4 5',       expectedOutput: '15',  isHidden: false, description: 'Basic positive numbers' },
      { id: 'tc-sa-2', challengeId: 'cc-py-sum-array', input: '10 -3 7',         expectedOutput: '14',  isHidden: false, description: 'Mixed positive and negative' },
      { id: 'tc-sa-3', challengeId: 'cc-py-sum-array', input: '0',               expectedOutput: '0',   isHidden: false, description: 'Single zero' },
      { id: 'tc-sa-4', challengeId: 'cc-py-sum-array', input: '-5 -10 -1',       expectedOutput: '-16', isHidden: true,  description: 'All negative (hidden)' },
      { id: 'tc-sa-5', challengeId: 'cc-py-sum-array', input: '100000 -100000',  expectedOutput: '0',   isHidden: true,  description: 'Edge: boundary values (hidden)' },
    ],
    hints: [
      { id: 'hint-sa-1', questionId: 'cc-py-sum-array', level: 1, text: 'Try initializing a variable to 0 and adding each number one at a time.' },
      { id: 'hint-sa-2', questionId: 'cc-py-sum-array', level: 2, text: 'A for loop over the list with total += x on each iteration will work.' },
      { id: 'hint-sa-3', questionId: 'cc-py-sum-array', level: 3, text: 'total = 0\nfor x in nums:\n    total += x\nprint(total)' },
    ],
    tags: ['loops', 'arrays', 'accumulator'],
  },
  {
    id: 'cc-py-palindrome',
    topicId: 'py-conditions',
    languageId: 'python',
    title: 'Palindrome Check',
    description: `Determine if a given string is a palindrome. A palindrome reads the same forwards and backwards.

Ignore upper/lower case differences. Only consider alphanumeric characters.`,
    inputFormat: 'A single string on one line.',
    outputFormat: '"yes" if the string is a palindrome, otherwise "no".',
    constraints: '1 ≤ len(s) ≤ 1000. The string may contain letters, digits, spaces, and punctuation.',
    examples: [
      { input: 'racecar',     output: 'yes', explanation: '"racecar" reversed is "racecar".' },
      { input: 'hello',       output: 'no',  explanation: '"hello" reversed is "olleh".' },
      { input: 'A man a plan a canal Panama', output: 'yes', explanation: 'After filtering only alphanumeric and lowercasing: "amanaplanacanalpanama".' },
    ],
    starterCode: {
      python: `s = input()

# Keep only alphanumeric chars and lowercase
cleaned = ''.join(c.lower() for c in s if c.isalnum())

# TODO: check if cleaned is a palindrome
result = ""  # should be "yes" or "no"

print(result)`,
    },
    difficulty: 'easy',
    xpReward: 75,
    testCases: [
      { id: 'tc-pal-1', challengeId: 'cc-py-palindrome', input: 'racecar',     expectedOutput: 'yes', isHidden: false, description: 'Simple palindrome' },
      { id: 'tc-pal-2', challengeId: 'cc-py-palindrome', input: 'hello',       expectedOutput: 'no',  isHidden: false, description: 'Not a palindrome' },
      { id: 'tc-pal-3', challengeId: 'cc-py-palindrome', input: 'A man a plan a canal Panama', expectedOutput: 'yes', isHidden: false, description: 'Phrase palindrome' },
      { id: 'tc-pal-4', challengeId: 'cc-py-palindrome', input: 'a',           expectedOutput: 'yes', isHidden: true,  description: 'Single character (hidden)' },
      { id: 'tc-pal-5', challengeId: 'cc-py-palindrome', input: 'Was it a car or a cat I saw', expectedOutput: 'yes', isHidden: true, description: 'Sentence palindrome (hidden)' },
    ],
    hints: [
      { id: 'hint-pal-1', questionId: 'cc-py-palindrome', level: 1, text: 'Compare the cleaned string with its reverse.' },
      { id: 'hint-pal-2', questionId: 'cc-py-palindrome', level: 2, text: 'In Python, reversed_string = cleaned[::-1]. Compare cleaned == cleaned[::-1].' },
      { id: 'hint-pal-3', questionId: 'cc-py-palindrome', level: 3, text: 'result = "yes" if cleaned == cleaned[::-1] else "no"' },
    ],
    tags: ['strings', 'two-pointer', 'conditions'],
  },
  {
    id: 'cc-py-fizzbuzz',
    topicId: 'py-loops',
    languageId: 'python',
    title: 'FizzBuzz',
    description: `Print numbers from 1 to n with these rules:
- Print "Fizz" for multiples of 3
- Print "Buzz" for multiples of 5
- Print "FizzBuzz" for multiples of both 3 and 5
- Print the number itself otherwise`,
    inputFormat: 'A single integer n.',
    outputFormat: 'n lines, one per number, following the FizzBuzz rules.',
    constraints: '1 ≤ n ≤ 100',
    examples: [
      { input: '5', output: '1\n2\nFizz\n4\nBuzz', explanation: '3 is divisible by 3, 5 by 5.' },
      { input: '15', output: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', explanation: '15 is divisible by both.' },
    ],
    starterCode: {
      python: `n = int(input())

for i in range(1, n + 1):
    # TODO: print Fizz, Buzz, FizzBuzz, or the number
    pass`,
    },
    difficulty: 'easy',
    xpReward: 50,
    testCases: [
      { id: 'tc-fb-1', challengeId: 'cc-py-fizzbuzz', input: '5',  expectedOutput: '1\n2\nFizz\n4\nBuzz',                                                      isHidden: false, description: 'First 5' },
      { id: 'tc-fb-2', challengeId: 'cc-py-fizzbuzz', input: '1',  expectedOutput: '1',                                                                         isHidden: false, description: 'n=1' },
      { id: 'tc-fb-3', challengeId: 'cc-py-fizzbuzz', input: '15', expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', isHidden: false, description: 'Through 15 (includes FizzBuzz)' },
      { id: 'tc-fb-4', challengeId: 'cc-py-fizzbuzz', input: '3',  expectedOutput: '1\n2\nFizz',                                                                isHidden: true,  description: 'n=3 (hidden)' },
    ],
    hints: [
      { id: 'hint-fb-1', questionId: 'cc-py-fizzbuzz', level: 1, text: 'Use the modulo operator %. i % 3 == 0 means i is divisible by 3.' },
      { id: 'hint-fb-2', questionId: 'cc-py-fizzbuzz', level: 2, text: 'Check divisible by both 3 AND 5 FIRST (FizzBuzz), then check each individually.' },
      { id: 'hint-fb-3', questionId: 'cc-py-fizzbuzz', level: 3, text: 'if i%15==0: print("FizzBuzz")\nelif i%3==0: print("Fizz")\nelif i%5==0: print("Buzz")\nelse: print(i)' },
    ],
    tags: ['loops', 'conditions', 'modulo'],
  },
  {
    id: 'cc-dsa-binary-search',
    topicId: 'dsa-searching',
    languageId: 'python',
    title: 'Binary Search',
    description: `Given a sorted array of integers and a target value, return the index of the target using binary search.
If the target is not found, return -1.

Do NOT use Python's built-in bisect module or index() method.`,
    inputFormat: 'Line 1: space-separated sorted integers.\nLine 2: target integer.',
    outputFormat: 'Index of the target, or -1 if not found.',
    constraints: '1 ≤ n ≤ 10⁵. All integers are distinct. Array is sorted in ascending order.',
    examples: [
      { input: '1 3 5 7 9 11\n7',  output: '3',  explanation: '7 is at index 3.' },
      { input: '2 4 6 8 10\n5',    output: '-1', explanation: '5 is not in the array.' },
      { input: '42\n42',           output: '0',  explanation: 'Single-element array.' },
    ],
    starterCode: {
      python: `nums = list(map(int, input().split()))
target = int(input())

# TODO: implement binary search
# Return the index of target, or -1 if not found
lo, hi = 0, len(nums) - 1

result = -1
# your code here

print(result)`,
    },
    difficulty: 'medium',
    xpReward: 100,
    testCases: [
      { id: 'tc-bs-1', challengeId: 'cc-dsa-binary-search', input: '1 3 5 7 9 11\n7',  expectedOutput: '3',  isHidden: false, description: 'Target in middle area' },
      { id: 'tc-bs-2', challengeId: 'cc-dsa-binary-search', input: '2 4 6 8 10\n5',    expectedOutput: '-1', isHidden: false, description: 'Target not found' },
      { id: 'tc-bs-3', challengeId: 'cc-dsa-binary-search', input: '42\n42',           expectedOutput: '0',  isHidden: false, description: 'Single element, found' },
      { id: 'tc-bs-4', challengeId: 'cc-dsa-binary-search', input: '1 3\n1',           expectedOutput: '0',  isHidden: true,  description: 'Target at start (hidden)' },
      { id: 'tc-bs-5', challengeId: 'cc-dsa-binary-search', input: '1 3\n3',           expectedOutput: '1',  isHidden: true,  description: 'Target at end (hidden)' },
    ],
    hints: [
      { id: 'hint-bs-1', questionId: 'cc-dsa-binary-search', level: 1, text: 'Keep a lo and hi pointer. In each step, check the middle element.' },
      { id: 'hint-bs-2', questionId: 'cc-dsa-binary-search', level: 2, text: 'mid = (lo + hi) // 2. If nums[mid] == target, found! If target > nums[mid], search right half. Otherwise, left half.' },
      { id: 'hint-bs-3', questionId: 'cc-dsa-binary-search', level: 3, text: 'while lo <= hi:\n    mid = (lo+hi)//2\n    if nums[mid] == target: result = mid; break\n    elif nums[mid] < target: lo = mid+1\n    else: hi = mid-1' },
    ],
    tags: ['binary search', 'arrays', 'O(log n)'],
  },
];
