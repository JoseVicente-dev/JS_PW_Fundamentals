// Functions: create modules and re-use code

//To call it, just invoke it
helloOne() // a normal function can be called before its declaration (hoisting)

function helloOne(){
    console.log('Hello one!')
}

// Anonymous functions
/**
 * To store and reuse an anonymous function, it can be assigned to a variable (otherwise, it can be passed directly as a callback).
 * 
 * When an anonymous function is assigned to a variable, it is called a Function Expression.
 * 
 * They are called anonymous because there is no name
 * 
 * Normal function:
 *  function functionName(){...}
 * 
 * Anonymous function:
 *  let variable = function(){...} // No name after the function keyword
 */

let helloTwo = function(){
    console.log('Hello two!')
}

helloTwo() //This anonymous function cannot be called before its declaration, contrary to normal functions

// Invoking an anonymous function with arguments

const add = (a, b) => a + b;

console.log(add(2, 3)); // Call the name and, in parenthesis, input its arguments

/**
 * In JavaScript, functions are treated just like regular values (like numbers or strings). This means you can pass a function as an argument inside another function.

A function passed into another function as an argument is called a Callback Function (because the receiving function will "call it back" when it's ready).
 */

const fruits = ["Apple", "Banana", "Cherry"];

// The function is written directly inside forEach(...)
fruits.forEach(function(fruit) {
    console.log(fruit);
});

/**ES6 Syntax or Arrow function: the 'function(argument)' part is omitted, and only the argument is written followed by =>
    
Refinement: Omitting the parentheses around the argument only works when there is exactly ONE argument:

1 argument: Parentheses optional 
→ fruit => { ... }

0 arguments: Parentheses required 
→ () => { ... }

2+ arguments: Parentheses required 
→ (fruit, index) => { ... }
*/

fruits.forEach(fruit => {
    console.log(fruit);
});

// Return: the returned expression can be assigned to a variable

function multiplyByTwo(number){
    //console.log("standard funtion")
    let result = number * 2
    return "standard funtion "+result
}

let multiplyByTwoAnonymous = function(number){
    //console.log("anonymous funtion")
    let result = number * 2
    return "anonymous funtion "+result
}

let multiplyByTwoArrow = number => {    
    let result = number * 2;
    return "arrow function: " + result;
};


let resultReturned = multiplyByTwo(5)
let resultReturnedAnonymous = multiplyByTwoAnonymous(6)
console.log(resultReturned)
console.log(resultReturnedAnonymous)
console.log(multiplyByTwoArrow(7)); // Output: arrow function: 10

console.log((number =>{    
    let result = number*2
    return "arrow function: "+result})(8)
)

//Importing functions

import {printAge} from "../helpers/printHelper.js"

printAge(5)

// Importing everything
import * as helper from "../helpers/printHelper.js"

helper.myHelper.printInfo("Printed this text with MyHelper")
helper.printAge(10)