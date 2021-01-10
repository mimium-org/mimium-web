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


mimium（*MInimal-Musical-medIUM*）は、音楽やサウンドを表現／生成するための領域特殊性プログラミング言語です。

この言語を使うと、あなたは簡単な記述やLLVMによるハイパフォーマンス力で低レベルオーディオ処理を書くことができます。

（例１）
```rust
fn lpf(input:float,fb:float){    
    return (1-fb)*input + fb*self
}
```

特徴的なキーワード `self` は関数内で使うことができ、関数内の最後の返り値を表します。
この使い方は、[Faust](https://faust.grame.fr)に影響を受けており、シグナルチェーンのフィードバック接続を簡単かつ簡潔に表現できます。

また、一時的な再帰処理を使ってノートレベル処理を書くことができます。これは、[Extempore](https://extemporelang.github.io/)から影響を受けました。
（例２）
```rust

fn noteloop()->void{
    freq =  (freq+1200)%4000
    noteloop()@(now + 48000)
}

```

例２のように`@` を使うと、関数が実行される時間を指定して関数を呼び出すことができます。このメカニズムのためのイベントスケジューリングは、オーディオドライバーからのクロックによって駆動されるため、サンプル精度があります。


