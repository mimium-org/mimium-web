---
title: Transpiling to Rust
date: 2026-04-29
draft: false
bookToc: true
weight: 70
---

# Transpiling to Rust

mimium v4.1.0 introduces a transpilation feature that directly converts mimium source code into Rust source code.

You can use this feature by passing the `--emit-rust` option to `mimium-cli`, and it is also available in the [online editor](https://mimium-org.github.io/mimium-web-editor/).

## Overview

As an example, consider a simple sine-wave generator (`getnow.mmm`):

```mimium{height="500px",label="getnow.mmm"}
fn dsp(){
    let time = now * 440.0 / samplerate
    let nphase = time % 1.0 
    sin(nphase*6.2831853)
}
```

When transpiled, the generated Rust source includes a substantial amount of template code, along with code like the following:

```rust
impl<H: MimiumHost> MimiumProgram<H> {
  ...
    fn dsp(&mut self) -> Word {
        let mut reg_0 = [0u64; 1];
        let mut reg_1 = [0u64; 1];
        let mut reg_2 = [0u64; 1];
        let mut reg_3 = [0u64; 1];
        let mut reg_4 = [0u64; 1];
        let mut reg_5 = [0u64; 1];
        let mut reg_6 = [0u64; 1];
        let mut reg_7 = [0u64; 1];
        let mut reg_8 = [0u64; 1];
        let mut reg_9 = [0u64; 1];
        let mut reg_10 = [0u64; 1];
        let mut reg_11 = [0u64; 1];
        let mut reg_12 = [0u64; 1];
        let mut reg_13 = [0u64; 1];
        let mut reg_14 = [0u64; 1];
        let mut reg_15 = [0u64; 1];
        let mut reg_16 = [0u64; 1];
        reg_0[0] = f64_to_word(self.host.current_time());
        reg_1[0] = f64_to_word(440.0f64);
        reg_2[0] = f64_to_word(word_to_f64(reg_0[0]) * word_to_f64(reg_1[0]));
        reg_3[0] = f64_to_word(self.host.sample_rate());
        reg_4[0] = f64_to_word(word_to_f64(reg_2[0]) / word_to_f64(reg_3[0]));
        reg_5[0] = self.memory.alloc(1usize);
        self.memory.store(reg_5[0], &[reg_4[0]], 1usize).unwrap();
        reg_7 = vec_to_words::<1>(self.memory.load(reg_5[0], 1usize).unwrap()).unwrap();
        reg_8[0] = f64_to_word(1.0f64);
        reg_9[0] = f64_to_word(word_to_f64(reg_7[0]) % word_to_f64(reg_8[0]));
        reg_10[0] = self.memory.alloc(1usize);
        self.memory.store(reg_10[0], &[reg_9[0]], 1usize).unwrap();
        reg_12 = vec_to_words::<1>(self.memory.load(reg_10[0], 1usize).unwrap()).unwrap();
        reg_13[0] = f64_to_word(6.2831853f64);
        reg_14[0] = f64_to_word(word_to_f64(reg_12[0]) * word_to_f64(reg_13[0]));
        reg_15[0] = f64_to_word(word_to_f64(reg_14[0]).sin());
        return reg_15[0];
    }
    ...
}
```

You can use this generated source by implementing the `MimiumHost` trait. In this implementation, you provide host-side functionality for external values/functions such as `now` and `samplerate`.

Below is a minimal host implementation used in tests:

```rust
struct TestHost {
    now: f64,
    sample_rate: f64,
}

impl MimiumHost for TestHost {
    fn call_ext(
        &mut self,
        name: &str,
        _args: &[Word],
        _ret_words: usize,
    ) -> Result<Vec<Word>, String> {
        Err(format!("unexpected external call: {}", name))
    }

    fn current_time(&mut self) -> f64 {
        self.now
    }

    fn sample_rate(&mut self) -> f64 {
        self.sample_rate
    }
}

fn main() {
    let host = TestHost {
        now: 0.0,
        sample_rate: 48_000.0,
    };
    let mut program = MimiumProgram::with_host(host);

    // Uncomment when the generated source defines `call_main` and needs global initialization.
    // program.call_main().unwrap();

    for input in [0.0f64, 0.0, 0.0, 0.0] {
        let output = program.call_dsp(&[f64_to_word(input)]).unwrap();
        for word in output {
            println!("{:.12}", word_to_f64(word));
        }
    }
}
```

## Mechanism and Limitations

As you can see, the generated Rust code is not as human-readable as the original source. This is because mimium does not map source syntax trees directly to Rust syntax. Instead, it converts through an intermediate representation (MIR) first. This is similar in spirit to other languages with low-level backends, such as [Faust](https://faust.grame.fr/), [Cmajor](https://cmajor.dev/), and [Vult](https://www.vult-dsp.com/vult-language).

Compared with Faust, however, there is an important difference: Faust typically inlines nearly all signal-processing code into a single `dsp` function, while mimium keeps user-defined functions separated as Rust functions. In theory, Faust may have an advantage in raw execution speed, while mimium tends to favor smaller binary footprint.

For runtime performance, mimium is expected to be somewhat slower than Faust or Cmajor in some cases because, even after Rust transpilation, code using closures or arrays may still require small heap allocations at runtime. On the other hand, mimium can directly transpile code that Faust cannot represent, such as examples in the style of uzulang, which is a practical strength.

At the moment, parameterized I/O features such as the `Control` and `Probe` macros are not yet supported in Rust transpilation. Support for these is planned in future updates.
