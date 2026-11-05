// Logical "AND". All values or expressions must be TRUE

console.log(true && false)

// Logical "OR". Any value should be TRUE

console.log(true || false)

// Logical "NOT"
console.log(!true);    // Logical NOT (inverts boolean -> false)
console.log(6 !== 10); // Strict Inequality operator (checks "is 6 NOT equal to 10?" -> true)
console.log(!(6 == 10))
console.log(!(6 < 10))

/**Falsy values (values that become false):
 * There are only a few falsy values in JavaScript: 
 * false, 0, "" (empty string), null, undefined, NaN
 * 
 * When you apply !, they flip to true:*/

console.log(!0);         // true
console.log(!"");        // true
console.log(!null);      // true
console.log(!undefined); // true

/**
 * Truthy values (everything else):
 * When you apply !, they flip to false:
 */

console.log(!5);         // false
console.log(!"Hello");   // false
console.log(!{});        // false (empty object is truthy)
console.log(![]);        // false (empty array is truthy)

/**
 * The Double NOT Trick (!!)

A very common JavaScript pattern is using two exclamation marks (!!) to convert any value directly into a true boolean:
 */

let username = "John";
console.log(!!username); // true (converts string to boolean true)

let email = "";
console.log(!!email);    // false (converts empty string to boolean false)

/**
 * ! on its own: Inverts a single condition or value (!isLoggedIn).
 * !==: Compares two values to see if they are not equal in value or type.
 */