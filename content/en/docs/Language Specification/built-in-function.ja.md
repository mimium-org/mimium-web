---
title: 組み込み関数・変数
date: 2021-01-17T03:22:59.561Z
weight: 2
description: mimiumでライブラリなしで利用できるプリミティブ関数
draft: false
toc_hide: false
---

# 組み込み関数・変数

mimiumにおける組み込み関数や最初から使える変数について説明します。

## now: float

`now`はDSPを実行し始めてから現在までの経過時刻を**サンプル単位**で返却します。例えばサンプルレートが48000Hzなら1秒経過後のnowの値は48000になります。

## samplerate: float

オーディオドライバのサンプルレートの値を、Hz単位で取得できます。

## delay(size:const float,input:float,time:float)->float

入力をtime（単位:sample）だけ遅らせた値を返します。sizeは最大の遅延時間をサンプルサイズで指定します。

> [!WARNING]
> sizeはコンパイル時に評価される特別な値なので、**数値リテラルのみ**で代入する必要があります（他のコンパイル時決定可能な値に依存する式を評価できるように今後改良予定です）。

たとえばディレイは以下のように`self`と組み合わせることでフィードバックディレイを作ることが可能です。

```rust
fn fbdelay(input:float,time:float,feedback:float){
    delay(44100,input*self*feedback,time)
}
```

## 数学関数

一般的な算術演算関数として、以下のものが使用できます。

- `sin`
- `cos`
- `tan`
- `asin`
- `acos`
- `atan`
<!-- - `sinh`
- `cosh`
- `tanh` -->
- `log`　（log関数は自然対数）
- `pow` (x,y)
- `sqrt`
- `abs`
- `ceil`
- `floor`
- `round`
- `fmod` (x,y)　`%`演算子はこの関数へのエイリアスです
- `remainder` (x,y)
- `min` (x,y)
- `max` (x,y)


## print / println / probe / probeln

デバッグ用途などに利用される関数です。
標準出力に値を出力します。`print`、`println`は数値型のみを受け付ける、`(float)->void`な関数です。`println`は改行を入れて出力します。

また、`probe`、`probeln`は、与えられた入力を、標準出力に値を出しつつそのまま返す`(float)->float`な関数です。こちらもデバッグ用です。

## システムプラグインにより提供される関数

これらの関数はシステムプラグインとして実装されています。一部の環境では動作しない可能性があります。

### mimium-guitools

RustのGUIライブラリ`egui`を利用した簡易的なオシロスコープ機能を提供します。

`make_probe(name:string)->(float)->float`

使用するプローブ名を引数として`make_probe`を実行すると、数値型を引数とする新しい関数が返り値として受け取れます。この関数は入力された値をGUIへ送り、同じ値を返却します。

例えば次のようなコードがあったとして、

```rust
include("osc.mmm")
fn dsp()->float{
  let sig= sinwave(440,0)
  sig
}
```

パイプ演算子と組み合わせて以下のように使用すると、`|> myprobe`のある行をコメントアウトで切り替えることでGUIへの送りを制御できてデバッグに便利です。

```rust
include("osc.mmm")
let myprobe = make_probe("test")
fn dsp()->float{
  let sig　= sinwave(440,0)
            |> myprobe
  sig
}
```


### mimium-midi

- `set_midi_port(name:string)->void` MIDIインプットに使用するデバイス名を指定します。この関数を使わなかったり、存在しないデバイス名を指定した場合、ランタイムはシステムのデフォルトMIDIデバイスを使用を試みます。

- `bind_midi_note_mono(ch:float,note_init:float,vel_init:float)->()->(float,float)`　指定したチャンネルのノートデータを受け取るための関数です。この関数をグローバル環境で実行すると、引数を取らない新たな関数が返却されます。この関数は実行すると、指定したチャンネルのノート入力の最新の値を`(note,velocity)`のタプルの値として受け取れます。（ノートオフ信号はベロシティ0のノートオンとして扱われます。）

### mimium-symphonia 

`gen_sampler_mono(path:string)->(float)->float`

RustのライブラリSymphoniaを利用してオーディオファイルを読み込みます。
オーディオファイル（`.wav`、`.aiff`、`.flac`など）のファイルパスをパラメータにとります。パスは絶対パスでなければソースファイルの位置を基準とした相対パスとして解釈されます。


`gen_make_sampler_mono(path)`を実行すると、配列のインデックスを入力に取り、その値を返す関数が返ってきます。

例えば以下のようなコードで、読み込んだwavファイルを1秒ごとでループすることができます。

```rust
let mywav = gen_sampler_mono("./assets/bell.wav")
fn phasor(){
    (self+1.0) % 48000.0
}
fn dsp(){
    mywav(phasor())
}

```


> [!NOTE]
> 
> ファイル読み込みは仮の実装となっているため、1chのオーディオファイルのみが利用できます。
> 
> サンプルの長さの取得のAPIを今後追加予定です。また現在配列の範囲外へのアクセスは0を返します。
> 
> 今後構造体の導入により、1つの関数でサンプル数、チャンネル数、サンプルレート、各チャンネルへの配列などをまとめて取得できるような仕様に変更される予定です。
> 