# Waving

_A simple audio player with wave effect_

## Quick start

To getting started with Waving, the only thing you need to do is to pass in a container `div` for Waving to put the player there.

```html
<!-- Include Waving stylesheet -->
<link href="https://unpkg.com/waving@1.0.0/dist/waving.css" rel="stylesheet">

<!-- Create the player container -->
<div id="player"></div>

<!-- Include the Waving library -->
<script src="https://unpkg.com/waving@1.0.0/dist/waving.js"></script>

<!-- Initialize Waving and set audio -->
<script>
const container = document.getElementById('#player');
const player = new waving(container);
player.setAudio('audio.mp3');
</script>
```

Take a look at Waving website for a better documentation and live playground.

## Download

With npm

```
npm install --save waving
```

With yarn

```
yarn add waving
```

### CDN

```html
<!-- Waving stylesheet -->
<link href="https://unpkg.com/waving@1.0.0/dist/waving.css" rel="stylesheet">

<!-- Waving library -->
<script src="https://unpkg.com/waving@1.0.0/dist/waving.js"></script>
```

## License

- [MIT](LICENSE)
