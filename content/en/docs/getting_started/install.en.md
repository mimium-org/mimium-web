---
title: Installation
date: 2021-03-08T16:24:07.776Z
weight: 1
description: How to install mimium
draft: false
bookHidden: false
---

# How to Install mimium

## Supported Environments

mimium is currently available for the following environments:

- macOS (x86/arm64)
- Linux (uses ALSA)
- Windows 11 (MIDI plugins do not work on WSL)

## Getting Started with the Visual Studio Code Extension

The easiest and recommended way to install mimium is by using the [Visual Studio Code](https://code.visualstudio.com/) extension for this free text editor/IDE.

1. Install [Visual Studio Code](https://code.visualstudio.com/) from the official website.
2. Launch Visual Studio Code and open the Extensions menu (Cmd+Shift+X).
3. Search for "mimium" in the search bar and install the extension that appears.
4. Create a file named `hello.mmm`, paste the following code, save it, and open the file again.
5. A dialog will appear prompting you to download and install the latest mimium binary[^macOS].
6. Open the command palette with Cmd+Shift+P, search for "mimium," and select "Run currently opening file." A terminal will open and execute the currently opened file.
7. You can stop the sound by pressing Enter or Ctrl+C in the terminal.

[^macOS]: The VSCode extension will automatically try to install a binary for Apple Silicon on macOS. If you are using an Intel-based Mac, you will need to install it manually.

```rust
// hello.mmm
fn dsp(){
  let output = sin(now*440*2*3.141595/samplerate)
  (output,output)
}
```

## Manual Installation

You can download the latest binary from the [GitHub Release](https://github.com/mimium-org/mimium-rs/releases) page. Copy `mimium-cli` to an appropriate location (for macOS/Linux, `~/.mimium` is recommended).

## Installation Directory

When installed via the VSCode extension, mimium's command-line tools, libraries, and sample files are located in the `.mimium` directory under the user's home directory (on Windows, `%HOME%`; on macOS or Linux, `~`). When including external files, mimium will first look in `~/.mimium/lib`, so make sure your libraries are installed in this location.

## Running from the Terminal

You can also use mimium from the command line by running `mimium-cli`. To use it, ensure that `~/.mimium` is included in your PATH.

For macOS, open the `~/.zshrc` file and add the following line:

```
export PATH="$PATH:$HOME/.mimium"
```

After saving, restart your terminal.

If everything is set up correctly, you can view the help with the following command:

```
mimium-cli --help
```

Create a file named `hello.mmm` in your current directory, copy the code above, and save it.

Now, try running the following command in the terminal (make sure your speaker volume is set appropriately). You should hear a 440Hz sine wave.

```
mimium-cli hello.mmm
```

Proceed to the [Making Sound](./makingsound) page for a more detailed explanation of the syntax.