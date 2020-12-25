---
title: Setup development environments
date: 2020-12-25T09:01:01.910Z
weight: 1
description: Setup development environments
draft: false
---
# Setup Development Environment

## Dependencies

* cmake
* bison
* flex
* llvm 9~10
* libsndfile
* rtaudio(cmake downloads automatically)

Optionally, Ninja is recommended for a fast build.

### macOS & Linux(Ubuntu)

Using [Homebrew](https://brew.sh) is recommended.

```shell
brew install cmake llvm@9 bison flex libsndfile ninja
```

### Windows (on MSYS2)

Currently, build on Windows is realized by using MSYS2.

Open MSYS MinGW64 terminal.

```shell
pacman -Syu --norconfirm git flex bison mingw-w64-x86_64-cmake mingw-w64-x86_64-gcc mingw64/mingw-w64-x86_64-libsndfile mingw64/mingw-w64-x86_64-opus mingw-w64-x86_64-ninja
```

## Editor

Visual Studio Code

How to use workspace

### Recommended Extensions

* cmake-tools
* clangd

## Clone Repository

```sh
git clone --recursive https://github.com/mimium-org/mimium
```

## Build

```sh
cmake -Bbuild . 
cmake --build build
```

### Build Targets

## Test

### Run Ctest

```sh
ctest build/test
```

### テストの追加

## Debug On VSCode