---
title: "mimium"
linkTitle: "mimium"
---

# mimium

{{< figure src="/img/mimium_logo_slant.svg" class="center" >}}

**mimium** (*MInimal-Musical-medIUM*) is a programming language specialized for describing and generating music.

```mimium
fn dsp(){
    let phase = (now/samplerate)%1
    let r = 440* phase * 6.2831853 |> sin
    (r,r)
}
```

mimium is designed and developed not just as a tool for musicians and programmers, but also as infrastructure for distributing music in the form of source code.

mimium is a functional programming language based on lambda calculus. By adopting its own semantics, mimium allows concise expression of fundamental signal processing tasks, such as oscillators and filters, directly within the language. It also lets you represent signal processing chains as simple function pipes.

Additionally, mimium is designed to allow easy definition of native extensions within a host language, similar to Lua. This makes it easy to embed in game engines and applications.

```rust
include("core.mmm") // load midi_to_hz
include("osc.mmm")  // load sinwave
let probe1 = make_probe("gain")
let probe2 = make_probe("out")
let boundval = bind_midi_note_mono(0, 69, 127) // assign MIDI input
fn osc(freq){
    sinwave(freq, 0.0)
}
fn dsp(){
    let (note, vel) = boundval();
    let sig = note |> midi_to_hz |> osc
    let gain = vel / 127 |> probe1 
    let r = sig * gain |> probe2
    (r, r)
}
```

mimium is developed as open-source software in the following repository:

**[{{< icons/icon vendor=fab name=github >}} https://github.com/mimium-org/mimium-rs](https://github.com/mimium-org/mimium-rs)**

## Installation Instructions

mimium works on Windows, macOS, and Linux.

The easiest way to install it is through the [Visual Studio Code extension](https://github.com/mimium-org/mimium-language). This extension provides syntax highlighting, an installer for the latest runtime, and the ability to run the currently open file.

For detailed instructions, please refer to the [Installation](docs/users-guide/getting-started/) page.