# Games for Ahmed

## Torah Runner

A 3D lane runner. Run from Egypt, through the parted Red Sea and the wilderness, to Mount Sinai. Catch the golden Hebrew letters in order to write words of the Torah on your scroll.

- **Play:** open `torah-runner/index.html` through any static web server (ES modules don't load from `file://`).
  ```sh
  python3 -m http.server 8000
  # then open http://localhost:8000/torah-runner/
  ```
- **Controls:** ← → change lane · ↑ / Space jump · ↓ slide · P pause · M sound. On touch screens: swipe, or tap to jump.
- **Words:** 29 words covering all 22 letters of the Alef-Bet, each with its transliteration and meaning. Words you finish are saved in "My scroll".
- **Power-ups:** cloud shield, magnet, double manna, shofar blast, extra heart.
- **Word pause:** finishing a word freezes the run and shows the word card. Tap "Keep running" for a 3-2-1 countdown; a golden wave clears the road just ahead. Resuming from pause also counts down.
- **Music:** a synthesized klezmer band (clarinet, accordion, bass, drum) plays the traditional Hava Nagila theme and a freylekh dance tune; it speeds up as you run faster.
- **Train back:** after a lost run, "Run again" sends a steam train that carries you back through every region to Egypt (tap "Skip ride" to jump straight there).

### Code
| File | What it does |
| --- | --- |
| `torah-runner/index.html` | Page, HUD and menus |
| `torah-runner/js/main.js` | Game loop, input, track generation, collisions |
| `torah-runner/js/world.js` | Sky, ground, Red Sea walls, distant landmarks, particles |
| `torah-runner/js/models.js` | Low-poly runner, obstacles and pickup textures |
| `torah-runner/js/scenery.js` | Roadside props for each region |
| `torah-runner/js/train.js` | The train ride back to the start |
| `torah-runner/js/audio.js` | Synthesized sound effects and music |
| `torah-runner/js/data.js` | Words, letter names, regions |

Uses [three.js](https://threejs.org) 0.170.0 from jsDelivr. No build step.
