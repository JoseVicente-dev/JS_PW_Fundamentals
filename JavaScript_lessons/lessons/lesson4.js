//Relational or comparisson operators

// > more than
// < less than
// >= more than equal
// <= less than equal

let result1 = 4 > 5
let result2 = 4 >= 5
let result3 = 4 < 5
let result4 = 4 <= 5

console.log(result1)
console.log(result2)
console.log(result3)
console.log(result4)

let number = 1
console.log(`Is number value == to '1'? ${number=='1'}`) //loose comparisson: converts the value and compares it
console.log(`Is number value and type === to '1'? ${number==='1'}`) //strict comparisson: does not converts the value. Compares value AND type
console.log(`Is number value and type === to 1? ${number===1}`) //strict comparisson: does not converts the value. Compares value AND type