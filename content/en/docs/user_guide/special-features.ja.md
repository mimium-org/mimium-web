---
title: mimium固有の機能
date: 2021-01-17T03:32:12.504Z
weight: 2
description: このセクションでは、mimiumの特徴的な言語機能について説明します。
draft: false
bookHidden: false
---

# mimium固有の言語機能

## `self`による信号フィードバックの表現

関数の中では、`self`という特別なキーワードが使用できます。
`self`は関数が最後に返した値を参照できる変数です。たとえば、以下のような関数を作ると呼び出される度`increment`ずつ増える値を返します。

```rust
fn counter(increment){
  self+increment
}
```

`self`はオーディオエンジンが開始された時に0で初期化され、呼び出しコンテキストごとに別々の値が生成、管理されます。
たとえば以下の例では`counter`関数にそれぞれ異なる`increment`を与えていますが、この場合内部的に`self`のためのメモリは2つ分確保され、`lch`は毎サンプル0.01ずつ増えて1を越えるたび0にリセットされ、`rch`は毎サンプル0.05ずつ増えます。

```rust
fn dsp()->(float,float){
  let lch = counter(0.01)%1
  let rch = counter(0.05)%1
  (lch,rch)
}
```

> [!NOTE]
> selfは現在常に0か、タプルであれば全てのメンバが0になるような形で初期化されます。この初期値を変更する方法は現在検討中です。またself自体が関数型や関数型をメンバに含むタプル型になる場合はコンパイルエラーになります。



## `@`演算子によるスケジューリング

`void`型の（返り値を持たない）関数に続けて`@`演算子、とさらに数値型の値を続けることで、関数の実行を遅らせることができます。（時間の単位はサンプルです。）

例えば次のコードではオシレーターの周波数を変更して、再帰的に自分自身を1秒後に呼び出すような関数`updater`を定義しています。このパターンは**Temporal Recursion**と呼ばれるもので、[**Extempore**](https://extemporelang.github.io/)のような言語で使われているものです。

```rust
include("osc.mmm")
let freq = 100

fn updater(){
    freq = (freq + 1.0)%1000
    println(freq)
    updater@(now+1.0*samplerate)
}
updater@1.0
fn dsp(){
    sinwave(freq,0.0)
}
```

ただし、このスケジューリングの関数は破壊的代入との組み合わせによって効果を成す物なので、関数型のデータフローとの相性があまり良くありません。実際に使う際には、ライブラリの`reactive.mmm`にある`metro`関数のように、ステートフルな関数をサンプル単位ではなく遅い間隔で更新する高階関数と組み合わせて使うのが便利でしょう。


```rust
fn metro(interval,sig:()->float)->()->float{
    let v = 0.0
    letrec updater = | |{
      let s:float =sig();
    v = s
      let _ = updater@(now+interval);
    }
    let _ = updater@(now+1)
    | | {v}
}
```

`metro`関数を使うと、同じように一定間隔で周波数を更新する先程のコードは次のように書くことができます。

```rust
include("osc.mmm")
include("reactive.mmm")
fn counter(){
    (self+100)%1000
}
let myfreq:()->float = metro(1.0*samplerate ,counter);
fn dsp(){
    let r = sinwave(myfreq(),0.0) * 0.5
    (r,r)
}
```