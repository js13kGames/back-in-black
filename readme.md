# junk-kit [![Travis](https://img.shields.io/travis/jameswilddev/junk-kit.svg)](https://travis-ci.org/jameswilddev/junk-kit) [![License](https://img.shields.io/github/license/jameswilddev/junk-kit.svg)](https://github.com/jameswilddev/junk-kit/blob/master/license) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjameswilddev%2Fjunk-kit.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjameswilddev%2Fjunk-kit?ref=badge_shield) [![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

This repository is intended to be a "one-stop shop" for building a subset of
types of [Js13kGames](https://js13kgames.com/) entries.  It features:

- A "watch" pipeline including minification, zipping and size checking for
  realtime feedback on how your changes affect artifact size.

- Game-specific and shared codebases combined during the build pipeline.

- Code generation from content, for better minification and build-time type
  checks.

- Hot reload.

- Continuous integration.

See an [example game](src/games/basic-tower-of-hanoi/src)!

## Usage

### First steps

- If you don't have a GitHub account, sign up for free.

- Fork this repository.  This makes your own copy which you can edit to your
  heart's content.  To do this, click `Fork` in the top right corner of this
  repository's page on GitHub.

- Update all the license link in this file to point to your fork (change
  `jameswilddev` to your GitHub name).

### Development

#### First time

- Install [Git](https://git-scm.com/).

- Install [Visual Studio Code](https://code.visualstudio.com/).

- Install [Node.js](https://nodejs.org/en/).  I'd recommend LTS.

- Clone this repository.

  You can do this by opening Visual Studio Code, pressing F1, then entering
  `clone` and pressing enter to select `Git: Clone`.

  You will then be prompted for the URL of your forked repository, then, a place
  to clone it into.  Once it is done, a blue `Open Repository` button will
  appear in the bottom right.  Click on it.

#### Every time

- Open Visual Studio Code if it is not open.

- If something other than your project is open, click `File`, `Open Folder` and
  select the folder you cloned your fork to.

- Press Ctrl+Shift+B and you should see a command-line application start in the
  terminal at the bottom of Visual Studio Code.

- Your games should now be testable at `http://localhost:3333/{game-name}`,
  where `{game-name}` is the name of a sub-folder of `src/games` such as
  `basic-tower-of-hanoi`, which would be
  `http://localhost:3333/basic-tower-of-hanoi`.

- Any changes you make, to code or content, will be reflected there
  automatically.

See `File structure` for details on adding new or modifying existing games.

### Continuous Integration

#### Recommended

It is highly recommended to set up the following continuous integration
services.

##### Travis CI

This means that your games will be built for you whenever you push changes to
your fork, and the zipped games uploaded as GitHub releases.

- Sign into [Travis CI](https://travis-ci.org/) with GitHub.
- Click on the slide toggle next to `junk-kit`.
- Update all Travis CI links in this file to point to your fork (change
  `jameswilddev` to your GitHub name).

##### Travis CI to GitHub releases

This means that the zipped build results will automatically be added as GitHub
releases on every commit.

- Generate a [GitHub personal access token](https://github.com/settings/tokens).
- Install [Ruby](https://www.ruby-lang.org/en/downloads/).
- In the terminal, type `gem install travis`.
- In the terminal, type `travis encrypt your-personal-access-token --repo your-github-name/your-repository-name`.
- Replace the existing `secure: "encrypted-personal-access-token"` in
  [.travis.yml](.travis.yml) with that written to the terminal.

#### Optional

The following continuous integration services may be useful for forks of the
build pipeline, but are less useful for making your own games.

##### Renovate

This means that any updates to the tools used to build games will be presented
to you as GitHub pull requests in your fork.

- Click `Install` at (https://github.com/apps/renovate).
- Either select `All Repositories` or `Only select repositories` and ensure that
  `junk-kit` is selected.

##### FOSSA

This means that your fork's dependencies will be checked to ensure that their
licenses do not conflict or present unexpected obligations.

- Sign up with GitHub at [FOSSA](https://fossa.com/).
- Follow the profile setup steps.  For `Set Default Policy`,
  `Standard Bundle Distribution` is probably good enough.
- Choose `Quick Import`.
- Choose `GitHub`.
- Click `Connect With Service`.
- Tick `junk-kit`.
- Click `Import 1`.
- Update all FOSSA links in this file to point to your fork (change
  `jameswilddev` to your GitHub name).

## File structure

### Notation

#### `{game-name}`

Up to 50 characters, where:

- The first character is a lower case letter.

- The last character is a lower case letter or digit

- Every other character is a lower case letter, digit or hypen.

#### `{file-path}`

Any file path (including files within folders), where:

- The first character is a lower case letter.

- The last character is a lower case letter or digit

- Every other character is a lower case letter, digit or hyphen.

- Hyphens are forbidden immediately preceding or following a folder separator
  (`/` or `\`).

### Paths

#### `src/engine/src/{file-path}.ts`

TypeScript which is included in every game.

#### `src/engine/src/{file-path}.d.ts`

Defines types which the engine expects games to define.

#### `src/engine/src/index.pug`

Rendered as `index.html` in zipped games.  The following variables are defined:

| Name         | Description                                     |
| ------------ | ----------------------------------------------- |
| `javascript` | The minified JavaScript generated for the game. |

#### `src/games/{game-name}/src/{file-path}.ts`

TypeScript included in the game.

#### `src/games/{game-name}/src/{file-path}.svg`

SVG minified and included in the game's TypeScript global scope.  For instance,
`src/games/test-game-name/src/complex-multi-level/folder-structure/with-a-file.svg`
will be available in the game's TypeScript global scope as
`complexMultiLevel_folderStructure_withAFile_svg`.

#### `dist/{game-name}.zip`

The built game artifact.

#### `src/hot-reload/src/index.ts`

TypeScript which is included in every game during debug builds to enable hot
reload.

## Engine

The included game engine is a little unconventional, and may not be appropriate
for your own games.

It is optimised for:

- Small artifact size.
- Hot reload.
- Resolution independence.
- Low system load during inactivity.
- Mouse or touch input.

It is not good for:

- Complex animation.
- Physics.
- Keyboard or gamepad input.

### Architecture

```
initial -.-> state -> render -> viewports -.-> groups/sprites
         |                                 '-> hitboxes --.
         '------------------------------------------------'
```

#### State

All mutable game state is stored in a single JSON-serializable object called
`state`.  This is loaded from local storage if available, with fallback to an
initial state.

### Namespacing

The build system does not make use of any kind of bundling or closures to keep
your game and engine code separate.  This is to give the minification process
the best chance at creating the smallest build artifacts.

For that reason, avoid referencing or defining anything prefixed `engine` or
`Engine` on the global scope within game code.  This is likely an internal
implementation detail which could break in future engine updates.

### To be defined by your game

The following must be defined by your game TypeScript for building to succeed.

#### `State`

A JSON-serializable type which contains all mutable state for your game.

If breaking changes are made to this (such as changing the JSON which would be
de/serialized in such a way that state recovered from local storage would no
longer work) please change `version`.

#### `initial`

A function which returns a new instance of the default state, used when local
storage does not contain a state, or the state is not usable.

#### `version`

A number which identifies breaking changes to `State`.  If this does not match
that loaded from local storage, `initial` will be used instead.

#### `audioReady`

Executed immediately after the Web Audio API is initialized, for the creation of
virtual instruments.

```typescript
function audioReady(): void {
  // audioContext is available here.
}
```

#### `beatsPerMinute`

The number of beats per minute in the game's music.

#### `renderBeat`

Called once per beat while the music is playing.  Use this to generate the
game's music, one beat at a time.

```typescript
function renderBeat(): void {
  // audioContext, beat and beatTime are available here.
}
```

#### `render`

Executed when `state` is known to have changed, to re-render the scene.  See
Render Emitters for details on what can be done in this callback.

##### Mutation callbacks

A mutation callback is executed when an event occurs which could alter state,
and will be followed by a re-`render`.

### Defined by the engine

#### `gameName`

The name of the game from its path under `src/games`, as a string.

#### `state`

The current state; modify as you please.

#### `saveLoadAvailable`

When truthy, mutation callbacks' `save`, `load` and `drop` are likely to work.

When falsy, mutation callbacks' `save`, `load` and `drop` will definitely not
work.

#### `audioContext`

The current Web Audio API context.  This should only be used in the `audioReady`
and `renderBeat` functions.

#### `beat`

The number of beats of game music rendered so far.  This should only be used in
the `renderBeat` function.

#### `beatTime`

Converts a unit interval into the beat being rendered into a Web Audio API time.

```typescript
const webAudioApiTimeOfBeatStart = beatTime(0)
const webAudioApiTimeOfBeatMidpoint = beatTime(0.5)
const webAudioApiTimeOfBeatEnd = beatTime(1)
```

This should only be used in the `renderBeat` function.

#### `Truthiness`

Either `1` or `undefined`.  Useful for indicating a `true`/`false` flag without
the overhead of `return !1` or similar.

#### `Json`

Types which can be serialized to or deserialized from JSON.

#### `linearInterpolate`

Linearly interpolates between two values by a unit interval, extrapolating if
that mix value leaves the 0...1 range.

#### `dotProduct`

```typescript
console.log(dotProduct(3, 4, 5, 6)) // 39
```

Calculates the dot product of two vectors.

#### `magnitudeSquared`

```typescript
console.log(magnitudeSquared(3, 4)) // 15
```

Calculates the square of the magnitude of a vector.

#### `magnitude`

```typescript
console.log(magnitude(3, 4)) // 3.872983346
```

Calculates the magnitude of a vector.

#### `distanceSquared`

```typescript
console.log(distanceSquared(8, 20, 5, 16)) // 15
```

Calculates the square of the distance between two vectors.

#### `distance`

```typescript
console.log(distance(8, 20, 5, 16)) // 3.872983346
```

Calculates the distance between two vectors.

#### `KeyCode`

A type which represents a [HTML5 key code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code).
This maps to a location on the keyboard, not what the key is mapped to.

#### Render emitters

These can be called during the render callback to describe something which the
render emits.

##### `elapse`

```typescript

// The time was 200.

elapse(650)

// The time is now 850.

```

Progress the timeline by the given number of milliseconds.

##### `phase`

```typescript

// First phase.

phase()

// Second phase.

phase()

// Third phase.

phase()

// Final, looping phase.

```

Phases can be thought of as "bookmarks" in the animation described during
`render`.  Phases can be used for skipping; for instance, you might have a
sequence of events which can be individually skipped but do not otherwise
require any user input.

The last phase loops.  If no looping animation is desired at all, this can be
prevented by making the last phase empty (e.g. calling `phase` at the end of
`render`).

##### `viewport`

```typescript
const createdViewport = viewport(
  320, // viewportMinimumWidthVirtualPixels
  240, // viewportMinimumHeightVirtualPixels
  420, // viewportMaximumWidthVirtualPixels
  400, // viewportMaximumHeightVirtualPixels
  0, // viewportHorizontalAlignmentSignedUnitInterval
  0, // viewportVerticalAlignmentSignedUnitInterval
)
```

Viewports sit directly under the root of the scene graph.  They persist until
the next `render`.  They cannot be animated.

##### `viewportMinimumWidthVirtualPixels`/`viewportMinimumHeightVirtualPixels`/`viewportMaximumWidthVirtualPixels`/`viewportMaximumHeightVirtualPixels`

The X axis runs from center to right, while the Y axis runs from center to
bottom.

A "virtual resolution" is specified, which maps to SVG pixels.  The `minimum`
`width` and `height` define the "safe area" which is guaranteed to be visible.
This will be made as large as possible without cropping it or distorting the
aspect ratio.

The `maximum` `width` and `height` define how much margin is visible around the
"safe area" when the display resolution's aspect ratio does not match that of
the "safe area".

For instance, in the above example, if the screen is wider than a 4:3 aspect
ratio, up to 50 extra virtual pixels will be shown left of X -160, and a further
50 right of X 160.  The viewport will be cropped beyond the "maximum".

###### `viewportHorizontalAlignmentSignedUnitInterval`/`viewportVerticalAlignmentSignedUnitInterval`

Viewports are alignable to display borders, for elements such as buttons which
should be near the edges of devices.

Horizontal and vertical alignment are signed unit intervals, where -1 aligns the
left and top borders of the viewport with those of the display, 0 centers the
viewport on the display, and 1 aligns the right and bottom borders of the
viewport with those of the display.

##### `group`

```typescript
const createdGroup = group(parentViewportOrGroup)
```

Groups are not themselves visible, but can be used to manipulate a set of other
objects as a whole, or control render order.  They are hidden until the time at
which they were created.

##### `sprite`

```typescript
const createdSprite = sprite(parentViewportOrGroup, importedFile_svg)
```

Sprites display imported SVG files.  They are hidden until the time at
which they were created.

Their origin is the center of the bounding box of the SVG.

##### `hitbox`

```typescript
hitbox(
  parentViewport,
  leftVirtualPixels,
  topVirtualPixels,
  widthVirtualPixels,
  heightVirtualPixels,
  () => {
    state.aKeyPressed = true
  }
)
```

Maps an area of the display to a mutation callback, which is then executed when
that area is clicked on or touched.  If multiple cover the same area, the last
hitbox defined in the last viewport defined takes priority.

Hitboxes cannot be animated.

##### Easings

These describe how a subject object will interpolate between the current
keyframe and the next.  The default behaviour is `stepEnd`.

###### `stepEnd`

```typescript

// Configure the group or sprite before the sudden transition.

stepEnd(groupOrSprite)

// Configure the group or sprite after the sudden transition.

```

Sets a hard transition; allows for changes without any interpolation.

###### `linear`

```typescript

// Configure the keyframe to interpolate from.

linear(groupOrSprite)

// Elapse, then configure the keyframe to interpolate to.

```

Interpolates linearly; at a constant rate.  This makes the start and end of the
motion somewhat abrupt.

###### `easeOut`

```typescript

// Configure the keyframe to interpolate from.

easeOut(groupOrSprite)

// Elapse, then configure the keyframe to interpolate to.

```

Interpolates quickly, decelerating towards the end.

###### `easeIn`

```typescript

// Configure the keyframe to interpolate from.

easeIn(groupOrSprite)

// Elapse, then configure the keyframe to interpolate to.

```

Interpolates slowly, accelerating towards the end.

###### `easeInOut`

```typescript

// Configure the keyframe to interpolate from.

easeInOut(groupOrSprite)

// Elapse, then configure the keyframe to interpolate to.

```

Interpolates slowly, accelerates towards the middle, then decelerates again
towards the end.

###### `ease`

```typescript

// Configure the keyframe to interpolate from.

ease(groupOrSprite)

// Elapse, then configure the keyframe to interpolate to.

```

Interpolates at moderate speed, accelerates towards the middle, then decelerates
again towards the end.

##### Transforms

These manipulate the current keyframe of the subject object.  If the subject
object has no keyframe at the current time, a new non-interpolating keyframe is
created based on the previous keyframe first.

###### `setOpacity`

```typescript
setOpacity(groupOrSprite, 0.4)
```

Sets the opacity, where 0 is fully transparent and 1 is fully opaque.

###### `hide`

```typescript
hide(groupOrSprite)
```

Equivalent to `setOpacity(groupOrSprite, 0)`.

###### `show`

```typescript
show(groupOrSprite)
```

Equivalent to `setOpacity(groupOrSprite, 1)`.

###### `translateX`

```typescript
translateX(groupOrSprite, 20)
```

Translates by the given number of virtual pixels on the X axis.

###### `translateY`

```typescript
translateY(groupOrSprite, 20)
```

Translates by the given number of virtual pixels on the Y axis.

###### `translate`

```typescript
translate(groupOrSprite, 20, 65)
```

Translates by the given numbers of virtual pixels on the X and Y axes
respectively.

###### `rotate`

```typescript
rotate(groupOrSprite, 90)
```

Rotates by the given number of degrees clockwise.

###### `scaleX`

```typescript
scaleX(groupOrSprite, 2)
```

Scales by the given factor on the X axis.

###### `scaleY`

```typescript
scaleY(groupOrSprite, 2)
```

Scales by the given factor on the Y axis.

###### `scale`

```typescript
scale(groupOrSprite, 2, 4)
```

Scales by the given factors on the X and Y axes respectively.

###### `scaleUniform`

```typescript
scaleUniform(groupOrSprite, 2)
```

Scales by the given factor on the X and Y axes.

##### `mapKey`

```typescript
mapKey(`KeyA`, () => {
  state.aKeyPressed = true
})
```

Maps a `KeyCode` to a mutation callback.  If multiple are defined with the same
`KeyCode`, the last defined takes priority.

#### Mutation Callback Helpers

These are intended to be used only during a mutation callback.

##### `save`

Saves a JSON-serializable object under the given string key.

Returns truthy when successful.

Returns falsy and has no side effects when unsuccessful.

```typescript
const truthyOnSuccess = save(`a-key`, aJsonSerializableValue)
```

##### `load`

Loads the JSON-serializable object with the given key.  Makes no attempt to
ensure that the deserialized object matches the specified type.

Returns the deserialized object when successful.

Returns `null` when unsuccessful or not previously saved.

```typescript
const deserializedOrNull = load<AJsonSerializableType>(`a-key`)
```

##### `drop`

Deletes the object with the given string key.

Returns truthy when successful, including when no such object exists.

Returns falsy and has no side effects when unsuccessful.

```typescript
const truthyOnNonFailure = drop(`a-key`)
```

## Build pipeline

The build pipeline is implemented using Node.JS and TypeScript.

There are two entry points: `src/pipeline/cli.ts` and `src/pipeline/ci.ts`, for
their respective usages.  These should produce the same artifacts, but while
`cli` is intended for local development purposes (watch builds, does not stop
on error, hosts build artifacts via HTTP with hot reload), `ci` is instead
intended for continuous integration environments (stops on first error or
executed plan, logs more heavily).

### Architecture

```
files -> diff -> planning -> steps -> artifacts
                              | ^
                              v |
                             stores
```

- A file source produces a list of file paths and corresponding version
  identifiers.

- A diff algorithm determines which files have been added, deleted, modified and
  remain the same.

- A planning algorithm generates a hierarchy of build steps need to be executed
  based on the diff.

- The steps execute, caching to a set of stores.

- Build artifacts are written to disk.

### Debugging

The most error-prone part of the build pipeline is planning; it can be difficult
to determine exactly which steps should be executed based on the given diff.

To make it easier to determine exactly which steps were planned, it is possible
to query the hierarchy for a [nomnoml](http://www.nomnoml.com/) document
detailing exactly which steps were planned to be executed and in what order.

To do this, call `getNomNoml` on the result of `plan`.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjameswilddev%2Fjunk-kit.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjameswilddev%2Fjunk-kit?ref=badge_large)
