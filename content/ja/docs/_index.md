
---
title: "Documentation"
linkTitle: "Documentation"
weight: 20
menu:
  main:
    weight: 20
<!-- draft: true -->
---

{{% pageinfo %}}
ドキュメントは現在準備中です。
{{% /pageinfo %}}


mimium(*MInimal-Musical-medIUM*) is a domain specific programming language for describing/generating sound and music.

With this language, you can write a low-level audio processing with an easy expression and high-performance powered by LLVM.

```rust
fn lpf(input:float,fb:float){    
    return (1-fb)*input + fb*self
}
```

A special keyword `self` can be used in function, which is a last return value of the function.
This enables an easy and clean expression of feedback connection of signal chain, inspired by [Faust](https://faust.grame.fr).

you can also write a note-level processing by using a temporal recursion, inspired by [Extempore](https://extemporelang.github.io/).

```rust

fn noteloop()->void{
    freq =  (freq+1200)%4000
    noteloop()@(now + 48000)
}

```

Calling function with `@` specifies the time when the function will be executed.
An event scheduling for this mechanism is driven by a clock from an audio driver thus have a sample-accuracy.


