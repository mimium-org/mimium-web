---
title: Basic Syntax & Semantics
date: 2021-01-16T10:57:29.049Z
weight: 1
description: This section covers the language specifications of mimium.
draft: false
bookHidden: false
mermaid: true
---

# Basic Syntax & Semantics of mimium

This section explains the basic syntax and semantics of the mimium language.

## Comments

As in Rust, C++, and JavaScript, anything to the right of `//` is treated as a comment.  
You can also use `/*  */` to comment out multiple lines.

## Variable Declaration and Assignment

To create a variable, use the `let` keyword followed by a name, `=`, and the value you want to assign.

```rust
let mynumber = 1000
```

If a variable with the same name already exists in the scope, the most recent `let` declaration in that scope will be referenced (without affecting the original variable). This is called **shadowing**.

```rust
fn dsp(x){
  let x = 1.0
  x // x is always 1.0, regardless of the argument provided
}
```

Assigning a value to a variable without `let` updates the existing variable.

```rust
let mynumber = 1000
mynumber = 2000 // 2000 is newly assigned to mynumber
```

> [!NOTE]
> In mimium, variables created with `let` are mutable by default (destructive assignment is always allowed). However, because mimium's function evaluation is based on **call-by-value**, destructive assignment to function arguments does not affect values outside the function.  
> Since mimium does not have imperative constructs like `for` loops, there is rarely a need to actively use destructive assignment.  
> However, closures can capture variables and allow limited read/write access outside the function.

## Types

**Types** are concepts used to distinguish data like numbers or strings based on their purpose.  
mimium is a **statically-typed** language, meaning all types are determined at compile time (before producing sound).

Statically-typed languages generally have better execution speed than dynamically-typed languages. While manually specifying types can make code verbose, mimium supports **type inference**, which automatically determines types from context, keeping code concise.

There are primitive types (smallest indivisible units) and aggregate types (combinations of multiple types).

Explicit type annotations can be added during variable and function declarations. Use `:` (colon) after the variable or parameter name to specify the type.

```rust
let myvar:float = 100
```

If you assign a different type, a compile-time error occurs:

```rust
let myvar:string = 100
```

In functions, return types are specified after the parameters, using `->`.

```rust
fn add(x:float,y:float)->float{
  x + y
}
```

In this `add` function, type annotations for `x` and `y` can be omitted due to context inference[^binaryop]:

```rust
fn add(x,y){
  x+y
}
```

[^binaryop]: Arithmetic operators like `+` and `*` only apply to numeric types. This may change in future updates.

### Primitive Types

mimium supports the following primitive types: `float`, `string`, and `void`.

- **`float`**: Represents numbers (internally as 64-bit floats). To work with integers, use functions like `round`, `ceil`, or `floor`.
- **`string`**: Created with double quotes (e.g., `"hoge"`). String values are primarily used for:

1. Debugging with `Probe!` macro
2. Loading audio files with `Sampler_mono!` macro
In more advanced use cases, strings can be parsed inside mimium to embed other DSLs. See the `mini` function used in `examples/uzulang.mmm` (a subset of mini notation).

- **`void`**: Indicates a function has no return value.

### Aggregate Types

#### Function Types

Function types are denoted as `(T1,T2,...)->T`.

#### Arrays

Arrays are a type that can store multiple values of the same type in sequence. You can create them using comma-separated values enclosed in `[]` (square brackets).

```rust
let myarr = [1,2,3,4,5,6,7,8,9,10]
```

Aggregate types like tuples (described later) can also be elements of arrays, but all elements in an array must be of the same type.

```rust
let tuparr = [(1,2),(3,4)]
```

You can extract values from an array by specifying a zero-based index in square brackets, like `myarr[0]`.

```rust
let arr_content = myarr[0] //arr_content should be 1
```

You can get the number of elements in an array at runtime using the `len()` function.

```rust
let len = len(myarr) // len should be 10.0
```

**Currently, arrays are fixed-size and immutable. You cannot append values to the end of an array. Also, there is no boundary checking, so accessing elements outside the array's range will cause a crash.**


#### Tuples

Tuples group different types together. They are created with `()` and comma-separated values:

```rust
let mytup = (100,200,300)
```

Values can be extracted by placing comma-separated variables on the left-hand side:

```rust
let (one,two,three) = mytup
```

To annotate tuple types explicitly:

```rust
let (one,two,three):(float,float,float) = mytup
```

This is equivalent to dot access using numeric indices:

```rust
let one = mytup.0
let two = mytup.1
let three = mytup.2
```

While basic arithmetic operators are usually limited to numeric values, tuples that contain only numeric elements can also use standard arithmetic operators element-wise.

#### Records

