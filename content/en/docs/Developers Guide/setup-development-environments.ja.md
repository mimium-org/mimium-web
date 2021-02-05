---
title: 環境構築
date: 2020-12-25T09:01:01.923Z
weight: 1
description: 依存ライブラリのインストール、IDEの設定、ビルド、デバッグ、テストの解説
draft: false
---
## 依存ライブラリ、ツール

* cmake
* bison 3.3~
* flex
* llvm 11~
* libsndfile
* rtaudio（cmakeが自動でインストールします）

### macOS

XCodeをインストールし、以下のコマンドでコマンドラインツールをインストールしてください。
```sh
xcode-select --install
```

[Homebrew]をインストールし、以下のコマンドで依存パッケージをインストールします。

```sh
brew install 
brew tap mimium-org/mimium
brew install mimium -s --only-dependencies
```
### Linux(Ubuntu)

以下のコマンドで依存パッケージをインストールします。

```sh
sudo apt-get install libalsa-ocaml-dev llvm libfl-dev libbison-dev libz-dev libsndfile-dev libopus-dev gcc-9 ninja-build
```

LinuxBrewを利用している場合はmacOSを同様のコマンドでも依存パッケージのインストールが可能です。

### Windows

MSYS2(https://www.msys2.org/)のインストールを公式サイトの要領にしたがって行ってください。
スタートメニューからMinGW64コマンドプロンプトを開いてください。

以下のコマンドで依存パッケージをインストールします。

```sh
pacman -Syu --noconfirm git flex bison mingw-w64-x86_64-cmake mingw-w64-x86_64-gcc mingw64/mingw-w64-x86_64-libsndfile mingw64/mingw-w64-x86_64-opus mingw-w64-x86_64-ninja mingw-w64-x86_64-llvm
```

### リポジトリのクローン

gitコマンドが使えることを確認し、次のコマンドでmimiumの開発リポジトリをクローンします。

```sh
git clone --recursive https://github.com/mimium-org/mimium.git
```

## エディタ

mimiumの開発にはVisual Studio Codeを利用することでどのOSでも同じように開発できるようになっています。
mimiumディレクトリで`mimium.code-workspace`をVS Codeで開いてください。
### 推奨拡張機能

ワークスペースを開くと、推奨される拡張機能がインストールされていなければポップアップメニューが現れインストールできます。

* cmake-tools
* clangd
* CodeLLDB
* Coverage Gutter

とくにCMake Toolsは必須の拡張です。

## CMake Kitの設定

cmake-toolsがインストールされている状態でワークスペースを開くと、初回のみCMakeが使用するKit（コンパイラ）を選ぶメニューが出てきます。
macOSでは`/usr/bin/clang`を選択してください。Linuxでは`/usr/local/bin/g++`、MinGW64なら`/mingw64/bin/g++`などそれぞれインストールしたC++コンパイラへのパスを指定します。
## ビルドする

VS Code左側のメニューからCMake Toolsのタブを選択し、Configure Allを選択します。`build/`以下にビルドディレクトリが構築されます（この時、RtAudioのダウンロードとビルドも自動的に行われます）。
Configure Allの右隣、Build Allを押すと全プロジェクトのビルドが始まります。

### ターゲット一覧

- `src/mimium_exe` : メインの`mimium`コマンドをビルドします。
- `src/mimium` : ライブラリの本体、`libmimium`をビルドします。
- `test/Tests` : すべてのテスト（Fuzzingを除く）をビルドするためのターゲットです。
- `Lcov` `LcovResetCounter` : `-DENABLE_COVERAGE`を有効化した時利用可能なターゲットです。1回以上テストなどをビルドした上で実行した後`Lcov`ターゲットを実行するとカバレッジ情報を収集します。この状態でCmd+Shift+Pのコマンドパレットから`Show Coverage`を選択するとコードを実際に実行した部分がハイライトされます。ソースを編集して再ビルドした後はカバレッジ情報のコンフリクトが発生するので、`LcovResetCounter`を実行する必要があります。

## VS Codeでのデバッグ方法

VS Code左側のメニューからRunのタブを選択します。
Runの実行ボタンの隣からコンフィグが選択できます。ワークスペースにはCMakeのターゲットを起動するもの（"CMake Target Debug(Workspace)"）と、それに加えてコマンドラインオプションを指定して実行するもの（"Launch with Arg(edit this config)(workspace)"）の2つが存在します。

下メニューバーの"Select the target to launch"をクリックすることで、CMakeのどのターゲットを起動するかを選択できます。

コマンドラインにオプションを渡して起動したい場合、"Launch with Arg(edit this config)(workspace)"を選択してからさらに歯車マークでmimium.code-workspaceファイルを直接編集します。たとえば以下の例のように"args"にファイル名を指定するように使います。

```json
...
				{
					"name": "Launch with arg(edit this config)", 
					"type": "lldb",
					"request": "launch",
					"program": "${command:cmake.launchTargetPath}",
					"args": ["${workspaceFolder}/examples/gain.mmm"], 
					"cwd": "${workspaceFolder}/build", 
				},
...
```
他にも`"stdio": ["${workspaceFolder}/stdin.txt",null,null],`のようにすると、標準入力から入力を受け付けることも可能です。
## テスト

テストには主にGoogle Testを利用した、3種類のテストが存在します。

### ユニットテスト

主にコンパイラの各セクションを単独で起動して正しく動作するかのテストです。

### 回帰テスト（Regression Test）

実際にビルドした`mimium`バイナリを`std::system`関数から起動して、新機能追加に伴って他の箇所にエラーが発生しないかチェックするためのテストです。
mimiumには現在テストを検証するための構文などが存在しないため、計算結果を`println`関数で標準出力にパイプし、Google Testでそれをキャプチャして正しい答えが出るかを検証するという形をとっています。
また現在オーディオドライバを起動するテストは未実装です。

### Fuzzingテスト

Clangのlibfuzzerを利用するファジングテストです。
ファジングテストとはランダムな入力（ここではソースコードの文字列のことです）を少しずつ変化させながら与え、正しい構文なら正しく処理され、エラーの場合はエラーとして処理され予期せぬクラッシュが発生しないかなどの検証に使用されています。

macOSでのみ検証されており、CIには含まれていません。
## Ctestの実行

buildフォルダで`ctest`コマンドを実行するか、VS Codeの右下のメニューから"Run Ctest"をクリックするとユニットテストと回帰テストが実行されます。