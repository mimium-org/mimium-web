---
title: "Getting Started"
linkTitle: "Getting Started"
weight: 1
description: >
  Let's start your mimium experiences

---


## 実行環境

mimiumは現在以下の環境で利用可能です。

- macOS（x86のみ）
- Linux（ALSAを利用します）
- Windows 10
## インストール

[GitHub Release](https://github.com/mimium-org/mimium/releases)より最新版のバイナリをダウンロードできます。`bin/mimium`を適当な場所（macOS/Linuxであれば`/usr/local/bin`など）にコピーしてください。

macOS,Linuxユーザーの場合は[Homebrew/Linuxbrew](https://brew.sh/)を利用してインストールができます。[^bigsur]

[^bigsur]: macOS 11.0ではHomebrewでのバイナリ配布が現在行えないため、ソースからビルドが行われます。この場合XCodeのインストールなどが必要になります。

```bash
brew install mimium-org/mimium/mimium
```

手動ビルドなどより詳しい情報は [インストール](./installation)ページを参照してください。

また、エディタにVisual Studio Codeを利用している場合は拡張機能の検索から[*mimium-language*](https://github.com/mimium-org/mimium-language)をインストールすることでシンタックスハイライトが利用できます。これ以外の環境の場合はRustのシンタックスハイライトを利用すると概ね正しく表示してくれます。

## 実行

コマンドラインから`mimium`を実行することでmimiumを利用できます。正しくインストールされていれば以下のコマンドからヘルプが参照できます。

```sh
$mimium --help
```

現在の実行ディレクトリに`hello.mmm`というファイルを作成し、以下の内容をコピーしてください。
```rust
fn dsp(){
  output = sin(now*440*2*3.141595/48000)
  return (output,output)
}
```

そして、ターミナルから以下のコマンドを実行してみましょう（スピーカーの音量に注意してください）。440Hzのサイン波が聞こえてくるはずです。

```sh
$mimium hello.mmm
```

[Making Sound](./makingsound)のページからより詳しい文法の解説に進みましょう。