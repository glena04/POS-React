concept of class and object in a programing language
class is a blueprint of an object.

Example 1.
Car is class
Oddi, Toyota, ferrari, Nissan - Object

Example 2.
Motor cycle as class
BMW, Honda, Kawasaki, Suzuki acts object.

what is OOPs?
Object oriencted programing.

Car has engine, wheels, chase, seats, lots of complex cable connection, engine oil, fuel tank.
when star wants to drive a car he dosen't wants to know each and every component of the car, 
he just needs to know about steering wheel, gear, brake and paddle

four pillars of OOPs
i. abstraction - The process of hiding unnessary details and showing only the essential details.
ii. Encapsulation - 
iii. Inheritance - 
iv. Polymorphism - poly means many, and morphism means form, a component behaving differently in different situations.
example - single function can work differently in different situations.

i.what is constructor?
constructor is function that is called when a class is created to initialize the class varibales.
Example
class Car
{
    constructor(str, str1, str2){
        this.brand = str;
        this.milage = str1;
        this.owner = str2;   // this refers to address of current object
    }
    printInfo(){
        console.log('This car belongs to ', this.owner);
        console.log(`Hi, there the brand of the is car`, this.brand);
        console.log('this milage of the car is', this.milage)
    }
}

// class can be created once and can be used where ever we want by creating an object out of the class

const Carobj1 = new Car('Honda', '20kmpl', 'Afham');
const Carobj2 = new Car('BMW', '18kmpl', 'Star');
const CarObj3 = new Car('Oddi', '15kmpl', 'Stehpen')
Carobj1.printInfo();
console.log('\n\n')
Carobj2.printInfo();
console.log('\n\n');
CarObj3.printInfo();



--------------------------------------------------------------------------------------------------------------
const arr = [2, 5, 8, 7, 3]

// multiply each number by 2 and print.
// for(let i=0;i<arr.length;i++)
//     console.log(arr[i]*2)
    
    
function twice(n){
    console.log(n*2);
}

// twice(6)
// console.log(arr.forEach((n)=>n*2))

arr.forEach(twice)
console.log('--------------------------------')

arr.forEach((n)=> console.log(n*2))

// forEach : takes all the elements of the array and send to the callback function
// callback function : a function that is sent as a argument to another function

homework for you

i. forEach function, map function, callback function, arrow function, one line function, 