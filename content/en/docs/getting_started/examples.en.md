---
title: Examples
date: 2021-01-17T03:13:24.793Z
weight: 1
description: The entry point for the beginners of mimium - step by step example.
draft: true
bookHidden: false
---
1. dsp
2. "self" example
3. a simple effect
4. composition
5. [sol-fa](#example-sol-fa)
6. rhythm pattern

## Example: *sol-fa*

In the example below, the system's audio driver sample rate is 48000 Hz, and it will play *sol-fa sounds* every second.

```rust
notes = [440,495,260.7,293.3,330,347.7,391.1]
index = 0
fn updateIndex(){
  index = (index+1)%7
  updateIndex()@(now+48000)
}
updateIndex()@48000
fn dsp(){
 vol = 0.2
 octave = 1
 sec = now/48000
 freq = notes[index]
 out = vol * sin(octave*freq*3.14*2*sec)
 return (0,out)
}
```

### Point 1: Arrays.

`notes = [440,495,260.7,293.3,330,347.7,391.1] // 1st line`

In mimium, you can define an array. Arrays are defined using `[]`. The beginning of the index is 0.
In this example, the first line of the array that creates the *sol-fa sounds* note contains the frequencies of the A-B-C-D-E-F-G notes, which are used in subsequent processing.

* A: 440Hz
* B: 495Hz
* C: 260.7Hz
* D: 293.3Hz
* E: 330Hz
* F: 347.7Hz
* G: 391.1Hz

The way to use arrays is to use `array_name[index]`, as in line 12.
`freq = notes[index] // line 12`.

### Point 2: Temporal Recursion

```rust
// Lines 3~7
fn updateIndex(){
  index = (index+1)%7
  updateIndex()@(now+48000)
}
updateIndex()@48000
```

V0.3.0 does not adopt the for-loop statement that most languages have. However, you can describe repetitive executions of the function by using a design pattern called temporal recursion as shown in lines 3~6.
In the sol-fa example, after executing `updateIndex()` at 48000 samples in line 7, the `now` and `@` keywords are used together in the function to execute `updateIndex()` at 48000 samples from the current time (line 5).

### Point 3: Using the `now` and `@` keywords together

`updateIndex()@(now+48000) // line 5`

In mimium, the current number of samples can be retrieved using `now`. Users should note that in the v0.3.0 current specification, the `now` keyword does not represent real-time. The unit is sample[^samplerate].

[^samplerate]: mimium currently does not provide a way to get a samplerate of the audio driver. In the future, this will be realized by introducing environment-variables(runtime-defined variables).

Also, mimium has a `@` keyword, which means "execute the function before `@` when the number of samples is the number of values resulting from the calculation of the expression after `@`.

The `@` time indicates the absolute time since the audio driver was started, so if you write `updateIndex()@48000` as in line 7, it will always execute `updateIndex()` once 48000 samples after it was started.
In the fifth line of the example, by connecting `now` and `48000` with the `+` keyword, we can determine the sample point in time from the current time, and by using `@`, we can execute the function at that sample point.

### Point 4: Octave

```rust
// Lines 8~15
fn dsp(){
 vol = 0.2
 octave = 1
 sec = now/48000
 freq = notes[index]
 out = vol  *sin(octave*freq*3.14*2*sec)
 return (0,out)
}
```

In the musical scale, there is a relationship between doubling the frequency (Hz) and going up an octave, and conversely, halving the frequency and going down an octave. In lines 8 to 15 of the example, the value is fixed at `octave = 1`, so it plays a *sol-fa sounds* from 260.7Hz to 495Hz, but if you change this value to 2, for example, you can express a scale that goes up an octave.