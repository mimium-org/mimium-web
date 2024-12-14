---
title: Getting Started
linkTitle: Getting Started
date: 2021-03-08T16:24:07.765Z
weight: 1
description: |
  Let's start your mimium experiences
draft: false
bookHidden: false
---

## Prerequisites

Currently, mimium can be used on the following environments.

- macOS (x86)
- Linux(tested on Ubuntu, uses ALSA as backend)
- Windows 10

## Getting started with an extension for Visual Studio Code
The easiest way to get started is to use Visual Studio Code, a free text editor/IDE. 

1. download and install [Visual Studio Code](https://code.visualstudio.com/) from the official website. 
2. Start Visual Studio Code, and open the Extensions menu (Cmd+Shift+X).
3. search for "mimium" in the search field and install it. 
4. Create a file with the name of `hello.mmm', copy the following code snippet, save it, and open it again in Visual Studio Code. 
5. A pop-up window will appear asking you to install the latest version of the mimium binary. 
6. Cmd+Shift+P to open the command palette, search for "mimium", and execute the command "Run currently opening file" to run the file currently open in the editor from the terminal. 
7. If you want to stop the sound, press Ctrl+C in the terminal.

```rust
// hello.mmm
fn dsp(){
  output = sin(now*440*2*3.141595/48000)
  return (output,output)
}
```

## Other ways to install

You can download latest binaries from [GitHub Release](https://github.com/mimium-org/mimium/releases). Copy `bin/mimium` to appropariate path (for example, `/usr/loca/bin` on macOS/Linux).

On macOS/Linux, you can easily install mimium by using [Homebrew/Linuxbrew](https://brew.sh/)[^bigsur]. 

[^bigsur]: Currently, we can not provide a binary package for macOS 11.0 thus it tries to build from the source. Installing Xcode and some additional software are required.

```bash
brew install mimium-org/mimium/mimium
```

for more detailed information such as building from source, check [Installation](./installation) page.

## Run the command

You can run mimium by running `mimium` command. If the binary is correctly installed, you can see the help menu with the following command.

```sh
mimium --help
```

Make text file with the name of `hello.mmm` on current working directory and paste the code snippet above.

Then, type the following command to run the file. (Take care the volume of speakers.) You will hear the sine wave sound of 440Hz.

```sh
mimium hello.mmm
```

Conguraturations! 

You can read further explanation such as a grammer of the language and available functions on [Making Sound](./makingsound) page.