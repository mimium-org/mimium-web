---
title: 音楽プログラミングとは？
date: 2021-01-02T18:42:37.576Z
weight: 2
description: ここではmimiumを使った基本的なサウンドの作り方を学びます。
draft: false
bookHidden: false
---

# 音楽プログラミングとは？

この項ではmimiumを使って、プログラムや計算で音を作るとはどういうことかについて学んでいきます。

## 440Hzのサイン波の音をつくろう

1. 初めに「hello.mmm」というファイルを用意します。
2. そのファイルに以下のスニペットを貼り付けて、ファイルを保存します。

```rust
include("osc.mmm")
fn dsp(){
  sinwave(440.0,0.0)
}
```

VSCodeのファイルタブ右上の再生ボタンをクリックすると、ファイルが実行されて、440Hzのサイン波（純音）が再生されます。Enterを押すと再生が停止します。

![](/img/vscode1.jpeg)

## 何が起きているのか？

mimiumに限らず、コンピューター上で音は数値の列として表現されます。1秒間に48000回の数値が、電圧に変換され、スピーカーの前後の移動位置を制御し、それが空気の振動を生み出して私たちの耳まで届くのです。

mimiumでは、`dsp`という名前の関数を定義することで、オーディオアウトプットに送られる波形を決められます。出力する数値（≒音量）の範囲は-1から1までです。

どのような波形がオーディオドライバに送られているか観察してみましょう。先程のコードに次のようなものを追記します。

```rust
include("osc.mmm")
let myprobe = make_probe("test")
fn dsp(){
  myprobe(sinwave(440.0,0.0))
}
```

このコードを実行すると、新しくオシロスコープのウィンドウが実行中立ち上がります。

![](/img/vscode2.jpeg)

`let myprobe = make_probe("test")`という行は、`make_probe`という関数を実行した結果を、`myprobe`という名前を付けた`変数`としてあとで利用できるようにするものです。

`make_probe`を実行すると、GUIに値を転送する用の新しい関数が値として返ってきます。新しく作られた`myprobe`関数は入力された値をGUIに送り、元の値を返す関数です。

mimiumには関数適用`f(x)`を`x |> f`として書ける **パイプ演算子** があるので、次のような書き方も可能です。

```rust
include("osc.mmm")
let myprobe = make_probe("test")
fn dsp(){
    sinwave(440.0,0.0)
  　    |> myprobe
}
```

## ステレオ再生

先程の`dsp`関数は、数値を返却していました。ここで、返却する値を複数の値の **組（タプル）** にすると、ステレオ信号を出力できます。ためしに、右チャンネルに440という数値から300に変えたものを送ってみましょう。

```rust
include("osc.mmm")
let p_left = make_probe("left")
let p_right = make_probe("right")

fn dsp(){
    let left = sinwave(440.0,0.0) |> p_left
    let right = sinwave(300.0,0.0) |> p_right
    (left,right)
}
```

`(left,right)`という部分で、値を組として返しています。

![](/img/vscode3.jpeg)

ヘッドフォンで聴いている人は、左チャンネルより低い音が右側から聴こえていると思います。

## 周波数と音の高さ

先程値を変更した`440`や`300`といった値は、**周波数** と呼ばれる、1秒間にどれくらい細かく空気を振動させるかという値です。`440Hz`は1秒間にスピーカーの440回往復することを意味します。440Hzはピアノの中央ド（A4）に相当する音の高さです。

この周波数も、また計算によって変更することができます。

```rust
include("osc.mmm")
let myprobe = make_probe("test")
fn dsp(){
    let freq = 440 * (sinwave(1.0,0.0)+2.0)
    sinwave(freq,0.0)
      |> myprobe
}
```

このコードでは、周波数440Hzに対して、1秒周期で変動するサイン波で変動させています（モジュレーション）。`sinwave(1.0,0.0)`は-1.0から1.0までの範囲で動くので、+2.0することで範囲を1~3に変更しています。結果として、freqは440Hzから3倍の1320Hzまでを1秒周期で往復します。

## 音の大きさ

オーディオドライバに送れる値の範囲は-1~1と説明しました。つまり、ずっと0だけを送り続けていればスピーカーは振動せず無音になるということです。

では、ある音の音量を半分くらいに下げたい時にはどうすれば良いのでしょうか？

...そう、単に出力される計算結果に0.5を掛けてあげればよいのです。（ただし、波形の大きさを0.5倍にしたからといって、必ずしも聴こえの音量が半分になるわけではありません。）



```rust
include("osc.mmm")
let myprobe = make_probe("test")
fn dsp(){
    let freq = 440 * (sinwave(1.0,0.0)+2.0)
    sinwave(freq,0.0) * 0.5
      |> myprobe
}
```


もちろん、この音量自体もサイン波のような信号で変調することができます。これは、**トレモロ** と呼ばれるエフェクトと同じ効果です。

```rust
include("osc.mmm")
let myprobe = make_probe("test")
fn dsp(){
    let freq = 440 * (sinwave(1.0,0.0)+2.0)
    let gain = (sinwave(3,0.0)+1.0)/2.0
    sinwave(freq,0.0) * gain
      |> myprobe
}
```

音量カーブに応じて波形が変化しているのが見て取れると思います。

![](/img/vscode4.png)

トレモロの周波数を3から20程度まで上げていくと、段々と音量の変化自体が1つの低い音程として聞こえるようになってきます。これは、20Hzが人が音として知覚できる最低限の高さだからです。

20Hz以上の波形同士を掛け算することで得られるエフェクトは、リングモジュレーション(RM)やアンプリチュードモジュレーション(AM)と呼ばれます。同様に、周波数を高速で変更するようなエフェクトは周波数変調（Frequency Modulation:FM）と呼ばれます。