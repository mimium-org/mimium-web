---
title: Unique Features of mimium
date: 2021-01-17T03:32:12.504Z
weight: 2
description: This section explains the distinctive language features of mimium.
draft: false
bookHidden: false
---

# Unique Language Features of mimium

## Signal Feedback with `self`

Inside a function, you can use the special keyword `self`. `self` is a variable that references the last value returned by the function. For example, the following function returns an incremented value each time it is called.

```rust
fn counter(increment){
  self+increment
}
```

`self` is initialized to 0 when the audio engine starts, and a separate `self` value is generated and managed for each call context. In the following example, the `counter` function is called with different `increment` values. Internally, two separate pieces of memory are allocated for `self`: `lch` increases by 0.01 per sample and resets to 0 when it exceeds 1, while `rch` increases by 0.05 per sample.

```rust
fn dsp()->(float,float){
  let lch = counter(0.01)%1
  let rch = counter(0.05)%1
  (lch,rch)
}
```

> [!NOTE]
> Currently, `self` is always initialized to 0 or, in the case of tuples, all members are initialized to 0. The ability to change this initial value is under consideration. Also, if `self` becomes a function type or a tuple containing a function type, it will result in a compilation error.

## Scheduling with the `@` Operator

By appending the `@` operator and a numeric value to a `void` function (a function with no return value), you can delay the function’s execution (the unit of time is in samples).

For example, the following code defines a function `updater` that changes the frequency of an oscillator and recursively calls itself after 1 second. This pattern is known as **Temporal Recursion** and is used in languages like [**Extempore**](https://extemporelang.github.io/).

```rust
include("osc.mmm")
let freq = 100

fn updater(){
    freq = (freq + 1.0)%1000
    println(freq)
    updater@(now+1.0*samplerate)
}
updater@1.0
fn dsp(){
    sinwave(freq,0.0)
}
```

However, this scheduling works by combining functions with destructive assignment, which does not pair well with functional data flows. In practice, it is useful to combine this with higher-order functions that update stateful functions at slower intervals rather than on a per-sample basis, such as the `metro` function in the `reactive.mmm` library.

```rust
fn metro(interval,sig:()->float)->()->float{
    let v = 0.0
    letrec updater = | |{
      let s:float =sig();
      v = s
      let _ = updater@(now+interval);
    }
    let _ = updater@(now+1)
    | | {v}
}
```

Using the `metro` function, the previous code that updates the frequency at regular intervals can be rewritten as follows:

```rust
include("osc.mmm")
include("reactive.mmm")
fn counter(){
    (self+100)%1000
}
let myfreq:()->float = metro(1.0*samplerate ,counter);
fn dsp(){
    let r = sinwave(myfreq(),0.0) * 0.5
    (r,r)
}
```