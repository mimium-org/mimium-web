---
title: "mimium"
linkTitle: "mimium"
---

# mimium

{{< figure src="/img/mimium_logo_slant.svg" class="center" >}}

**mimium** (*MInimal-Musical-medIUM*) は音楽の記述/生成に特化したプログラミング言語です。

mimiumは音楽プログラミング言語を音楽家やプログラマーのためのツールとしてだけではなく、ソースコードという形で音楽を配布するための基盤:インフラストラクチャとなるべく設計され、開発されています。

mimiumは、ラムダ計算を基本にした関数型プログラミング言語です。独自の意味論を採用することで、オシレーターやフィルターのような非常に基本的なレベルの信号処理をmimium言語上で簡潔に表現できるほか、信号処理のチェーンを単なる関数のパイプとして表現することができます。

また、Luaのようにホスト言語上でのネイティブ拡張を簡単に定義できるため、ゲームエンジンやアプリケーションの中に埋め込んで簡単に利用できることを目指しています。

```rust
include("core.mmm")//load midi_to_hz
include("osc.mmm") //load sinwave
let probe1 = make_probe("gain")
let probe2 = make_probe("out")
let boundval = bind_midi_note_mono(0,69,127) //assign midi input
fn osc(freq){
    sinwave(freq,0.0)
}
fn dsp(){
    let (note,vel) = boundval();
    let sig = note |> midi_to_hz |> osc
    let gain = vel / 127 |> probe1 
    let r = sig * gain |> probe2
    (r,r)
}
```

mimiumはオープンソースソフトウェアとして、以下のリポジトリで開発されています。

**[{{< icons/icon vendor=fab name=github  >}} https://github.com/mimium-org/mimium-rs](https://github.com/mimium-org/mimium-rs)**



## インストール方法

mimiumはWindows、macOS、Linux全てのOSで動作します。

[Visual Studio Codeの拡張機能](https://github.com/mimium-org/mimium-language)でインストールするのが最も簡単な方法です。シンタックスハイライトに加えて、最新版の実行環境のインストーラー機能、開いているファイルを実行する機能を兼ねています。

詳しい解説は[インストール](docs/users-guide/getting-started/)ページを参照してください。

