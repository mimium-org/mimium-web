---
title: ドキュメント
linkTitle: Documentation
date: 2021-01-03T05:09:54.533Z
menu:
  main:
    weight: 20
description: mimiumに関する概要
draft: false
---

{{% pageinfo %}}
ドキュメントは現在準備中です。
{{% /pageinfo %}}


mimium（*MInimal-Musical-medIUM*）は、音楽やサウンドを表現／生成するためのドメイン特化プログラミング言語です。

mimiumを使うと、LLVMに裏打ちされた高いパフォーマンスを享受しつつ、簡潔な記述で低レベルなオーディオ処理を書くことができます。

### mimiumのソースコード例1

以下のmimiumのコードを見てみましょう。

```rust
fn lpf(input:float,fb:float){    
    return (1-fb)*input + fb*self
}
```

このコードはローパスフィルタ、すなわち入力信号 `input` の高音域をカットし低音域のみを通すフィルタをmimiumで実装したものです。

mimiumのキーワード `self` は関数内でのみ使うことができるキーワードで、その関数が最後に呼び出されたときの返り値が格納されています。このキーワードは音楽プログラミング言語[Faust](https://faust.grame.fr)に影響を受けており、信号処理におけるフィードバック接続簡単かつ簡潔に記述できるものです。

### mimiumのソースコード例2

また、mimiumでは「時間再帰」 (temporal recursion) を用いて音符単位の処理を書くことができます。以下のコードを見てみましょう。

```rust
fn noteloop()->void{
    freq = (freq+1200)%4000
    noteloop()@(now + 48000)
}
```

このコードは1秒おきに周波数 `freq` の値を `1200` 加算する関数の定義です。

`@` を使うと、関数が実行される時間を指定して関数を呼び出すことができます。これを実現するイベントスケジューリング機構はオーディオドライバの要求によって駆動される、サンプル単位の精度を持ちます。

この機能は音楽プログラミング言語[Extempore](https://extemporelang.github.io/)から影響を受けました。
