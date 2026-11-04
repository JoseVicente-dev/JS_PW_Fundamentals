// TypeScript is a strongly typed language

let customerFirstName = "John"
let customerLastName = "Smith"
let customerAge = 25

// Once a variable is declared, the type is assigned to it (Type Inference), so trying to assign a different type, throws an error: Type 'number' is not assignable to type 'string'. Once inferred, TypeScript locks in that type and protects it from incompatible assignments.

//customerFirstName = 100

//Explicit type assignment (Type Annotation)
let customerNewFirstName: string = "Juan"
let customerNewLastName: string = "Forja"
let customerNewAge: number = 30

// Custom type: The type keyword creates your own reusable shape/contract for an object.
type Customer = {firstName: string, lastName: string, active: boolean}

// The previous declaration prevents from creating a type Customer without the defined Properties or Fields. TypeScript enforces the exact "contract" of Customer. If you forget active, or add a misspelled property like firstNames, TypeScript flags it with a compile-time error.
let firstCustomer: Customer ={
    firstName: "Mary",
    lastName:"Johns",
    active:true
}

/**
 * 💡 Bonus Tip on Optional Properties: If you ever want a property in your custom type to be optional, add a question mark ?:
 */

type NewCustomer = {
    firstName: string;
    lastName: string;
    active: boolean;
    phoneNumber?: string; // Optional! Customer can be created with or without this
};