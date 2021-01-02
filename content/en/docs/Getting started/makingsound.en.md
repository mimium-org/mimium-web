---
title: MakingSound
date: 2021-01-02T18:42:37.550Z
weight: 1
description: Here you will learn how to make the basic sound using the mimium.
draft: true
---
{{% pageinfo %}}
Documentation is under preparation! We are seeking for people who support documentations and translations.
{{% /pageinfo %}}

## Making Sound
Write the following code and using your command line tool, run this code.
```rust
fn dsp(time){
    return sin(now*440*3.14*2/48000)
}
```

Otherwise you can write one-liner code snippets.
```rust
dsp = |t|{ sin(now*440*3.14*2/48000) }
```
