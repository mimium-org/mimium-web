---
title: Built-in Function
date: 2021-01-17T03:22:59.519Z
weight: 2
description: This section describes the built-in function in mimium.
draft: false
toc_hide: false
---
This section describes the built-in function in mimium.
## delay(input:float,time:float)->float

Returns delayed `input` value with the duration of `time`(unit: samples).


> [!NOTE]
> The maximum value of time is currently fixed at 44100 samples, and there is always enough memory to store 44100 samples regardless of the actual delay time. This will be improved in the future with the implementation of compile-time constant functionality.

For example, the delay can be combined with self to create a feedback delay as shown below.

```rust
fn fbdelay(input:float,time:float,feedback:float){
    return delay(input*self*feedback,time)
}
```

## random()->float

Returns random value in a range of -1 to 1。An acutual implementation on C++ uses rand() function in C standard library like below.

```cpp
 (double)rand() / RAND_MAX) * 2 - 1
```

## Basic mathematical functions

Listed functions in math.h of C language is included in mimium by default.

Takes one float and returns one float if it has no explanation.

- `sin`
- `cos`
- `tan`
- `asin`
- `acos`
- `atan`
- `atan2` (x,y)
- `sinh`
- `cosh`
- `tanh`
- `log`
- `log10`
- `exp`
- `pow` (x,y)
- `sqrt`
- `abs`
- `ceil`
- `floor`
- `trunc`
- `round`
- `fmod` (x,y)　`%` operator is an alias to this function.
- `remainder` (x,y)
- `min` (x,y) alias to `fmin` in C language.
- `max` (x,y) alias to `fmax` in C language.


## print / println / printstr

Mainly used for debugging purpose.

Print values to stdout.
`print`,`println` accept number type as parameter.
`println` output value with newline.
You can output string type values by using `printstr`.

## loadwav(path:string)->[float x 0] / loadwavsize(path:string)->float

Load audio files by using LibSndFile.

Both take the file path of the audio file (.wav, .aiff, .flac, etc.) as a parameter.

If the path is not absolute, it is interpreted as relative to the location of the source file.

`loadwavsize(path)` returns the number of samples of the audio file.

`loadwav(path)` returns the audio file as a read array.
If you access the file with an index larger than the file size, it will crash, so you need to use the value of loadwavsize to limit the value.

> [!NOTE]
> File loading is a temporary implementation, so only 1-channel audio files can be used.
> In the future, with the introduction of the structure, the specification will be changed so that you can get the number of samples, channels, sample rate, and arrays to each channel all in one function.
> 