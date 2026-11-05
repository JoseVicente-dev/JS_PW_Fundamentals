
//Exporting the whole class
export class CustomerDetails {

    /**
     * This description was created automatically with '/**' 
     * @param {*} firstName Parameter for the first name
     */
    printFirstName(firstName) {
        console.log(firstName)
    }
}

// Exporting the instance
export const customerDetails = new CustomerDetails()

/**
 * How to Add Attributes to a Class

There are two ways to add attributes in JavaScript:

A. Inside the constructor (Dynamic values passed to new)

This is the most common way when attributes depend on input values:
 */

export class CustomerDetails2 {
    constructor(firstName, lastName) {
        // 'this' attaches attributes to the instance
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

const customer = new CustomerDetails2("John", "Smith");
console.log(customer.firstName); // "John"

/**
 * B. Directly in the Class Body (Class Fields for default values)

You can declare attributes with default values right inside the class body:
 */

export class CustomerDetails3 {
    status = "Active";       // Default attribute
    country = "USA";

    constructor(firstName) {
        this.firstName = firstName;
    }
}