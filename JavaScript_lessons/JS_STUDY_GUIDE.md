# JavaScript Fundamentals & Architecture Study Guide

A comprehensive reference covering core JavaScript concepts, modern ES6+ practices, and modular file imports/exports.

---

## Table of Contents
1. [Variables, Scope & Hoisting](#1-variables-scope--hoisting)
2. [String Formatting & Template Literals](#2-string-formatting--template-literals)
3. [Types & Equality (`null`, `undefined`, `==`, `===`)](#3-types--equality)
4. [Logical Operators & Truthiness](#4-logical-operators--truthiness)
5. [Loops & Iteration](#5-loops--iteration)
6. [Functions in Depth (Declarations, Expressions, Callbacks, Arrow Functions)](#6-functions-in-depth)
7. [Modules: Sharing Functions Across Files (CommonJS & ES6)](#7-modules-sharing-functions-across-files)

---

## 1. Variables, Scope & Hoisting

| Feature | `var` | `let` | `const` |
| :--- | :--- | :--- | :--- |
| **Scope** | Function-scoped | Block-scoped (`{}`) | Block-scoped (`{}`) |
| **Re-declaration** | Allowed | Disallowed (`SyntaxError`) | Disallowed (`SyntaxError`) |
| **Re-assignment** | Allowed | Allowed | Disallowed (`TypeError`) |
| **Hoisting** | Hoisted with `undefined` | Hoisted into **TDZ** | Hoisted into **TDZ** |
| **Global Object** | Attaches to `window` | Does not attach | Does not attach |

### Temporal Dead Zone (TDZ)
`let` and `const` variables exist in the TDZ from the moment their block is entered until their declaration line is executed. Accessing them inside the TDZ throws a `ReferenceError`.

```javascript
// --- TDZ starts here ---
// console.log(score); // ReferenceError: Cannot access 'score' before initialization
let score = 100;       // --- TDZ ends here ---
console.log(score);    // 100 (Safe)
```

---

### The Rules for `const` vs. `let` (Mutation vs. Reassignment)

#### 1. `const` locks the REFERENCE, not the data
A common misconception is thinking that `const` freezes an object or array. It does not.
* **`const` allows mutating properties/elements:** You can change attributes inside an object or `.push()` into an array.
* **`const` only forbids REASSIGNING the variable** to a new memory address.

```javascript
// ✅ Objects declared with const CAN be modified:
const customer = { name: "John", age: 30 };
customer.name = "Alex"; // Perfectly valid!
customer.city = "Miami"; // Perfectly valid!

// ❌ Reassigning the variable itself is BLOCKED:
// customer = { name: "Bob" }; // TypeError: Assignment to constant variable

// ✅ Arrays declared with const CAN be mutated:
const fruits = ["Apple"];
fruits.push("Banana"); // Perfectly valid!
// fruits = ["Cherry"]; // TypeError!
```

#### 2. Golden Rule: When to use which?
1. **Use `const` by default (95%+ of the time):**
   * Use for functions, classes, objects, arrays, and exported instances.
   * Protects your code from accidental reassignment bugs.
2. **Use `let` ONLY when reassignment is required:**
   * Loop counters (`for (let i = 0; ...)`), accumulators, state flags that toggle (`let isLoggedIn = false`).
3. **Never use `var`** in modern JavaScript.

#### 3. Exported Instances & Read-Only Imports
* When exporting an instance (`export const customerDetails = new CustomerDetails()`), `const` guarantees the **Singleton pattern**—a permanent, stable instance shared across test files.
* **Important:** In ES6 modules, all imported variables are **read-only** for the importing file, regardless of whether they were originally defined with `const` or `let`:
  ```javascript
  // In the importing file:
  import { customerDetails } from '../helpers/class.js';
  // customerDetails = new CustomerDetails(); // ❌ ALWAYS throws TypeError (imports are read-only)
  ```

---

## 2. String Formatting & Template Literals

* Regular single quotes (`'`) and double quotes (`"`) **do not support** string interpolation.
* Use **Template Literals** with **backticks (`` ` ``)** and **`${variable}`**.

```javascript
let name = "Vicente";
let age = 25;

// ❌ WRONG (prints literally):
console.log('Hello ${name}'); 

// ✅ CORRECT (Template literal):
console.log(`Hello ${name}, you are ${age} years old.`);

// ✅ Alternatives with single quotes:
console.log('Hello ' + name + ', you are ' + age + ' years old.'); // Concatenation
console.log('Hello', name, ', you are', age, 'years old.');        // Arguments
console.log('Hello %s, you are %d years old.', name, age);         // Format specifiers
```

---

## 3. Types & Equality

### `null` vs. `undefined`

| Feature | `undefined` | `null` |
| :--- | :--- | :--- |
| **Meaning** | Declared but not assigned (by default) | Explicitly assigned empty value (by design) |
| **Assigned by** | JavaScript engine | The developer |
| **`typeof`** | `"undefined"` | `"object"` *(historical JS bug)* |
| **In Math** | Converts to `NaN` (`5 + undefined = NaN`) | Converts to `0` (`5 + null = 5`) |
| **Function Defaults** | Triggers default parameter | Does NOT trigger default parameter |

### Loose (`==`) vs. Strict (`===`) Equality

* **`==` (Loose):** Converts operand types before comparing (type coercion). Prone to hidden bugs.
* **`===` (Strict):** Compares **both value AND type**. Never converts types.

```javascript
5 == "5";            // true  (coerces string to number)
5 === "5";           // false (different types)

0 == false;          // true
0 === false;         // false

null == undefined;   // true  (both represent empty)
null === undefined;  // false (different types)

// Objects/Arrays compare by MEMORY REFERENCE:
[1] === [1];         // false (different locations in memory)
```
> **Rule:** Always use `===` and `!==` by default.

---

## 4. Logical Operators & Truthiness

* **`&&` (AND):** All expressions must be truthy.
* **`||` (OR):** At least one expression must be truthy.
* **`!` (NOT):** Inverts truthiness (`!true -> false`, `!false -> true`).
* **`!==` (Strict Inequality):** Checks if values or types do NOT match.

### Falsy Values in JavaScript:
Only 6 values evaluate to `false`:
1. `false`
2. `0`
3. `""` (empty string)
4. `null`
5. `undefined`
6. `NaN`

*(Everything else is truthy, including `[]`, `{}`, and `"0"`)*

```javascript
// Double NOT (!!) converts any value into a real boolean:
let username = "Vicente";
console.log(!!username); // true
```

---

## 5. Loops & Iteration

### Lifecycle of a `for` Loop
`for ([init]; [condition]; [update]) { [body] }`

1. **Initialization:** Runs ONCE.
2. **Condition:** Checked before each iteration.
3. **Body:** Runs if condition is `true`.
4. **Update:** Runs **after** the body finishes, immediately before re-checking the condition.

```javascript
// The 3rd part can be omitted and placed in the body:
for (let i = 0; i < 5; ) {
    console.log(i);
    i++; // Equivalent to a while loop!
}
```

### Iterating Arrays & Objects

| Structure | Best Loop | Example |
| :--- | :--- | :--- |
| **Arrays** | `for...of` | `for (let item of array) { ... }` |
| **Arrays** | `forEach` (ES6) | `array.forEach((item, index) => { ... })` |
| **Objects** | `for...in` | `for (let key in obj) { console.log(obj[key]); }` |
| **Objects (with `while`)** | `while` + `Object.keys()` | `let keys = Object.keys(obj); while (i < keys.length) ...` |

> ⚠️ **`forEach` Gotchas:**
> * You **cannot** use `break` or `continue` inside `forEach`. (Use `for...of` instead if you need early exit).
> * `return` inside `forEach` only exits that specific callback item (like `continue`).

---

## 6. Functions in Depth

### Function Declaration vs. Function Expression

```javascript
// 1. Function Declaration (FULLY HOISTED - can call before declaration)
hello(); // Works!
function hello() {
    console.log("Hello");
}

// 2. Function Expression (NOT HOISTED - behaves like a variable)
// greet(); // ReferenceError!
const greet = function() {
    console.log("Greet");
};
```

---

### Anonymous Functions & Callbacks
An **anonymous function** has no name identifier. It is frequently passed directly as a **callback** into other functions without needing a variable:

```javascript
// Passed directly as an anonymous callback:
fruits.forEach(function(fruit) {
    console.log(fruit);
});
```

---

### ES6 Arrow Functions (`=>`)

#### Parentheses Rules:
* **1 parameter:** Parentheses optional $\rightarrow$ `fruit => { ... }`
* **0 parameters:** Parentheses required $\rightarrow$ `() => { ... }`
* **2+ parameters:** Parentheses required $\rightarrow$ `(fruit, index) => { ... }`

#### Shorthand vs. Block Body:
```javascript
// One-liner (implicit return):
const double = n => n * 2;

// Multi-line block (requires explicit return):
const calculate = (a, b) => {
    let sum = a + b;
    return sum * 2;
};
```

#### Comparison with Python and Java:
* **JavaScript:** `(a, b) => a + b` (Supports multi-line with `{}`)
* **Python:** `lambda a, b: a + b` (Strictly single expression only)
* **Java:** `(a, b) -> a + b` (Statically typed Functional Interfaces)

---

### Referencing vs. Invoking Functions

```javascript
function getGreeting() {
    return "Hello!";
}

// Referencing the function itself (prints function representation):
console.log(getGreeting);   // [Function: getGreeting]

// Invoking/Calling the function with () (evaluates to return value):
console.log(getGreeting()); // "Hello!"
```

---

### Returning Results from Callbacks

Callbacks can return values. Methods like `.map()` and `.filter()` rely entirely on what the callback returns:

```javascript
const numbers = [1, 2, 3, 4];

// .map() captures every return value to build a new array:
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8]

// .filter() keeps items where callback returns true:
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]
```

---

## 7. Modules: Sharing Functions Across Files

JavaScript has two major module systems:
* **CommonJS (CJS):** Node.js classic standard (`module.exports` and `require`).
* **ES6 Modules (ESM):** Modern JavaScript standard (`export` and `import ... from`).

---

### A. CommonJS (`module.exports` and `require`)
*Default in Node.js when `"type": "commonjs"` is in `package.json`.*

#### 1. Exporting a Single / Anonymous Function (Default-style)
When exporting an anonymous function, the importing file can name it whatever it wants.

```javascript
// helpers/printHelper.js
module.exports = function(message) {
    console.log(`[LOG]: ${message}`);
};

// OR as an anonymous arrow function:
// module.exports = (message) => console.log(`[LOG]: ${message}`);
```

```javascript
// lessons/lesson8.js
const printMessage = require('../helpers/printHelper.js');

printMessage("Hello from helper!");
```

#### 2. Exporting Multiple Functions (As an Object)
```javascript
// helpers/printHelper.js
module.exports = {
    printInfo: (text) => console.log(`INFO: ${text}`),
    printError: (text) => console.log(`ERROR: ${text}`)
};
```

```javascript
// lessons/lesson8.js
// Option 1: Import as an object namespace
const helper = require('../helpers/printHelper.js');
helper.printInfo("System running");

// Option 2: Destructure only the functions you need
const { printInfo, printError } = require('../helpers/printHelper.js');
printError("Crash detected");
```

---

### B. ES6 Modules (`export` and `import ... from`)
*Requires `"type": "module"` in `package.json`.*

#### 1. Default Export (One per file)
```javascript
// helpers/printHelper.js
export default (message) => {
    console.log(`[LOG]: ${message}`);
};
```

```javascript
// lessons/lesson8.js (No curly braces needed for default)
import printMessage from '../helpers/printHelper.js';

printMessage("Hello from ES6 module!");
```

##### 💡 Why use `export default` with anonymous functions?
1. **Only way to export anonymous functions directly:** In JavaScript, named exports require an identifier. Writing `export (msg) => { ... }` or `export const = ...` is a **SyntaxError**. `export default` is the only syntax that allows exporting an unnamed function directly.
2. **Signals the Primary Purpose:** It tells other developers that this function is the **single main responsibility** of this file (rather than a collection of different tools).
3. **No Curly Braces & Custom Naming:** The importing file doesn't need `{ }` and can name the imported function whatever it wants:
   ```javascript
   import print from '../helpers/printHelper.js';
   import logger from '../helpers/printHelper.js';
   ```

| If you want to: | You must use: | Example: |
| :--- | :--- | :--- |
| Export an **anonymous** function directly | **`export default`** | `export default (msg) => { ... };` |
| Export a **named** function | **Named `export`** | `export const printMsg = (msg) => { ... };` |

#### 2. Named Exports (Multiple per file)
Use named exports when a helper file contains several functions.

```javascript
// helpers/printHelper.js

// Option A: Inline export
export const printInfo = (text) => console.log(`INFO: ${text}`);
export const printError = (text) => console.log(`ERROR: ${text}`);

// Option B: Grouped export at bottom of file
// const printInfo = (text) => console.log(`INFO: ${text}`);
// const printError = (text) => console.log(`ERROR: ${text}`);
// export { printInfo, printError };
```

```javascript
// lessons/lesson8.js

// 1. Named import (must match exact names inside { })
import { printInfo, printError } from '../helpers/printHelper.js';
printInfo("All good");

// 2. Import everything as a namespace
import * as Logger from '../helpers/printHelper.js';
Logger.printInfo("All good");

// 3. Rename an import using 'as'
import { printError as logError } from '../helpers/printHelper.js';
logError("Something failed");
```

---

### C. Quick Comparison: CommonJS vs. ES6 Modules

| Feature | CommonJS (`"type": "commonjs"`) | ES6 Modules (`"type": "module"`) |
| :--- | :--- | :--- |
| **Export Single** | `module.exports = fn;` | `export default fn;` |
| **Import Single** | `const fn = require('./path');` | `import fn from './path';` |
| **Export Multiple** | `module.exports = { fn1, fn2 };` | `export const fn1 = ...; export const fn2 = ...;` |
| **Import Multiple** | `const { fn1, fn2 } = require('./path');` | `import { fn1, fn2 } from './path';` |
| **Dynamic Loading** | Supported anywhere in code | `import()` expression |

---

### D. Object Property vs. Standalone Variable Syntax

When exporting multiple functions inside an object:
```javascript
// ✅ VALID: 'printInfo' is an object property key
const myHelper = {
    printInfo: (text) => console.log(text)
};

// ❌ INVALID outside of an object:
// printInfo: (text) => console.log(text); // SyntaxError
```

* **Inside `{}`:** Use `propertyName: () => { ... }` (or shorthand `printInfo(text) { ... }`).
* **Outside `{}`:** Use `const printInfo = (text) => { ... }`.
