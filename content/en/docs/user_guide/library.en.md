---
title: Standard Library
date: 2021-01-17T03:32:12.475Z
weight: 4
description: This section describes the mimium libraries.
draft: false
toc_hide: false
---
This section describes the mimium libraries.

# Standard Libraries

## `core.mmm`

- `mix(gain,a,b)->float`
- `switch(gate,a,b)->float`

### Unit Conversions

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

`noise()` is same as `gen_noise(1.0)`. Noise with the same seed returns always same number sequence. If you need to use multiple noise source, use `gen_noise`.

## `osc.mmm`

- `phasor(freq)->float`
- `phasor_shift(freq,phase_shift)->float`
- `saw(freq,phase_shift)->float`
- `triangle(freq,phase_shift)->float`
- `sinwave(freq,phase_shift)->float`

