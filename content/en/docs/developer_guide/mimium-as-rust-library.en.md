---
title: Using mimium with Rust
date: 2021-01-16T23:12:18.732Z
weight: 2
description: The mimium runtime environment is divided into core functionality, plugins, and a frontend. The current project structure is primarily organized as follows.
draft: false
bookHidden: false
---

# mimium as a Rust Library

The mimium runtime environment is implemented by dividing it into core functionality, plugins, and a frontend. The current project structure is primarily organized as follows:

- Core Functionality
    - `mimium-lang`
    - `mimium-test`
- Plugins
    - System Plugins
        - `mimium-scheduler`
        - `mimium-guitools`
        - `mimium-midi`
        - `mimium-audiodriver`
    - UGen Plugins
        - `mimium-symphonia`
- Frontend
    - `mimium-cli`

Each plugin depends on the core functionality of the language, while the frontend depends on both the language and the plugins.

## Plugin System

The mimium v2 compiler has an interface that allows external I/O features, such as audio file loading or MIDI, to be separated into different crates. This helps isolate specific Rust crates or platform dependencies.

There are two types of traits for plugins.

The `Plugin` trait serves as the basic plugin interface. By defining a set of three values, the plugin can be called as an external function from mimium:

- The function name as called from mimium
- The type signature in mimium
- The function to be executed (created by wrapping a Rust closure or function pointer)

The function that performs the actual processing has the type `Rc<RefCell<dyn FnMut(&mut Machine) -> ReturnCode>>`. By manipulating the stack on mimium's VM through `&mut Machine`, computation can be carried out.

When using a standard system plugin, one instance of this Rust closure corresponds to one closure instance in mimium.

### System Plugins

System plugins, defined through the `SystemPlugin` trait, can manipulate the state of **global instances associated with the runtime** via external functions.

Additionally, system plugins can register callbacks at various points, such as initialization, immediately after evaluating the global environment, and after processing each sample of signal processing.

The scheduling feature of `@` operator—a distinctive feature of mimium—is also achieved through this system plugin.

## Using mimium in Rust

TBD
