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

## Functions Provided by System Plugins

These functions are implemented as system plugins and may not work in all environments.

### mimium-guitools

Provides a simple oscilloscope feature using the Rust GUI library `egui`.

`make_probe(name:string) -> (float) -> float`

Running `make_probe` with a probe name as an argument returns a new function that takes a numerical value as input, sends it to the GUI, and returns the same value.

For example, consider the following code:

```rust
include("osc.mmm")
fn dsp() -> float{
  let sig = sinwave(440, 0)
  sig
}
```

You can use the pipe operator with `make_probe` for debugging:

```rust
include("osc.mmm")
let myprobe = make_probe("test")
fn dsp() -> float{
  let sig = sinwave(440, 0)
            |> myprobe
  sig
}
```

### mimium-midi

- **`set_midi_port(name:string) -> void`**  
  Specifies the device name to use for MIDI input. If this function is not called or an invalid device name is specified, the runtime will attempt to use the system’s default MIDI device.

- **`bind_midi_note_mono(ch:float, note_init:float, vel_init:float) -> () -> (float, float)`**  
  Returns a function for receiving note data on the specified channel. When executed, this function returns the latest note input as a tuple `(note, velocity)`. (Note-off signals are treated as note-on signals with a velocity of 0.)

### mimium-symphonia

**`gen_sampler_mono(path:string) -> (float) -> float`**  

Loads an audio file using the Rust library Symphonia. It accepts the file path of an audio file (e.g., `.wav`, `.aiff`, `.flac`). If the path is not absolute, it is interpreted as a relative path based on the source file's location.

Running `gen_sampler_mono(path)` returns a function that takes an array index as input and returns the corresponding sample value.

For example, the following code loops a loaded WAV file every second:

```rust
let mywav = gen_sampler_mono("./assets/bell.wav")
fn phasor(){
    (self + 1.0) % 48000.0
}
fn dsp(){
    mywav(phasor())
}
```

> [!NOTE]  
> File loading is a temporary implementation, so only mono audio files can be used.  
> APIs for obtaining sample length will be added in the future. Currently, accessing out-of-range indices returns 0.  
> Future updates will introduce structures that allow retrieving sample count, channel count, sample rate, and arrays for each channel within a single function.

