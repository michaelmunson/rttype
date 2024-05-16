# RTType
Runtime typing in for TypeScript

## Usage
```typescript
import {Type} from "rttype"

const strNumArr = new Type(["string","number"]);

type StrNumArr = Type.From<typeof strNumArr> // (string|number)[]

```

```typescript
type StrNumArr = (string|number)[]
```
### Interfaces
```ts
const myInterface = new Type({
    name : "string",
    age : "number",
    friends : [{name: "string", age: "number"}],
})

type MyInterface = Type.From<typeof myInterface>
```
```ts
type MyInterface = {
    name: string;
    age: number;
    friends: {
        name: string;
        age: number;
    }[];
}
```