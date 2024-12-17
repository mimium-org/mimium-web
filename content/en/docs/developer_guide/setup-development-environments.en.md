---
title: Setting Up the Development Environment
date: 2024-11-19
weight: 1
description: Instructions for installing the development environment, debugging, and testing
draft: false
bookHidden: false
---

# Development Environment Setup

mimium uses the Rust programming language for implementing its compiler and extensions.

For debugging and testing, the Rust toolchain, primarily Cargo, is used.

## Installing Rust

The Rust programming language can be installed and managed with the [`rustup`](https://www.rust-lang.org/tools/install) tool.

Open a terminal (or Command Prompt on Windows) and run the following command:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```


You will be prompted with configuration options, but the default installation is sufficient.

## Installing Visual Studio Code

For mimium development, we use Visual Studio Code as the integrated development environment (IDE), which combines an editor, debugger, and other tools.

You can download and install it from the following URL:

https://code.visualstudio.com/

If you want to use the editor in Japanese, install the Japanese language pack by clicking the "Install" button on the following page:

https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ja

## Downloading the Development Repository

Open Visual Studio Code, go to **View → Command Palette** (Cmd+Shift+P), and type "Clone."

Select the **Git: Clone** option and enter the following URL:

```
https://github.com/tomoyanonymous/mimium-rs.git
```


## Opening the Workspace

In Explorer/Finder, open the `mimium-rs.code-workspace` file from the downloaded repository. The `.code-workspace` file is a configuration file that standardizes the development environment in VSCode. It includes necessary extensions, editor settings, and debugger configurations.

When you open this workspace file for the first time, a dialog will prompt you to install the required extensions. Follow the instructions to install them. The required extensions are:

- **mimium-language** (Syntax highlighting for mimium source code files `.mmm`)
- **Even Better TOML** (Formatter for TOML files used by Cargo, such as `Cargo.toml`)
- **rust-analyzer** (Rust Language Server providing syntax highlighting, type hints, and various completions)
- **CodeLLDB** (Debugger required for breakpoint-based debugging in Rust)

## Running the Development Version of mimium-cli

```
cd mimium-cli cargo run -- <options> <relative path to the file to run from mimium-cli>
```

Useful options for development include:

- `--emit-ast` Outputs the syntax tree in LISP-like format after parsing
- `--emit-mir` Outputs the intermediate representation in SSA format
- `--emit-bytecode` Outputs the bytecode for the VM 
- `--output-format=CSV --times=10` Outputs the calculation results for the first 10 samples in CSV format


## Debugging with LLDB

Click the **Debug** tab in the left sidebar of VSCode.

Select the option **"Debug executable 'mimium-cli' (workspace)"**.

This configuration executes `mimium-cli/examples/sinewave.mmm` by default without any options. To change the file to execute, modify the following line in `mimium-rs.code-workspace`:

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
        // Change the arguments passed to mimium-cli (file path relative to the workspace root)
        "args": ["mimium-cli/examples/sinewave.mmm"],
        "cwd": "${workspaceFolder}"
      },
```

## Running Tests

Run the following command in the workspace root folder:

```
cargo test
```

## Running Benchmarks

Run the following command in the workspace root folder:

```
cargo bench
```

> [!NOTE] To use the benchmark feature, you need to switch the Rust toolchain to Nightly. If it’s not installed, install it with the following command:
>
> ```
> rustup install nightly
> ```
>
> To set Nightly as the default toolchain (note that this may affect other Rust development projects):
> 
> ```
> rustup default nightly
> ```