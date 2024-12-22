---
title: Design Concept
date: 2024-11-20
weight: 3
draft: false
bookHidden: false
---

# Design Concept of mimium

This section explains the theoretical background of mimium as a programming language.

mimium is based on a computation system called λ<sub>mmm</sub> (lambda-triple-m), which extends the Simply Typed Lambda Calculus (STLC).

There are various evaluation strategies in lambda calculus. Among them, λ<sub>mmm</sub> is based on **call by value**, the simplest evaluation strategy. Intuitively, call-by-value evaluation means that all arguments are copied when a function is called, creating new values.

Additionally, the mimium compiler performs signal processing by defining its own VM (virtual machine) and instruction set to execute λ<sub>mmm</sub> at practical speeds. While this approach performs worse than Faust and many other prior music programming environments in terms of execution speed[^llvm], it covers most practical real-time use cases. Furthermore, since almost no optimizations have been applied yet, there is significant potential for improvement in the future. (JIT compilation via WebAssembly is planned.)

## λ<sub>mmm</sub>

*Currently being written.*

For a detailed theoretical explanation, refer to the following paper by the designer, Tomoya Matsuura:

[Lambda-mmm: An Intermediate Representation Based on Lambda Calculus for Synchronous Signal Processing Languages (Available Online)](https://matsuuratomoya.com/en/research/lambdammm-ifc-2024/)

[^llvm]: In mimium v0.x, JIT compilation using the LLVM compiler infrastructure was employed. However, with the v2 design, the decision was made to prioritize a detailed theoretical foundation, leading to the adoption of execution via a custom bytecode interpreter.
