//Objects

let customer = {
    firstName: 'John',
    lastName: "Smith"
}

console.log(customer)
// dot notation
customer.firstName = 'Johannes'

console.log(customer)

// bracket notation

customer['lastName'] = "Silver"

console.log(customer)

// arrays

let car = ["Volvo","Toyota","Tesla"]
console.log(car)

// arrays - acceder
console.log(car.at(0))
console.log(car[1])

// arrays - modificar
car[2]='Ford'
console.log(car)

// array - añadir elemento. No son de tamaño fijo
car[3]='Honda'
console.log(car)

// objects - añadir elemento. Igual que un array, no son de tamaño fijo
customer.car = car
console.log(customer)
