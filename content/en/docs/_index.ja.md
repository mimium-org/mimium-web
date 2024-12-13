---
title: ドキュメント
linkTitle: Documentation
date: 2021-01-03T05:09:54.533Z
menu:
  main:
    weight: 20
description: mimiumの概要
draft: false
---

> [!NOTE]
> ドキュメントはv2のリリースに伴い更新中の部分を含みます。


mimium（*MInimal-Musical-medIUM*）は、音楽やサウンドを表現・生成するためのプログラミング言語です。

mimiumを使うと、信号処理を関数として簡潔に記述することができます。

### mimiumのソースコード例1

以下のmimiumのコードを見てみましょう。

```rust
fn lpf(input,fb){    
    (1-fb)*input + fb*self
}
```

このコードはローパスフィルタ、すなわち入力信号 `input` の高音域をカットし低音域のみを通すフィルタをmimiumで実装したものです。`fb`の値を1.0に近づけるほど低周波の信号のみが出力されます。ここで、`self` は関数内でのみ使うことができるmimiumの特別な予約語で、その関数の一時刻前の計算結果を参照できます。

このキーワードは音楽プログラミング言語[Faust](https://faust.grame.fr)に影響を受けたもので、信号処理におけるフィードバック接続を簡単かつ簡潔に記述できるものです。

### mimiumのソースコード例2

また、mimiumでは「継時再帰」 (temporal recursion) を用いて音符単位の処理を書くことができます。以下のコードを見てみましょう。

```rust
let freq = 1000.0
fn noteloop(){
    freq = (freq+1200)%4000
    noteloop()@(now + samplerate)
}
```

このコードは1秒おきに周波数 `freq` の値を `1200` 加算する関数の定義です。

`@` を使うと、関数が実行される時間を指定して関数を呼び出すことができます。これを実現するイベントスケジューリング機構はオーディオドライバとの連携で行われるため、サンプル単位の精度を持ちます。

この機能は音楽プログラミング言語[Extempore](https://extemporelang.github.io/)から影響を受けたものです。