mimium v3 introduces record types (similar to structs in other languages) with syntax inspired by Elm. Records allow you to group related data together with named fields, making code more readable and maintainable.

**Basic Syntax:**

```rust
// Record literal with named fields
let myadsr_param = { 
   attack = 100.0,
   decay = 200.0,
   sustain = 0.6,
   release = 2000.0,
}

// Type annotations are optional
let myrecord = {
  freq:float = 440.0,
  amp = 0.5,
}

// Single-field records require trailing comma
let singlerecord = {
  value = 100,
}
```

**Accessing Record Fields:**

```rust
// Dot operator for field access
let attack_time = myadsr_param.attack

// Pattern matching in let bindings
let {attack, decay, sustain, release} = myadsr_param

// With partial application using underscore
let myattack = myadsr_param |> _.attack
```

**Record Update Syntax:**

Creating modified versions of records is a common pattern in functional programming. mimium v3 introduces a clean syntax for updating records:

```rust
let myadsr = { attack = 0.0, decay = 10.0, sustain = 0.7, release = 10.0 }

// Update specific fields while keeping others unchanged
let newadsr = { myadsr <- attack = 4000.0, decay = 2000.0 }
// newadsr is { attack = 4000.0, decay = 10.0, sustain = 0.7, release = 10.0 }

// Original record remains unchanged (immutable semantics)
// myadsr is still { attack = 0.0, decay = 10.0, sustain = 0.7, release = 10.0 }
```

The record update syntax is implemented as syntactic sugar and ensures functional programming semantics - creating new records rather than modifying existing ones.

#### Variant Types

Variant types (tagged unions/sum types, similar to Rust enums) represent a value that can be one of several alternatives.

You can destructure variants with `match` expressions (which can also be used with integers and tuples).

```rust
type MyEnum = One | Two | Three

fn test(e: MyEnum) {
  match e {
    One => 1,
    Two => 2,
    Three => 3
  }
}

let x = test(One)  // 1
```

Each variant case can also carry a payload:

```rust
type MyEnum = One(float)
            | Two((float, float))
            | Three((float, float, float))

fn test(e: MyEnum) {
  match e {
    One(v) => v * 1,
    Two((x, y)) => x * 2 + y * 3,
    Three((x, y, z)) => x + y + z
  }
}

let x = test(One(3))           // 3
let y = test(Two((4, 5)))      // 23
let z = test(Three((6, 7, 8))) // 21
```

##### Recursive Variants

Recursive variants are supported, but require explicit declaration with `type rec`.

```rust
type rec List = Nil | Cons(float, List)

fn sum(list: List) -> float {
    match list {
        Nil => 0.0,
        Cons(head, tail) => head + sum(tail)
    }
}

fn dsp() -> float {
    let mylist = Cons(1.0, Cons(2.0, Cons(3.0, Nil)))
    sum(mylist)
}
```

### Type Aliases

Tuple and record annotations can become long, so you can create aliases with:

```rust
type alias FilterCoeffs = (float,float,float,float,float)
```

## Multi-Stage Computation (Macros)

mimium v3 introduces **multi-stage computation** as a type-safe macro system. This allows you to generate code at compile-time for efficient audio processing.

For details on multi-stage computation, see the [Multi-Stage Computation (Macros)](./multistage.en.md) page.

## Functions

Functions encapsulate reusable procedures that take inputs and return outputs.

```rust
fn add(x,y){
  x+y
}
```

Functions are **first-class** in mimium, meaning they can be assigned to variables or passed as arguments.

```rust
let my_function:(float,float)->float = add
```

### Parameter Pack

mimium v3 introduces parameter pack functionality, allowing functions to accept tuples or records as arguments and automatically unpack them into individual parameters.

**With Tuples:**

```rust
fn add(a:float, b:float)->float {
  a + b
}

// Direct call with individual arguments
add(100, 200)  // Returns 300

// Automatic unpacking of tuples
add((100, 200))  // Returns 300

// Works seamlessly with pipe operators
(100, 200) |> add  // Returns 300
```

**With Records:**

```rust
fn adsr(attack:float, decay:float, sustain:float, release:float)->float {
  // ADSR envelope implementation...
}

// Call with a record - fields can be in any order
let params = { attack = 100, decay = 200, sustain = 0.7, release = 1000 }
adsr(params)

// Or inline
adsr({ decay = 200, attack = 100, release = 1000, sustain = 0.7 })
```

This feature is particularly useful for audio processing functions that often have many parameters.

### Default Parameters

Functions can specify default values for parameters:

```rust
fn foo(x = 100, y = 200) {
  x + y + 1
}

fn bar(x = 100, y) {
  x + y
}

fn dsp() {
  // Use empty record {} to accept all defaults
  foo({}) +           // Uses x=100, y=200, returns 301
  bar({y = 300})      // Uses x=100, y=300, returns 400
  // Total: 701
}
```

