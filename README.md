# Games for Ahmed

## Torah Runner

A 3D lane runner through the stories of the Torah and Jewish history: Noah's Ark at Ararat, the Tower of Babel, Jacob's Journey, Egypt, the Red Sea, the Oasis of Elim, the Wilderness, the Battle of Rephidim, Mount Sinai, the Night Camp, Crossing the Jordan, the Walls of Jericho, the Valley of Elah (David and Goliath), Jerusalem, then Tel Aviv, Ben Gurion Airport (pass a Hebrew test to fly), New York, the Underground Donut Shop, Central Park and Liberty Harbor. Each place has its own scenes from the Torah along the road. The Journey map lets you start from any place you have reached, or unlock one with manna. Ramps lead up onto raised walkways. Catch the golden Hebrew letters in order to write words of the Torah on your scroll.

- **Play:** open `torah-runner/index.html` through any static web server (ES modules don't load from `file://`).
  ```sh
  python3 -m http.server 8000
  # then open http://localhost:8000/torah-runner/
  ```
- **Controls:** ← → change lane · ↑ / Space jump · ↓ slide · P pause · M sound. On touch screens: swipe, or tap to jump.
- **The route (30 places):** the Garden of Eden, Ararat, Babel, Beersheba, Jacob's journey, Egypt, the Red Sea, Elim, the Wilderness, Rephidim, Sinai, the Night Camp, the Jordan, Jericho, the Valley of Elah, Ein Gedi, Jerusalem, Jonah's sea, the rivers of Babylon, Shushan (Purim), Modiin (Hanukkah), Safed, Tel Aviv, Ben Gurion Airport, New York, the Underground Donut Shop, Brooklyn, Coney Island, Central Park and Liberty Harbor.
- **Final boss:** reach the end with all ten commandments and face the Golem of Prague in a word battle. Drag each Hebrew word into the box with its meaning (or tap a word, then a box). 3 rounds of 4 words, 35 seconds a round; a wrong answer or running out of time costs a heart. Then erase the א from אמת on his forehead and he crumbles back into clay.
- **Famous Jewish people (shop):** looks inspired by Albert Einstein, Golda Meir, Theodor Herzl, Maimonides, Ruth Bader Ginsburg, Harry Houdini, Levi Strauss, Emma Lazarus, Jonas Salk and Hank Greenberg.
- **Ten Commandments (how to win):** ten stone tablets, numbered א to י, wait along the road, one each in Babel, Egypt, Elim, Rephidim, Sinai, the Jordan, Elah, Tel Aviv, New York and Central Park. A missed tablet comes back 250 m later, until its place ends. Each tablet gives +100 manna. Every new place you reach gives 50 manna plus 25 for each tablet you carry. Reach the end of the road (58,500 m) holding all ten, then beat the Golem, to win the game with a 1,000-manna victory bonus. Start from Mount Ararat to have a chance at all ten.
- **High scores:** every run is checked against this device's top 10. A run that makes the list asks for your name on the game-over screen. Open **High scores** from the main menu or the game-over screen. On the claude.ai page there is also an **Everyone** tab: a shared board with each player's best run.
- **Words:** 280 words (animals, food, colors, numbers, family, holidays, Torah names and values) covering all 22 letters of the Alef-Bet, each with its transliteration and meaning. Words you finish are saved in "My scroll".
- **Power-ups:** Star of David shield, jet pack (fly above everything), jump sneakers (blue-and-white, super-high jumps), magnet, double manna, shofar blast, extra heart.
- **Word pause:** finishing a word freezes the run and shows the word card. Tap "Keep running" for a 1-second 3-2-1 countdown; a golden wave clears the road just ahead. Resuming from pause also counts down.
- **Music:** a synthesized klezmer band (clarinet, accordion, bass, drum) plays the traditional Hava Nagila theme and a freylekh dance tune; it speeds up as you run faster.
- **Shop:** manna you collect is saved; spend it in the main-menu shop on power-ups (including an extra heart) for your next run, and on permanent upgrades: Swift feet (speed), Manna blessing (+0.25x manna per level, up to 3x) and Bigger jet tanks. New words and word-count milestones earn bonus manna.
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
