---
title: Contribution Guide
date: 2021-01-14T21:26:21.927Z
weight: 1
description: Various ways to contribute
draft: false
bookHidden: false
---

# Contribution Guide

mimium is open-source software (software with publicly available source code).

While the language design is led by the original developer Tomoya Matsuura, the compiler implementation involves multiple contributors.

Contributing to mimium is not limited to working on the compiler. Sharing your music code with the community or editing and translating documentation, including this website, are also valuable ways to contribute.

## Contributions to Development

The development of mimium (v2) is currently hosted on the source code platform GitHub.

https://github.com/tomoyanonymous/mimium-rs

### Reporting Bugs, Proposing Features, and Suggesting Improvements

If you discover a bug or unexpected behavior, you can report it using GitHub Issues (a discussion board feature). Although development is primarily conducted in English, reports in Japanese are also welcome.

https://github.com/tomoyanonymous/mimium-rs/issues

Before submitting a bug report, please search existing Issues to check if a similar issue has already been reported.

When reporting, provide detailed information such as the source code that caused the issue, the version of `mimium-cli` you are using, and your operating system version.

You can also propose new language features using Issues. However, please note that mimium is a work-in-progress language with many feature proposals and implementations running concurrently. Some suggestions may not be feasible due to implementation priorities or conflicts with other language specifications.

### Proposing Code Changes via Pull Requests

If you are familiar with Rust programming, you can submit bug fixes or new feature proposals as Pull Requests (PRs).

When submitting a PR, please keep the following points in mind:

- Ensure that existing tests are not affected by running `cargo test`.
  - If possible, add new test cases to cover the bug fix or feature proposal.
- Before merging, format the code with `cargo fmt` to maintain consistent formatting (currently, CI does not check formatting).

The decision to merge PRs currently rests with Tomoya Matsuura. Please understand that some new feature proposals may not be accepted due to design considerations.

## Enhancing Documentation

### Editing mimium.org

This website (https://mimium.org) is also managed in a GitHub repository.

https://github.com/mimium-org/mimium-web

You can correct typos or write new articles by submitting a Pull Request on GitHub.

Articles are managed in Markdown format and built using the Hugo static site generator.

Even if you are unfamiliar with GitHub, you can propose edits using DecapCMS’s Open Authoring feature by creating an account.

https://mimium.org/admin

(TBD)
