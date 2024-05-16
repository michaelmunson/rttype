import { Type } from "./type";

const strNumArr = new Type(["string","number"]);

type StrNumArr = Type.From<typeof strNumArr> // (string|number)[]

const myInterface = new Type({
    name : "string",
    age : "number",
    friends : [{name: "string", age: "number"}],
})

type MyInterface = Type.From<typeof myInterface>


const union = new Type.Union(['string','number'])
type Union = Type.From<typeof union>