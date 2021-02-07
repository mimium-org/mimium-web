---
title: "インストール"
linkTitle: "インストール"
date: 2020-08-22
weight: 1
description: >
  mimiumをインストールしてみよう
---

## Homebrewを使ったインストール

macOSとLinux向けのパッケージマネージャツール、[Homebrew](https://brew.sh/)を利用すると、簡単にmimiumをインストールできます。

もしhomebrewをインストールしていない場合は、ターミナルアプリを開いて、以下の行をコピー&ペースト、Enterキーを押して実行してください。（より詳しい方法はhomebrewのドキュメントを参照してください。）

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

`brew`コマンドが使えるようになったら、以下のコマンドをコピー&ペースト、実行するとインストールされます。

```bash
brew tap mimium-org/mimium && brew install mimium
```

以下のコマンドを打ってバージョンが表示されたらインストール完了です！

```bash
mimium --version # will return mimium version:x.x.x
```

## 手動インストール

mimiumのビルド済みバイナリを[Github Release Page](https://github.com/mimium-org/mimium/releases)からダウンロードすることが可能です。

*mimium-vx.x.x-Darwin.zip* がmacOS用、 *mimium-vx.x.x-Linux.zip* がLinux用、 *mimium-vx.x.x-Windows.zip* がWindows用です。

ダウンロードとzip展開が終わったら、`bin`フォルダの中にある`mimium`プログラムを`/usr/local/mimium`に、`lib`フォルダにあるファイルすべてを`/usr/local/lib`にコピー/移動/シンボリックリンクを貼るのいずれかを行ってください。GNU/Linuxにおいては`/usr/local/lib`はデフォルトで動的リンクのライブラリパスに入っていないので、`/usr/local/lib`を`/etc/ld.so.conf.d/`配下のファイルに追記し、`ldconfig`をroot権限で実行してください。Windowsでは適当な場所にダウンロードしたフォルダを配置して、環境設定からパスを通してください。

## ソースからビルドする

mimiumの実行環境はC++で書かれていますので、ビルドにはC++のコンパイラーが必要です。
macOSの場合は`xcode-select --install`を実行してインストールされるclang、Linuxの場合はGCC >= 9が推奨されています。（g++ on macやclang++ on Linuxでは標準ライブラリのリンクに競合を起こすことがあります）

Windowsの場合は、[MSYS2](https://www.msys2.org/)のMinGW64環境を利用してビルドできます。

加えて、以下のツールやライブラリが必要になります。

- git（バージョン管理システム）
- [cmake（クロスプラットフォームビルドツール）](https://cmake.org/)

macOSでは、`xcode-select`でclangをインストールしたタイミングでcmakeとgitはインストールされています。

- [llvm（コンパイラ基盤）](https://llvm.org/) >= v11.0.0
- [flex（トークナイザ）](https://github.com/westes/flex/)
- [bison（パーサジェネレータ）](https://www.gnu.org/software/bison/) >= v3.3
- [libsndfile（オーディオファイル読み込みライブラリ）](http://www.mega-nerd.com/libsndfile/)

これらに加えて [RtAudio(クロスプラットフォーム向けオーディオドライバライブラリ)](https://github.com/thestk/rtaudio) にも依存しますが、RtAudioはcmakeが自動でダウンロード&ビルドするので手動でインストールする必要はありません。

これらのツールやライブラリを `brew` やLinuxの場合は `apt-get`、MSYS2では`pacman`を用いてインストールするのが簡単です。

{{< alert color="warning" >}}
Ubuntu 18.04(Bionic)では、`apt`でインストールできる`bison`は3.0.4と古いバージョンでこのプロジェクトに対応していません。手動でインストールする必要があります。[自動ビルド&テストのためのGithub Actions Workflow](https://github.com/mimium-org/mimium/blob/dev/.github/workflows/build_and_test.yml) には依存パッケージのインストールや後述のビルド手順も含め、手動ビルドの手順が網羅されていますのでチェックしてみてください。
{{< /alert >}}

### GitHubからソースコードをダウンロード

```bash
git clone https://github.com/mimium-org/mimium.git
cd mimium
# 'master' が安定版です。'dev'ブランチで開発版のビルドができます。他、v0.1.0などリリースバージョンのtagを用いてバージョンを変更することが可能です。
git checkout master 
```
### CMakeのConfigure

```bash
cmake -Bbuild . -DCMAKE_BUILD_TYPE=Debug
```

このステップでCMakeは自動でRtAudioをダウンロード&ビルドします。

`cmake`コマンドには、`-D`を先頭につけることで以下のようなオプションが渡せます。

- `-DCMAKE_INSTALL_PREFIX=/your/directory` 後述のインストールステップのコピー先（標準では/usr/local）
- `-DCMAKE_BUILD_TYPE=Debug` 最適化のレベルの指定。 'Debug', 'Release', 'MinSizeRel' , 'RelWithDebinfo'から選べる
- `-DCMAKE_CXX_COMPILER=/path/to/compiler` ビルドに使用するC++コンパイラの指定。
- `-DBUILD_SHARED_LIBS=ON` ONにするとライブラリを動的リンクライブラリとしてビルドします（Linux、Windowsではうまく動かないケースがあります）。
- `-DBUILD_TEST=ON` テストをビルド対象に含めます。
- `-DENABLE_COVERAGE=ON` GCovを利用したカバレッジ計測のためのコンパイラオプションを有効化します。
### ビルド

```bash
cmake --build build -j
```

`-j` はビルド時にCPUを並列で使用できる最大スレッド数を指定できます。`-j8`なら最大8スレッド、番号なしの`-j`は可能な限り多くのコア/スレッドを使用します。

### インストール

```bash
cmake --build build target=install
```
### アンインストール

```bash
cmake --build build --target uninstall
```

このアンインストールステップでは、先ほどのインストールステップで自動生成された `build/install_manifest.txt`に書かれている情報を利用してファイルを削除します。もし失敗した場合はこのファイルの中身を確かめるか、もう一度ビルド、インストールを行ったあとアンインストールするを順番に行ってみてください。

バイナリでインストールした場合は`/usr/local/bin/mimium`、`/usr/local/lib/libmimium*`を削除してください。

ソースからビルドした場合は以下のコマンドでインストールできます。
## Visual Studio Code向けシンタックスハイライト

シンタックスハイライトとして、クロスプラットフォームで動作するVisual Studio Code向けの拡張機能を用意しています。

vscode上でのextensionsパネルで`mimium-language`と検索するか、以下のリンクよりインストールをしてください。

<https://marketplace.visualstudio.com/items?itemName=mimium-org.mimium-language>


{{< alert color="info" >}}
より詳しい開発環境構築に関しては[環境構築](/ja/docs/developers-guide/setup-development-environments/)を参照してください。
{{< /alert >}}
