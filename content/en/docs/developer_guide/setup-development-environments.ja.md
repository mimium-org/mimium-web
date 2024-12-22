---
title: 開発環境の構築
date: 2024-11-19
weight: 1
description: 開発環境のインストール、デバッグ方法、テストについて
draft: false
bookHidden: false
---

# 開発環境セットアップ

mimiumはコンパイラや拡張機能の実装に、Rust言語を使用しています。

デバッグやテストも、RustのためのツールチェーンであるCargoを中心に利用します。

## Rustのインストール

Rust言語は[`rustup`](https://www.rust-lang.org/ja/tools/install)というツールを用いて、Rustコンパイラのインストールやバージョン管理ができます。

rustupはターミナル（Windowsならコマンドプロンプト）を開いて、以下のコマンドをコピーし、Enterキーで実行します。

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

設定の内容を聞かれますが、デフォルトのままインストールで問題ありません。

## Visual Studio Codeのインストール

mimiumの開発では、統合開発環境（IDE、エディターやデバッガーなど複数の機能を組み合わせたもの）として、Visual Studio Codeを使用しています。

以下のURLよりダウンロード、インストールが可能です。

https://code.visualstudio.com/

エディタを日本語化したい方は、以下のURLから、「Install」ボタンをクリックして日本語拡張パックをインストールしてください。

https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ja


## 開発リポジトリのダウンロード

Visual Studio Codeを開き、表示→コマンドパレット（Cmd＋Shift＋P）でコマンド入力画面を開き、「Clone」と検索します。

Git：クローンという候補が現れると思いますので、それをクリックしたら以下のURLを入力してください。

```
https://github.com/mimium-org/mimium-rs.git
```

## ワークスペースを開く

エクスプローラー/Finderでダウンロードしたリポジトリの`mimium-rs.code-workspace`というファイルを開きます。`.code-workspace`は、VSCode上での作業環境を環境に依らず統一するための設定ファイルで、必要な拡張機能、エディタや拡張機能の設定、デバッガー用の設定などが書き込まれています。

最初にこのワークスペースファイルを開くと、必要な拡張機能をインストールするダイアログが出てくるので、指示に従ってインストールしてください。インストールされる拡張は以下の通りです。

- mimium-language(mimiumソースコードファイル（.mmm）のシンタックスハイライト)
- Even Better TOML(Cargo.tomlなどRustで使用するTOMLファイルのフォーマッター)
- rust-analizer (RustのLanguage Server、シンタックスハイライトや型ヒント、様々な補完機能を提供)
- CodeLLDB （デバッガー、Rustでのブレークポイントを用いたデバッグ機能に必要）

## 開発中のmimium-cliを実行する

```
cd mimium-cli
cargo run -- <オプション> <実行したいファイルのmimium-cliからの相対パス>
```

開発に便利なオプションとしては以下のようなものがあります。

```
--emit-ast LISPライクな形式でパース直後のシンタックスツリーを出力
--emit-mir SSA形式の中間表現を出力
--emit-bytecode VM用のバイトコードを出力
--output-format=CSV --times=10 先頭の10サンプルの計算結果をCSV形式で出力
```

## LLDBでのデバッグ

VSCodeの左サイドバーのデバッグタブをクリックします。

`Debug executable "mimium-cli"(workspace)`という項目を選択します。

このコンフィグは標準で`mimium-cli/examples/sinewave.mmm`をオプションなしで実行します。実行するファイルを切り替えたい場合は`mimium-rs.code-workspace`内の以下の行の内容を変更してください。

```json
      {
        "type": "lldb",
        "request": "launch",
        "name": "Debug executable 'mimium-CLI'",
        "cargo": {
          "cwd": "${workspaceFolder}",
          "args": ["build", "--bin=mimium-cli", "--package=mimium-cli"],
          "filter": {
            "name": "mimium-cli",
            "kind": "bin"
          }
        },
        //この部分でmimium-cliに与える引数を変更（ファイル名はワークスペースのルートからの相対パス）
        "args": ["mimium-cli/examples/sinewave.mmm"],
        "cwd": "${workspaceFolder}"
      },
```


## テストの実行

ワークスペースのルートフォルダで以下のコマンドを実行してください。

```
cargo test
```

## ベンチマークの実行

ワークスペースルートフォルダで以下のコマンドを実行してください。

```
cargo bench
```


> [!NOTE]
> ベンチマーク機能を使用するためには、RustのツールチェーンをNightlyにスイッチする必要があります。未インストールの場合以下のコマンドでインストールし、
> 
> ```
> rustup install nightly
> ```
> 
> 以下のコマンドで使用するツールチェーンのデフォルトをnightlyにできます。(この設定は他のRustでの開発プロジェクトに影響を与える可能性があるので注意してください。)
> 
> ```
> rustup default nightly
> ```
