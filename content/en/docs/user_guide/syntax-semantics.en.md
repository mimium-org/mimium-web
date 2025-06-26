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
- **`string`**: Created with double quotes (e.g., `"hoge"`). Strings are currently limited to:
  1. Debugging with `make_probe`
  2. Loading audio files with `make_sampler`
  3. Including other source files with `include`
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

You can get the number of elements in an array at runtime using the `length_array()` function.

```rust
let len = length_array(myarr) // len should be 10.0
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

> [!NOTE]
> In future versions, accessing tuple elements by index (e.g., `mytup.1`) will be implemented.

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
> *Currently, the pipe operator only works with functions that take a single parameter. Future updates will support unpacking tuples for functions with two or more parameters using features like parameter packs.*

### Partial Application with Underscore (`_`)

You can create a new function by using an underscore (`_`) in place of an argument during function application. For example, to create a new function `addone` that fixes one argument of the `add` function to 1:

```rust
let addone = add(_,1)
```

This is implemented as syntactic sugar, equivalent to the following:

```rust
let addone = |lambda_a1| add(lambda_a1,1)
```

When combined with the pipe operator, it can express data flow like this:

```rust
fn foo(x, y, z) {
    100.0 * x + 10.0 * y + z
}
let d2 = _ / _
let f = foo(1.0, _, 3.0)
fn dsp(){
    let x = 3.0 |>
        1.0 + _ |>
        d2(_, 2.0) |>
        f
    let y = 3.0
        |> 1.0 + _
        |> |arg| d2(arg, 2.0)
        |> f

    (x, y)
}
```

Line breaks are allowed immediately before and after the pipe operator.

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

## include

You can use the `include("path/to/file.mmm")` syntax to load other files within the current file.

If the file path is an absolute path, that path is used. If it’s a relative path, mimium first searches the standard library (`~/.mimium/lib`), and if not found, it searches relative to the current file's location.

Currently, there is no separation of namespaces for included files; the `include` statement simply replaces itself with the content of the included file. Be cautious of infinite loops when including files that depend on each other.


## BNF Grammar Definitions and Operator Precedence

TBD
