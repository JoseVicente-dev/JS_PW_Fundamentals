
export function printAge(age){
    console.log("This function is invoked from another file and gives the age: "+age)
}








/**
 * Question 1: Is functionName: () => { ... } a valid way to declare functions?

Yes, but ONLY inside an Object ({ ... }).

It is not a standalone variable declaration. It is an Object property (or method):

The Difference:
Standalone variable: Uses = 
→
→ const printInfo = (text) => { ... };
Object property: Uses : inside {} 
→
→ { printInfo: (text) => { ... } }

 */
// ✅ VALID: Inside an object literal
export const myHelper = {
    printInfo: (text) => console.log(text) // 'printInfo' is an object property key
};

myHelper.printInfo("Hello");