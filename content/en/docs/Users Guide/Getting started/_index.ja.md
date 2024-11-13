---
title: Getting Started
linkTitle: Getting Started
date: 2021-03-08T16:24:07.776Z
weight: 1
description: |
  Let's start your mimium experiences
draft: false
toc_hide: false
---


## 実行環境

mimiumは現在以下の環境で利用可能です。

- macOS（x86のみ）
- Linux（ALSAを利用します）
- Windows 10

## Visual Studio Code拡張ではじめる

もっとも簡単にmimiumを利用する方法は無料のテキストエディタ/IDEである[Visual Studio Code](https://code.visualstudio.com/)を利用する方法です。

1. [Visual Studio Code](https://code.visualstudio.com/) を公式Webサイトからインストールする。 
2. Visual Studio Codeを起動したら、拡張機能メニューを開く。 (Cmd+Shift+X).
3. 検索欄から"mimium"と検索し、出てきた拡張をインストールする。
4. `hello.mmm'という名前でファイルを作成し、以下のコードを貼り付けて保存し、再度開く。
5. 最新版のmimiumバイナリをダウンロード、インストールするか聞くダイアログが現れるのでインストールする。
6. Cmd+Shift+P でコマンドパレットを開き、"mimium"で検索する。 "Run currently opening file" を選択すると、ターミナルが新たに立ち上がり、現在開いているファイルを実行してくれる。
7. Ctrl+Cを押すこと音を止めることができる。

```rust
// hello.mmm
fn dsp(){
  let output = sin(now*440*2*3.141595/samplerate)
  (output,output)
}
```

## その他のインストール方法

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

現在の実行ディレクトリに`hello.mmm`というファイルを作成し、上のコードをコピーして保存してください。

そして、ターミナルから以下のコマンドを実行してみましょう（スピーカーの音量に注意してください）。440Hzのサイン波が聞こえてくるはずです。

```sh
$mimium hello.mmm
```

[Making Sound](./makingsound)のページからより詳しい文法の解説に進みましょう。