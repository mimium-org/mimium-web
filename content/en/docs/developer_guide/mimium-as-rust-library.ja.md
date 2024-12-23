---
title: Rustでmimiumを使う
date: 2021-01-16T23:12:18.732Z
weight: 2
description: mimiumの実行環境はコア機能、プラグイン、フロントエンドに分割して実装されています。現在のプロジェクト構成は主に以下のように分けられます。
draft: false
bookHidden: false
---

# Rustライブラリとしてのmimium

mimiumの実行環境はコア機能、プラグイン、フロントエンドに分割して実装されています。現在のプロジェクト構成は主に以下のように分けられます。

- コア機能
    - `mimium-lang`
    - `mimium-test`
- プラグイン
    - システムプラグイン
        - `mimium-scheduler`
        - `mimium-guitools`
        - `mimium-midi`
        - `mimium-audiodriver`
    - UGenプラグイン
        - `mimium-symphonia`
- フロントエンド
    - `mimium-cli`

各プラグインは言語のコア機能に、フロントエンドは言語とプラグイン双方に依存するような関係です。

## プラグインシステム

mimium v2コンパイラでは、特定のRustクレートやプラットフォーム依存を分離するため、オーディオファイル読み込みやMIDIなどの外部IO機能を別クレートに分割できるようなインターフェースを持っています。

プラグイン用のトレイトは2種類あります。

`Plugin`トレイトは基礎となるプラグイン用インターフェースで、以下の3つ組の値を定義することでmimiumから外部関数として呼び出すことが可能になります。

- mimium上で呼び出す関数名
- mimium上での型シグネチャ
- 実際に実行される関数（Rustのクロージャもしくは関数ポインタをラップする形で作成）

実際の処理を行う関数は`Rc<RefCell<dyn FnMut(&mut Machine) -> ReturnCode>>`という型を持っており、`&mut Machine`からmimiumのVM上のスタックを操作することで計算を行います。

通常のシステムプラグインを使用する場合は、このRustクロージャ1インスタンスがmimium上でも1つのクロージャインスタンスに相当します。

### システムプラグイン

`SystemPlugin`トレイトを通じて定義される**システムプラグイン**は、外部関数を介して**ランタイムに付随するグローバルなインスタンス**の状態の操作が可能なものです。

また、システムプラグインはmimium上での関数実行だけでなく、初期化時、グローバル環境の評価直後、信号処理の各サンプルの処理終了後など様々なタイミングでのコールバックを登録することができます。

mimiumの特徴的な機能である`@`演算子を用いたスケジューリングも、このシステムプラグインを介して実現されています。


## Rust上でmimiumを使用する

TBD
