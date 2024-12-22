---
title: 標準ライブラリ
date: 2021-01-17T03:32:12.504Z
weight: 4
description: このセクションでは、mimiumのライブラリについて説明します。
draft: false
bookHidden: false
---

# 標準ライブラリ

## `core.mmm`

- `mix(gain,a,b)->float`
- `switch(gate,a,b)->float`

### 単位変換

- `midi_to_hz(note:float)->float`
- `hz_to_midi(hz:float)->float`
- `dbtolinear(db:float)->float`
- `linear2db(a:float)->float`

## `math.mmm`

- `PI`
- `log10(x:float)->float`
- `log2(x:float)->float`

## `env.mmm`

- `adsr(attack,decay,sustain,release,input)->float`

## `filter.mmm`

- `onepole(x,ratio)->float`
- `smooth(x)->float`
- `biquad(x,coeffs:(float,float,float,float,float))->float`
- `lowpass(x,fc,q)->float`
- `highpass(x,fc,q)->float`

## `noise.mmm`

- `gen_noise(seed)->float`
- `noise()->float`

`noise()`は`gen_noise(1.0)`と同じです。seedが同じnoiseは毎回同じ数列を返すので、複数のノイズソースを使用する場合は`gen_noise`を使用してノイズを複数生成してください。

## `osc.mmm`

- `phasor(freq)->float`
- `phasor_shift(freq,phase_shift)->float`
- `saw(freq,phase_shift)->float`
- `triangle(freq,phase_shift)->float`
- `sinwave(freq,phase_shift)->float`

