---
title: サウンドを作る
date: 2021-01-02T18:42:37.576Z
weight: 1
description: ここではmimiumを使った基本的なサウンドの作り方を学びます。
draft: true
---
## 440Hzのサイン波の音をつくろう

1. 初めに「sin.mmm」というファイルを用意します。この時点で*mimium*をインストールできていない場合は、「 [*インストール*](https://mimium.org/en/docs/getting-started/installation/)」 を参照してください。
1. そのファイルに下記コードスニペットを貼り付けて、ファイルを保存します。

```rust
fn dsp(time){
    return sin(now*440*3.14*2/48000)
}
```

コードスニペットは、下記のようにワンライナーとして記述することもできます。

```rust
dsp = |t|{ sin(now*440*3.14*2/48000) }
```

1. 最後にbashなどを使って、先程のプログラムを起動します。

```bash
$ mimium sin.mmm
```