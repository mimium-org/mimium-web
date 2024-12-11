---
title: "mimium"
linkTitle: "mimium"
---

# mimium

 ![](/img/mimium-sc.png) 

**mimium** (*MInimal-Musical-medIUM*) は音楽の記述/生成に特化したプログラミング言語です。

mimiumは音楽プログラミング言語を音楽家やプログラマーのためのツールとしてだけではなく、ソースコードという形で音楽を配布するための基盤:インフラストラクチャとなるべく設計され、開発されています。

mimiumは、ラムダ計算を基本にした関数型プログラミング言語です。独自の意味論を採用することで、オシレーターやフィルターのような非常に基本的なレベルの信号処理をmimium言語上で簡潔に表現できるほか、信号処理のチェーンを単なる関数のパイプとして表現することができます。

また、Luaのようにホスト言語上でのネイティブ拡張を簡単に定義できるため、ゲームエンジンやアプリケーションの中に埋め込んで簡単に利用することができます。

```rust
include("math.mmm")
include("osc.mmm")
include("core.mmm")
let probe1 = make_probe("gain")
let probe2 = make_probe("out")
let boundval = bind_midi_note_mono(0,69,127);
fn dsp(){
    let (note,vel) = boundval();
    let sig = note |> midi_to_hz |> osc
    let gain = vel / 127 |> probe1 
    let r = sig * gain |> probe2
    (r,r)
}
```

**[{{< icons/icon vendor=fab name=github color=#000 >}} https://github.com/tomoyanonymous/mimium-rs](https://github.com/tomoyanonymous/mimium-rs)**