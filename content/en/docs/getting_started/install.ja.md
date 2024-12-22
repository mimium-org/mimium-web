---
title: インストール
date: 2021-03-08T16:24:07.776Z
weight: 1
description: mimiumのインストール方法
draft: false
bookHidden: false
---

# mimiumのインストール方法

## 実行環境

mimiumは現在以下の環境で利用可能です。

- macOS（x86/arm64）
- Linux（ALSAを利用します）
- Windows 11 (WSLではMIDIプラグインが動作しません)

## Visual Studio Code拡張ではじめる

mimiumのインストールは、無料のテキストエディタ/IDEである[Visual Studio Code](https://code.visualstudio.com/)の拡張機能を使うのが簡単でおすすめです。

1. [Visual Studio Code](https://code.visualstudio.com/) を公式Webサイトからインストールする。 
2. Visual Studio Codeを起動したら、拡張機能メニューを開く。 (Cmd+Shift+X).
3. 検索欄から"mimium"と検索し、出てきた拡張をインストールする。
4. `hello.mmm'という名前でファイルを作成し、以下のコードを貼り付けて保存し、再度開く。
5. 最新版のmimiumバイナリをダウンロード、インストールするか聞くダイアログが現れるのでインストールする[^macOS]。
6. Cmd+Shift+P でコマンドパレットを開き、"mimium"で検索する。 "Run currently opening file" を選択すると、ターミナルが新たに立ち上がり、現在開いているファイルを実行します。
7. ターミナルでEnterかCtrl+Cを押すこと音を止めることができます。

[^macOS]: VSCode拡張では、macOSはApple Sillicon用のバイナリを自動でインストールしようとします。Intel CPUのMacを使用している場合は手動でのインストールが必要です。


```rust
// hello.mmm
fn dsp(){
  let output = sin(now*440*2*3.141595/samplerate)
  (output,output)
}
```

## 手動でのインストール方法

[GitHub Release](https://github.com/mimium-org/mimium-rs/releases)より最新版のバイナリをダウンロードできます。`mimium-cli`を適当な場所（macOS/Linuxであれば`~/.mimium`）にコピーしてください。

## インストールディレクトリ

VSCode拡張でインストールされるmimiumのコマンドラインツールおよびライブラリ、サンプルファイルはユーザーのホームディレクトリ(Windowsであれば%HOME%、macやLinuxでは`~`)以下の`.mimium`ディレクトリです。includeで外部ファイルを読み込む際は、まず`~/.mimium/lib`を探すので、ライブラリがこの場所にインストールされているようにしてください。


## ターミナルから実行

コマンドラインから`mimium-cli`を実行することでもmimiumを利用できます。利用するためには、`~/.mimium`へパスが通っている必要があります。

macOSなら、`~/.zshrc`というファイルを開いて、以下の行を追記して保存ください。

```
export PATH="$PATH:$HOME/.mimium"
```

保存したら一度ターミナルを起動しなおしましょう。


正しく設定されていれば以下のコマンドからヘルプが参照できます。

```
mimium-cli --help
```

現在の実行ディレクトリに`hello.mmm`というファイルを作成し、上のコードをコピーして保存してください。

そして、ターミナルから以下のコマンドを実行してみましょう（スピーカーの音量に注意してください）。440Hzのサイン波が聞こえてくるはずです。

```
mimium-cli hello.mmm
```

[Making Sound](./makingsound)のページからより詳しい文法の解説に進みましょう。