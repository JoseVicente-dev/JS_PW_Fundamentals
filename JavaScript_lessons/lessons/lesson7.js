// Loops: repeat an operation several times// For loop syntax

/**
for (initialization; conditionToEndTheLoop; progression){
    //code to repeat    
}
*/

for (let i=0; i <5; i++){
    console.log(`Iteraion # ${i}`)
    console.log("Hello, world")
}

/**
 * 💡 Modern JS Bonus: 
 * For arrays, you can also use for...of, which doesn't require index tracking:
 */

const fruits = ["Apple", "Banana", "Cherry"];

for (let fruit of fruits) {
    console.log(fruit);
}

// ES6 syntax for each loop
/**
 * Important Gotchas with forEach
❌ You CANNOT use break or continue: forEach executes a callback function for every single item without exception:
 */

fruits.forEach(
    fruit => {
        console.log(fruit)
    }
)

/**
 * Built-in Parameters (item, index, array)

The callback function in forEach can actually receive three 

array.forEach((item, index, wholeArray) => { ... })arguments:

- item (Required): The current element.  
- index (Optional): The index number (0, 1, 2...).  
- wholeArray (Optional): The original array.
 */
const fruits2 = ["Apple", "Banana", "Cherry"];

fruits2.forEach((fruit, index) => {
    console.log(`${index + 1}. ${fruit}`);
});

// Output:
// 1. Apple
// 2. Banana
// 3. Cherry

/**
 * With Objects: Objects are collections of key-value pairs, so they do not have numeric indices (0, 1, 2) or a .length property by default.
 * 
 * Using for...in (Standard for objects)
 * 
 * for...in iterates over all the keys in an object:
 */

const customer = {
    firstName: "John",
    lastName: "Smith",
    age: 25
};

for (let key in customer) {
    console.log(`${key}: ${customer[key]}`);
}
// Output:
// firstName: John
// lastName: Smith
// age: 25

