---
title: Live Coding
date: 2025-10-07
draft: false
bookToc: true
weight: 60
---

# Live Coding

mimium v3 introduces a groundbreaking **live coding feature** that allows you to modify code while it's running without interrupting audio.

## Overview

In traditional audio programming environments, changing code requires stopping and restarting audio processing. However, mimium v3's live coding feature enables:

- **No audio interruption**: Delay tails and reverb continue naturally
- **State preservation**: Feedback loops and self-oscillating systems continue operating
- **Real-time editing**: Parameters and structure can be modified in real-time

With this feature, mimium has acquired what could be called a unique capability among many music programming languages—the ability to live code very low-level DSP coding without audible interruption.

## How It Works

### Foundation Through Multi-stage Computation

The introduction of [multi-stage computation](./multistage.en.md) allows most memory layouts required for signal processing to be determined at compile time. By statically analyzing function calls from the `dsp` function, delay calls, and usage of `self`, the system operates to preserve internal states of delays and feedback as much as possible even when changes are made to the source code.

### Update Process

The new `mimium-cli` automatically detects file changes when you save an overwritten mimium file and updates the DSP with the following steps:

1. **Recompilation**: The compiler recompiles the code in a worker thread
2. **VM comparison**: The new program is compared with the running VM's program
3. **State tree construction**: Creates a tree of internal states (delays, feedback, etc.), extracts parts with no structural changes, and creates internal state memory for the new VM
4. **Seamless switching**: The audio thread seamlessly switches to the new VM

### Unique Approach

mimium v3's live coding takes a unique approach: while providing live coding functionality, it recompiles the entire source code each time to generate new bytecode and VM instances while not interrupting the sound.

This allows delay tails and reverb to continue naturally during re-evaluation, maintaining musical continuity.

Additionally, there's no need to compare all syntax trees, and when there are no changes to the internal state tree structure, such as simply changing constants, you only need to copy the memory wholesale.

Furthermore, it can naturally follow changes to audio graphs when editing compile-time constants with macro arguments, such as duplicating oscillators with multi-stage computation.

## Usage Examples

### Basic Example

Initial code:
```rust
fn dsp() {
  let freq = 440.0
  sin(phasor(freq) * 3.14159 * 2.0)
}
```

Changes during execution:
```rust
fn dsp() {
  let freq = 880.0  // Just edit and save - no restart required
  sin(phasor(freq) * 3.14159 * 2.0)
}
```

### More Complex Changes

The following changes are also possible without interrupting the sound:

- Adding new oscillators
- Changing filter parameters
- Modifying delay times
- Restructuring the audio graph
- Adding processing with additional internal states like modulation

### Structural Changes with Macros

```rust
#stage(macro)
fn oscillator_bank(n) {
  if (n > 0) {
    `{ sinwave(440.0 * $(n|>lift_f), 0.0) + oscillator_bank!(n-1) }
  } else {
    `{ 0.0 }
  }
}

#stage(main)
fn dsp() {
  oscillator_bank!(3)  // Changing this number changes the number of oscillators
}
```

In the above macro example, by changing the argument of `oscillator_bank!(3)`, you can change the number of oscillators as if it were a dynamic variable, while internal states are properly preserved.

## Technical Implementation

### state_tree Crate

The implementation uses the `state_tree` crate for state management with static memory allocation for deterministic state positioning.

The compiler statically analyzes the following elements and creates a tree of internal state usage from the `dsp` function:

- Calls to `delay` functions
- Calls to `mem`
- Usage of the `self` keyword
- Recursive calls to non-closure functions involving these

It compares trees between different versions of programs and generates patch sequences that copy internal state memory from the previous VM only for unchanged parts. Computation can proceed without blocking the audio thread until just before applying the patches.

## Usage

No special options are required. mimium-cli detects running files and automatically recompiles files when they are saved with overwrites.

The comparison of internal state trees is optimized assuming that the source code doesn't undergo very large structural changes (for example, operations like insertions or deletions at specific locations). It's more efficient to re-evaluate incrementally rather than rewriting large portions all at once.