Default values work with parameter pack syntax. You can use `{}` to accept all default values and specify only the parameters you want to override.

### Anonymous Functions (Lambdas)

Anonymous functions can be created and assigned to variables:

```rust
let add = |x:float,y:float|->float {x+y}
```

They can also be called directly:

```rust
println(|x,y|{x + y}(1,2)) // prints "3"
```

### Pipe (`|>`) Operator

In mimium, the pipe operator `|>` allows you to transform nested function calls like `a(b(c(d)))` into `d |> c |> b |> a`.

The pipe operator has lower precedence than any other operator. Line breaks are allowed before and after the pipe. When combined with partial application, it can clearly express data flow.

> [!NOTE]  
> With mimium v3's parameter pack functionality, the pipe operator can now be used with functions that accept tuples or records.

### Partial Application with Underscore (`_`) and Macro Pipe (`||>`) Operator

The macro pipe (`||>`) operator looks similar to the normal pipe, but is resolved at compile time. It is typically used together with compile-time partial application via underscore `_`.

For example, assume a function `fn lowpass(input,freq,q)`. If you try to connect it with a normal pipe, you might write:

```rust
use osc::sinwave
fn lowpass(input,freq,q){
  ...
}

fn dsp(){
  sinwave(440,0)
  |> |x|lowpass(x,2000,2)
}
```

This looks fine at first glance, but the filter state is reset every sample. `|x|lowpass(x,2000,2)` means creating a newly partially-applied function every sample, so internal filter state is not preserved.

Instead, combine macro pipe with underscore:

```rust
fn dsp(){
  sinwave(440,0)
  ||> lowpass(_,2000,2)
}
```

`a ||> b` is shorthand for compile-time piping. Function application with underscore like `hoge(a,_,b)` is shorthand for creating a lambda that receives one value and places it in the underscore position. So `a ||> hoge(x,_,y)` resolves to `hoge(x,a,y)` after compilation.

### Loops with Recursion

Named functions can call themselves, allowing for recursion.

The `fact` function, which calculates the factorial, can be defined as follows:

```rust
fn fact(input:float){
  if(input>0) 1 else input * fact(input-1)
}
```

Be cautious when using recursive functions, as they may lead to infinite loops.

### `letrec`

Recursion is allowed only for top-level function definitions. It cannot be expressed with `let` and lambda expressions. To define a recursive function within a nested function, use `letrec` instead of `let`.

```rust
letrec fact = |input|{
  if(input>0) 1 else input * fact(input-1)
}
```

This is internally equivalent to the `fn` syntax. Note that variables declared with `letrec` cannot use patterns like tuple unpacking, which is possible with `let`.

### Closures

TBD

## Expressions, Statements, and Blocks

A collection of **statements** enclosed in curly braces `{}` is called a **block**. A **statement** usually consists of assignments using expressions, such as `let a = b` or `x = y`. An **expression** can be a number like `1000`, a variable symbol like `mynumber`, an arithmetic expression like `1+2*3`, or a function call like `add(x,y)`.

A **block** is actually a type of **expression**. A block can contain multiple statements, and the last expression in the block is its return value.

```rust
// mynumber should be 6
let mynumber = {
  let x = 2
  let y = 4
  x+y
}
```

## Conditional

mimium uses the `if (condition) then_expression else else_expression` syntax for conditionals.

`condition`, `then_expression`, and `else_expression` are all expressions. If the value of `condition` is greater than 0, the `then_expression` is evaluated; otherwise, the `else_expression` is evaluated.

You can express the `then`/`else` parts as blocks, like this:

```rust
fn fact(input:float){
  if(input>0){
    1
  }else{
    input * fact(input-1)
  }
}
```

Since the if syntax is an expression, the same code can be written more simply:

```rust
fn fact(input:float){
  if (input>0) 1 else input * fact(input-1)
}
```

## Modules

Modules are used to split and encapsulate functionality.

As in Rust, functions and modules marked with `pub` are exported outside their module.

```rust
mod outer {
  mod inner {
    pub fn secret() {
      42.0
    }
  }
  pub fn exposed() {
    inner::secret()
  }
}
fn dsp() {
  outer::exposed()
}
```

With `use` syntax, mimium first searches relative to the current file. If not found, it searches `~/.mimium/lib`. Using asterisk (`*`) imports all public symbols from the module.

```rust
use osc::sinwave
fn dsp(){
  sinwave(440,0)
}
```


## BNF Grammar Definitions and Operator Precedence

See https://github.com/mimium-org/mimium-rs/blob/dev/crates/lib/mimium-lang/src/compiler/parser/ebnf.md
