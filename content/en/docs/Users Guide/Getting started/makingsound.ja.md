---
title: サウンドを作る
date: 2021-01-02T18:42:37.576Z
weight: 2
description: ここではmimiumを使った基本的なサウンドの作り方を学びます。
draft: false
toc_hide: true
---
## 440Hzのサイン波の音をつくろう

1. 初めに「hello.mmm」というファイルを用意します。
2. そのファイルに以下のスニペットを貼り付けて、ファイルを保存します。

```rust
fn dsp(){
    output = sin(now*440*3.14*2/48000)
    return (output,output)
}
```

1. 最後にbashなどを使って、先程のプログラムを起動します。

```bash
$ mimium hello.mmm
```
