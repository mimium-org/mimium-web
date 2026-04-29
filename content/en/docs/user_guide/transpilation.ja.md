---
title: Rustへのトランスパイル
date: 2026-04-29
draft: false
bookToc: true
weight: 70
---

# Rust言語へのトランスパイル

mimium v4.1.0の機能として、mimiumのソースコードをRust言語のソースコードへ直接変換するトランスパイル機能が追加されました。

この機能は、mimium-cliでは`--emit-rust`オプションを指定することで、また[オンラインエディタ](https://mimium-org.github.io/mimium-web-editor/)でも利用することができます。


## 概要

例えば、サイン波を出力する簡単なコード(exampleの`getnow.mmm`)を例にしてみましょう。

```mimium{height="500px",label="getnow.mmm"}
fn dsp(){
    let time = now * 440.0 / samplerate
    let nphase = time % 1.0 
    sin(nphase*6.2831853)
}
```

このコードをトランスパイルすると、多くのテンプレートコードとともに、次のようなコードを含むRustソースコードが生成されます。


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

このソースコードは、`MimiumHost`というトレイトを実装することで簡単に利用することができます。`MimiumHost`の実装には、`now`や`samplerate`のような外部関数機能を提供する必要があります。

以下は、テストで使用している最小限のホストの実装例です。

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
        self.now += 1.0;
    }
}
```

## 仕組みと制限

見ての通り、生成されたRustコードは元のコードほど可読性の高いものではありません。これは、ソースコードのシンタックスツリーを直接マッピングしているのではなく、中間表現（MIR）を通じてRustに変換しているためです。これは[Faust](https://faust.grame.fr/)や[Cmajor](https://cmajor.dev/)、[Vult](https://www.vult-dsp.com/vult-language)といった低級言語への変換機能を持つ他の言語でも似たようなものです。

ただし、Faustと比べると、Faustがほぼ全ての信号処理を一つの`dsp`関数にインライン化するのに比べて、mimiumでは全ての関数定義はRust上でも関数として分割して定義されます。理論的には、Faustの方が実行スピードとしては優れる一方で、mimiumではバイナリサイズのフットプリントを抑える方向に働くはずです。

実行スピードに関しては、FaustやCmajorと比較すると、mimiumはRustに変換した後でもクロージャや配列を使うコードには小さなランタイムでのヒープメモリ確保を行う形式をとっている都合上多少速度が劣ることが推測されます。ただし、uzulangのサンプルのような、Faustでは実現不可能なコードもRustに直接変換できることはmimiumの利点と言えるでしょう。

現在のところ、`Control`や`Probe`マクロのような入出力のパラメーターを与える機能はまだサポートされていません。これは今後のアップデートで対応予定です。