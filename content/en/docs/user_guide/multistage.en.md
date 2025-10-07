---
title: Multi-Stage Computation (Macros)
date: 2025-10-07
draft: false
bookToc: true
weight: 50
---

# Multi-Stage Computation (Macros)

mimium v3 introduces a powerful feature called **multi-stage computation**. This feature is inspired by [MetaOCaml](https://okmij.org/ftp/ML/MetaOCaml.html), [Scala 3 macros](https://docs.scala-lang.org/scala3/guides/macros/), and [SATySFi](https://github.com/gfngfn/SATySFi), allowing you to write macros that generate code at compile-time while maintaining type safety.

## Overview

Multi-stage computation is a mechanism that divides computation into different stages. mimium primarily has the following two stages:

- **Stage 0 (macro)**: Executed at compile-time
- **Stage 1 (main)**: Executed at runtime (during audio processing)

This feature allows what are called macros to be based on the same lambda calculus as the code that runs directly at runtime, rather than manipulating source code or syntax trees. **The most significant feature is that type checking and inference are completed before macro expansion.**

## Motivation

Audio processing often involves two distinct phases:

1. **Building the computation graph** (determining structure)
2. **Executing the computation graph** (sample processing)

In traditional approaches, creating parametric audio graphs required executing higher-order functions in the global environment before use. This is because signal processing memory is allocated for the first time when the higher-order function is executed, which means generating a new processor every sample.

Multi-stage computation allows this problem to be solved more naturally and efficiently.

## Basic Syntax

Multi-stage computation has the following basic syntax elements:

### Primitives

1. **Quote** (`` `expr ``): Marks an expression for evaluation in the next stage
2. **Splice** (`$expr`): Evaluates and inserts an expression from the previous stage
3. **Macro call syntax** (`f!(args)`): Syntactic sugar for `${f(args)}`

### Type System

A `Code` type is added to the type system as the type for values evaluated in the next stage as seen from stage 0. For example, when evaluating a `float` type value at stage 1, it is treated as a `` `float`` type at stage 0.

## Usage Examples

### Basic Example

```rust
#stage(macro)
fn mymacro(n:float) -> `float {
  `{ $n * 2.0 }
}

#stage(main)
fn dsp() {
  mymacro!(21)  // Result is 42.0
}
```

### Parametric Filter Bank

Traditional approach using higher-order functions:

```rust
fn bandpass(x,freq){
    // Bandpass filter implementation
}

fn filterbank(n,filter_factory:()->(float,float)->float){
  if (n>0){
    let filter = filter_factory() 
    let next = filterbank(n-1,filter_factory)
    |x,freq| filter(x,freq+n*100) + next(x,freq)
  }else{
    |x,freq| 0
  }
}

let myfilter = filterbank(3,| | bandpass)  // Graph generation here
fn dsp(){
    myfilter(input, 1000)
}
```

Approach using multi-stage computation:

```rust
#stage(main)
fn bandpass(x, freq) {
  // Bandpass filter implementation...
}

#stage(macro)
fn filterbank(n, filter) {
  if (n > 0) {
      let newf = lift_f(freq + n*100)
    `{ 
        |x,freq| filter(x,$newf) + filterbank!(n-1, filter)(x, freq)
    }
  } else {
    `{ |x,freq| 0 }
  }
}

#stage(main)
fn dsp() {
  filterbank!(3, `bandpass)(input, 1000)
  // Generates an unrolled filterbank at compile-time
}
```

Here, the `lift_f` function is a new built-in function that converts numbers computed at stage 0 into numeric literals embedded at stage 1. (Lifting of composite types is currently not supported)

### Power Function Generation

This is a more classic example of multi-stage computation. For cases like `p^q` where q is predetermined, for example when q is 4, it's more efficient to generate a function like `p*p*p*p` in advance rather than performing recursive checks at runtime each time. This example can be written in mimium as follows:

```rust
#stage(macro)
fn genpower(n:float) -> `(float)->float {
    letrec aux = |n:float, x| {
        if (n > 1) {
            `{ $x * $(aux(n-1, x)) }
        } else {
            x
        }
    }
    `{ |x:float| $(aux(n, `x)) }
}

#stage(main)
fn dsp() {
   genpower!(3)(2.0)  // Compiled to 2.0 * 2.0 * 2.0 = 8.0
}
```

## Global Stage Declaration

As you move between stages while maintaining variable scope, the nesting of quotes and splices becomes increasingly deep.

To avoid deeply nested brackets, mimium v3 introduces global-level stage declarations:

```rust
#stage(macro)
// Everything below here is evaluated at compile-time (Stage 0)
fn mymacro(n:float) -> `float {
  `{ $n * 2.0 }
}
let compile_time_constant = 42

#stage(main)
// Everything below here is evaluated at runtime (Stage 1)
fn dsp() {
  mymacro!(21)  // Result is 42.0
}
```

## Benefits

Using multi-stage computation provides the following benefits:

1. **Performance improvement**: Compile-time expansion of computation graphs reduces runtime overhead[^performance]
2. **Type safety**: Type checking is completed before macro expansion, allowing early detection of type errors
3. **Enhanced expressiveness**: Complex parametric audio processing can be described naturally
4. **Live coding**: Since internal state memory layout is determined at compile-time, differential updates of internal state memory are possible when source code is updated (see [Live Coding](./livecoding.en.md))

[^performance]: Regarding performance improvements through compile-time computation, while improvements can be expected in cases where dynamic if statement execution can be reduced (such as pre-generating factorial functions), there is currently almost no performance difference between parametrically generating oscillators as higher-order functions in the global environment and computing them at compile-time. This is partly due to the lack of optimization for mimium's MIR and bytecode, so this may change in the future.

## Notes

Multi-stage computation is a somewhat niche computational paradigm, so it may take some time to get used to. In particular, variables defined in stage 0 and stage 1 can only be used within the same stage, and using them in the wrong stage will result in compilation errors. It's good to start with simple examples to get familiar with where to change stages and where to use `lift_f` to carry variables to the next stage.

Only built-in functions can be called from both stages in the same way, but extending this to allow user-defined stage-persistent variable definitions is a future challenge.