---
title: Setup development environments
date: 2020-12-25T09:01:01.910Z
weight: 1
description: How to install dependency libraries, build source codes, debug and test.
draft: false
toc_hide: false
---
## Dependencies

* cmake
* bison 3.3~
* flex
* llvm 11~
* libsndfile
* rtaudio(cmake downloads automatically)

Optionally, Ninja is recommended for a fast build.

### macOS

Install Xcode, and Xcode command line tools with the following command.

```sh
xcode-select --install
```

Install [Homebrew](https://brew.sh) by the instruction on the website.

Install dependencies with the following command.

```sh
brew tap mimium-org/mimium
brew install mimium -s --only-dependencies
```

### Linux(Ubuntu)

If you are using Homebrew on Linux, you can use same installation command in the section of macOS.

If you want to install dependencies with apt, use the following command[^llvmonubuntu].

[^llvmonubuntu]: On Linux(Ubuntu), we recommend installing llvm using an automatic installation script in https://apt.llvm.org/ because `llvm` package in apt does not contain `Polly` libs required by `llvm-config --libs`. [ref]((https://github.com/mimium-org/mimium/issues/60))


```sh
pushd /tmp && wget https://apt.llvm.org/llvm.sh && chmod +x llvm.sh && sudo ./llvm.sh && popd
sudo apt-get install libalsa-ocaml-dev libfl-dev libbison-dev libz-dev libvorbis-dev libsndfile-dev libopus-dev gcc-9 ninja-build
```

### Windows (on MSYS2)

Currently, build on Windows is realized by using MSYS2(https://www.msys2.org/). Follow the instruction on MSYS2 website to install it.

Open MSYS MinGW64 terminal and install dependencies with the following command..

```shell
pacman -Syu --noconfirm git flex bison mingw-w64-x86_64-cmake mingw-w64-x86_64-gcc mingw64/mingw-w64-x86_64-libsndfile mingw64/mingw-w64-x86_64-opus mingw-w64-x86_64-ninja mingw-w64-x86_64-llvm
```

### Clone the repository

Clone the repository of mimium with the git command.

```sh
git clone --recursive https://github.com/mimium-org/mimium.git
```

## Editor

For the development of mimium, using Visual Studio Code is recommended.

Open `mimium.code-workspace` with VSCode.

### Recommended Extensions

When you open the workspace, the pop-up menu will be shown to install recommended extensions if they are not installed.

* cmake-tools
* clangd
* CodeLLDB
* Coverage Gutter

Especially, CMake Tools is necessary to develop C++ project with VSCode.

## Configure CMake Kit

When you open the workspace with the Cmake Tools installed, you will be asked which CMake kit you want to use (only at the first time).

If you are on macOS, choose `/usr/bin/clang`. Otherwise, choose an appropriate compiler you installsed, for example, `/usr/local/bin/g++` on Linux, and `/mingw64/bin/g++` on MSYS2. 

## Build

Select the CMake Tools tab from the menu on the left side of VS Code, and select Configure All. A build directory will be created under `build/` (RtAudio will be downloaded and built automatically at this time).
Right next to Configure All, press Build All to start building all projects.

### Build Targets

- `src/mimium_exe` : Builds the main `mimium` command.
- `src/mimium` : Builds the main body of the library, `libmimium`.
- `test/Tests` : The target to build all tests (except Fuzzing).
- `Lcov` `LcovResetCounter` : Target available when `-DENABLE_COVERAGE` is enabled. run the `Lcov` target after building and running one or more tests, etc. to collect coverage information. If you select `Show Coverage` from the Cmd+Shift+P command palette in this state, the actual execution of the code will be highlighted. After editing the source and rebuilding, you will need to run `LcovResetCounter` because of coverage information conflicts.

## Debugging on VSCode

Select the Run tab from the menu on the left side of VS Code.
Configurations can be selected from next to the Run button. There are two workspaces: one to launch the CMake target ("CMake Target Debug(Workspace)"), and another to run it with command line options ("Launch with Arg(edit this config)(workspace )").

You can choose which CMake target to launch by clicking "Select the target to launch" in the bottom menu bar.

If you want to launch by passing options to the command line, select "Launch with Arg(edit this config)(workspace)" and then use the gear symbol to directly edit the mimium.code-workspace file. For example, use "args" to specify the file name as shown in the following example.

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

You can also pass the input from stdio by specifying like `"stdio": ["${workspaceFolder}/stdin.txt",null,null],`.

## Test

There are three main types of tests, using Google Test.

### Unit tests

This is mainly a test to see if each section of the compiler works correctly by starting it alone.

### Regression Test.

This is a test to invoke the actual built `mimium` binary from the `std::system` function and check if there are any errors in other sections due to the addition of new features.
Since mimium does not currently have a syntax for verifying tests, we pipe the calculation results to standard output using the `println` function, and Google Test captures it to verify that the answer is correct.
Also, the test which launches the audio driver is currently not implemented.

### Fuzzing test

This is a fuzzing test that uses Clang's libfuzzer.
Fuzzing tests are used to verify that a random input (in this case, a string of source code) is given in a gradually changing manner, and that if the syntax is correct, it will be processed correctly, and if it is an error, it will be treated as an error and an unexpected crash will not occur.

It is only validated on macOS and is not included in CI.


### Run Ctest

You can execute test command by running `ctest` command on `build` directory, or you can execute Unit Test and Regressin test from the menu on right-bottom of VSCode.
