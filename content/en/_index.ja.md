---
title: "mimium"
linkTitle: "mimium"
---

# mimium


> [!INFO]🎉 **mimium v3がリリースされました!** 
> レコード型、多段階計算(マクロ)、ライブコーディング機能など、多くの新機能が追加されています。
> 詳細は[v3リリースノート](docs/releasenotes/v3)をご覧ください。




{{< figure src="/img/mimium_logo_slant.svg" class="center" >}}

```mimium
#stage(main)
let PI = 3.14159265359
fn phasor_shift(freq,phase_shift){
    (self + freq/samplerate + phase_shift)%1.0
}
fn sinwave(freq,phase){
    phasor_shift(freq,phase)*2.0*PI |> sin
}
fn osc(freq){
  sinwave(freq,0.0)
}
#stage(macro)
fn cascade (n,gen){
    if (n>0.0){
        let multiplier = 1.0-(1.0/(n*0.2)) |> lift_f
        `|rate| rate - ($gen)(rate/10) * rate * $multiplier  
                    |> $cascade(n - 1.0 ,gen)
    }else{
        `|rate| ($gen)(rate)
    }
}
#stage(main)
fn fbdelay(input,time,fb,mix){
    input*mix + (1.0-mix) * delay(40001.0,(input+self*fb),time)
}
fn dsp(){
    let time_r = osc(0.015) *1500
    let time_l = osc(0.01) *1000
    let f = 700
    let r =  (f |> cascade!(6,`osc))*0.2
    let l = fbdelay(r,20400+time_l,0.9,0.7)
    let r = fbdelay(r,20000+time_r,0.9,0.7)
    (r,r)
}
```

**mimium** (*MInimal-Musical-medIUM*) は音楽の記述/生成に特化したプログラミング言語です。

mimiumは音楽プログラミング言語を音楽家やプログラマーのためのツールとしてだけではなく、ソースコードという形で音楽を配布するための基盤:インフラストラクチャとなるべく設計され、開発されています。

mimiumは、ラムダ計算を基本にした関数型プログラミング言語です。独自の意味論を採用することで、オシレーターやフィルターのような非常に基本的なレベルの信号処理をmimium言語上で簡潔に表現できるほか、信号処理のチェーンを単なる関数のパイプとして表現することができます。

また、Luaのようにホスト言語上でのネイティブ拡張を簡単に定義できるため、ゲームエンジンやアプリケーションの中に埋め込んで簡単に利用できることを目指しています。

```rust
include("core.mmm") // load midi_to_hz
include("osc.mmm")  // load sinwave

fn osc(freq){
    sinwave(freq, 0.0)
}
fn dsp(){
    let note = midi_note_mono!(0, 69, 127) // assign MIDI input
    let sig = note.pitch |> midi_to_hz |> osc
    let gain = note.velocity / 127 |> Probe!("gain")
    let r = sig * gain |> Probe!("out")
    (r, r)
}
```

mimiumはオープンソースソフトウェアとして、以下のリポジトリで開発されています。

**[{{< icons/icon vendor=fab name=github  >}} https://github.com/mimium-org/mimium-rs](https://github.com/mimium-org/mimium-rs)**



## インストール方法

mimiumはWindows、macOS、Linux全てのOSで動作します。

[Visual Studio Codeの拡張機能](https://github.com/mimium-org/mimium-language)でインストールするのが最も簡単な方法です。シンタックスハイライトに加えて、最新版の実行環境のインストーラー機能、開いているファイルを実行する機能を兼ねています。

詳しい解説は[インストール](docs/users-guide/getting-started/)ページを参照してください。

