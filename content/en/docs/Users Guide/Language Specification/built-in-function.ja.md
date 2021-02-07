---
title: 組み込み関数
date: 2021-01-17T03:22:59.561Z
weight: 2
description: mimiumでライブラリなしで利用できるプリミティブな関数
draft: false
toc_hide: false
---
mimiumにおける組み込み関数について説明します。

## delay(input:float,time:float)->float

入力をtime（単位:sample）だけ遅らせた値を返します。

{{< alert color="warning" >}}
timeの最大値は現在44100サンプルで固定されており、実際のディレイタイムにかかわらず44100サンプルを保存できるだけのメモリが必ず確保されています。これは将来的にコンパイル時定数の機能実装によって改善される予定です。
{{< /alert >}}

たとえばディレイはselfと組み合わせることで以下のようなフィードバックディレイを作ることが可能です。

```rust
fn fbdelay(input:float,time:float,feedback:float){
    return delay(input*self*feedback,time)
}
```

## random()->float

-1~1のランダムな値を返します。
C++言語上での実装は以下のようになっています。
```cpp
 (double)rand() / RAND_MAX) * 2 - 1
```
## 数学関数

C言語のmath.hの以下の関数を呼び出します。注記がない場合は1つのfloatを受け取り1つのfloatを返却します。

- `sin`
- `cos`
- `tan`
- `asin`
- `acos`
- `atan`
- `atan2` (x,y)
- `sinh`
- `cosh`
- `tanh`
- `log`
- `log10`
- `exp`
- `pow` (x,y)
- `sqrt`
- `abs`
- `ceil`
- `floor`
- `trunc`
- `round`
- `fmod` (x,y)　`%`演算子はこの関数へのエイリアスです
- `remainder` (x,y)
- `min` (x,y) fminへのエイリアス
- `max` (x,y) fmaxへのエイリアス


## print / println / printstr

デバッグ用途などに利用される関数です。
標準出力に値を出力します。
`print`、`println`は数値型のみを受け付けます。`println`は改行を入れて出力します。
`printstr("hoge")`のようにすると文字列の出力が可能です

## loadwav(path:string)->[float x 0] / loadwavsize(path:string)->float

LibSndFileを利用してオーディオファイルを読み込みます。
どちらもオーディオファイル（.wav、.aiff、.flacなど）のファイルパスをパラメータにとります。
パスは絶対パスでなければソースファイルの位置を基準とした相対パスとして解釈されます。

`loadwavsize(path)`はオーディオファイルのサンプル数を返却します。

`loadwav(path)`はオーディオファイルを読み込み配列として返却します。
ファイルサイズより大きいインデックスでアクセスした場合はクラッシュしますので、loadwavsizeの値を利用して値を制限して使用する必要があります。

{{< alert color="warning" >}}
ファイル読み込みは仮の実装となっているため、1chのオーディオファイルのみが利用できます。
今後構造体の導入により、1つの関数でサンプル数、チャンネル数、サンプルレート、各チャンネルへの配列などをまとめて取得できるような仕様に変更される予定です。
{{< /alert >}}