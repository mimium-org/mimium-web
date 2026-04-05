---
title: Built-in Functions and Variables
date: 2021-01-17T03:22:59.561Z
weight: 3
description: Primitive functions available in mimium without libraries
draft: false
bookHidden: false
---

# Built-in Functions and Variables

This section explains the built-in functions and variables available in mimium.

## now: float

`now` returns the elapsed time **in samples** since DSP execution started. For example, if the sample rate is 48,000 Hz, the value of `now` will be 48,000 after one second.

## samplerate: float

Returns the sample rate of the audio driver in Hz.

## delay(size:const float, input:float, time:float) -> float

Returns the input delayed by `time` (in samples). `size` specifies the maximum delay time in samples.

> [!WARNING]  
> `size` is a special value evaluated at compile time, so it must be assigned using **numeric literals only** (future improvements may allow evaluating expressions that depend on other compile-time values).

For example, you can create a feedback delay by combining `delay` with `self` as shown below:

```rust
fn fbdelay(input:float, time:float, feedback:float){
    delay(44100, input * self * feedback, time)
}
```

## mem(input:float)->float

`mem` is a single-sample version of delay.

## Mathematical Functions

In mimium, you can use following infix arithmetic operations.

- `+` addition
- `-` subtraction (can be unary operator)
- `*` multiplication
- `/` division
- `^` power
- `%` modulo


Also, the following arithmetic functions are available:

- `sin`
- `cos`
- `tan`
- `asin`
- `acos`
- `atan`
- `sinh`
- `cosh`
- `tanh`
- `log` (natural logarithm)
- `pow` (x, y)
- `sqrt`
- `abs`
- `ceil`
- `floor`
- `round`
- `fmod` (x, y) – the `%` operator is an alias for this function
- `remainder` (x, y)
- `min` (x, y)
- `max` (x, y)

## Boolean operation

In mimium, boolean operation is done by treating number as true when it is larger than 0, otherwise false.

The built-in boolean operation functions returns 1 if the value means true, otherwise 0.

- `<`
- `>`
- `>=`
- `<=`
- `==`
- `!=`
- `&&`
- `||`

## print / println / probe / probeln

These functions are used for debugging purposes and output values to the standard output.  
- `print` and `println` accept numerical values and have the type `(float) -> void`.  
  `println` outputs with a newline.  
- `probe` and `probeln` accept numerical inputs, output their values to the standard output, and return the same values. Their type is `(float) -> float`.
  Avoid using them in code paths that run every sample, as this can significantly reduce performance.

## Functions Provided by System Plugins

These functions are implemented as system plugins. They do not work in web environments.

### mimium-guitools

Provides a simple oscilloscope feature using the Rust GUI library `egui`.

#### ``Probe(name:string)->`(float)->float``

Running `Probe!("name")` with a probe name as an argument returns code for a new function that takes a numerical value as input. This function is implemented as a [macro](multistage.en.md), so it's typical to call it as `Probe!("test")` within a dsp context.

This function sends the input value to the GUI and returns the same value.

For example, consider the following code:

```rust
use osc::*
fn dsp()->float{
  let sig = sinwave(440,0)
  sig
}
```

You can use it with the pipe operator as shown below. By commenting/uncommenting the line with `|> Probe!("test")`, you can control sending to the GUI, which is convenient for debugging:

```rust
use osc::*
fn dsp()->float{
  let sig = sinwave(440,0)
           |> Probe!("test") // Can be removed by commenting out
  sig
}
```

#### ``Control(name:string,init:a)->`a``

Adds a simple dynamically editable parameter to the GUI. This function is also executed as a macro, so it's common to call it with `Control!`.

```rust
use osc::*
fn dsp()->float{
  let sig = Control!("freq",440)
           ||> sinwave(_,0)
           |> Probe!("test")
  sig
}
```

`Control` is generic. If you pass a record or tuple as the second argument, grouped sliders are shown together.

```rust
use osc::*
fn dsp()->float{
  let param = Control!("param",{
    freq = 440,
    amp = 0.7
  })
  let sig = sinwave(param.freq,0) * param.amp
           |> Probe!("test")
  sig
}
```

You can edit parameter min/max values by clicking the numeric box. With the same source code, initial values are preserved and restored as much as possible using egui persistent values.

### mimium-midi

- **`set_midi_port(name:string) -> void`**  
  Specifies the device name to use for MIDI input. If this function is not called or an invalid device name is specified, the runtime will attempt to use the system’s default MIDI device.

- **``midi_note_mono(ch:float, note_init:float, vel_init:float) ->`{pitch:float,velocity:float}``**  
  Embeds a record for receiving note data on the specified channel. When executed, this function returns the latest note input as a record `{pitch:float,velocity:float}`. (Note-off signals are treated as note-on signals with a velocity of 0.)

### mimium-symphonia 

``Sampler_mono!(path:string)->`{player:(float)->float,length:float}``

Loads an audio file using the Rust library Symphonia. It accepts the file path of an audio file (e.g., `.wav`, `.aiff`, `.flac`). If the path is not absolute, it is interpreted as a relative path based on the source file's location.

Running `Sampler_mono!(path)` returns a record with two values: a function that takes an array index and returns the sample value, and the length of the loaded sample.

For example, the following code loops a loaded WAV file:

```rust
let sampler = Sampler_mono!("assets/bell.wav")
fn counter(){
  self+1.0
}
// add -1.0 offset so that the counter starts from 0 at t=0
fn dsp(){
  let player = sampler.player
  let len = sampler.length
  player((counter()-1.0)%len) |> Probe!("out")
}
```

> [!NOTE]  
> File loading is a temporary implementation, so only mono audio files can be used.  
> Accessing out-of-range indices returns 0.

