# Waving API document

##### Table of content

<!-- TOC -->

- [Waving API document](#waving-api-document) - [Table of content](#table-of-content)
  - [Overview](#overview)
  - [Class: Waving](#class-waving)
    - [new waving(element, options, events)](#new-wavingelement-options-events)
    - [Waving.setAudio(audio)](#wavingsetaudioaudio)
    - [Waving.start()](#wavingstart)
    - [Waving.stop()](#wavingstop)
    - [Waving.setVolume(percentage)](#wavingsetvolumepercentage)
    - [Waving.mute()](#wavingmute)

<!-- /TOC -->

### Overview

Waving is a waveform audio visualizer written in typescript. Waving is built on top of Web Audio API and HTML Canvas.

### Class: Waving

Waving's main class. An instance of this class provides methods for controling the player.

```js
const player = new Waving(element, options, events);

player.setAudio('audio.mp3');
player.start();
player.stop();
player.setVolume(30);
player.mute();
```

#### new waving(element, options, events)

- `element` <[HTMLElement]> Element for Waving to place the player in.
- `options` <[Object]>
  - `controlsColor` <[string]> Color of the player default controls (requires controls: true)
  - `controls` <[boolean]> Indicates that the player should display the default controls
  - `autoStart` <[boolean]> Indicates that the player should play automatically on loaded new audio
  - `volume` <[number]> Specify the initial volume of the player in percentage. Default is 50
  - `visualCanvasColor` <[Array]<[Object]>> Specify the canvas visualize color. This should be an array of objects that contain these keys:
    - `stop` <[number]> Specify a stop point for the gradient background
    - `color` <[string]> Specify the color for that stop point
- `events` <[Object]>
  - `onStart` <[function]> Callback that executes everytime the audio file is played
  - `onPause` <[function]> Cabllack that executes everytime the aduio file is paused
  - `onEnded` <[function]> Callback that executes everytime the audio file is ended

#### Waving.setAudio(audio)

- `audio` <[string]> The address to the audio file that you want to play

#### Waving.start()

Start/resume the audio file

#### Waving.stop()

pause the audio file

#### Waving.setVolume(percentage)

- `percentage` <[number]> volume for the audio file in percentage ranging from 0 - 100.

#### Waving.mute()

Mute the volume of the audio file.
