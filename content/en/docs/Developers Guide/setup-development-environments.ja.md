---
title: 開発環境の構築
date: 2020-12-25T09:01:01.923Z
weight: 1
description: 開発環境のインストール、デバッグ方法、テストについて
draft: false
toc_hide: false
---

## 開発環境セットアップ

mimiumはコンパイラや拡張機能の実装に、Rust言語を使用しています。

デバッグやテストも、RustのためのツールチェーンであるCargoを中心に利用します。

### Rustのインストール

Rust言語は[`rustup`](https://www.rust-lang.org/ja/tools/install)というツールを用いて、Rustコンパイラのインストールやバージョン管理ができます。

rustupはターミナル（Windowsならコマンドプロンプト）を開いて、以下のコマンドをコピーし、Enterキーで実行します。

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

設定の内容を聞かれますが、デフォルトのままインストールで問題ありません。

### Visual Studio Codeのインストール

mimiumの開発では、統合開発環境（IDE、エディターやデバッガーなど複数の機能を組み合わせたもの）として、Visual Studio Codeを使用しています。

以下のURLよりダウンロード、インストールが可能です。

https://code.visualstudio.com/

エディタを日本語化したい方は、以下のURLから、「Install」ボタンをクリックして日本語拡張パックをインストールしてください。

https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ja


### 開発リポジトリのダウンロード

Visual Studio Codeを開き、表示→コマンドパレット（Cmd＋Shift＋P）でコマンド入力画面を開き、「Clone」と検索します。

Git：クローンという候補が現れると思いますので、それをクリックしたら以下のURLを入力してください。

```sh
https://github.com/tomoyanonymous/mimium-rs.git
```

