# Methods and Language

A browser game for practising research methods in linguistics, written to sit alongside
the second-year Research Methods module (CMM378) rather than replace it. It's the sister
game to [Shapes and Language](https://github.com/jjgerard/shapes), and works the same
way: it runs on a phone, needs no account, stores nothing on a server, and has no build
step.

## Get it on a phone

Open the link and add it to the home screen. It then opens full-screen with its own
icon, like any other app.

| | |
|---|---|
| **iPhone / iPad** | Open the link in Safari → **Share** → **Add to Home Screen** |
| **Android** | Open the link in Chrome → **⋮** → **Install app** (or **Add to Home screen**) |

As with Shapes, there's deliberately no service worker and no offline cache, so nobody
can end up on a stale copy without knowing.

## The design

**Ten in a row.** Every sub-level is finished by getting 10 answers right in a row. A
wrong answer starts the run again, and every third correct answer doubles what each one
is worth, and what a wrong one costs. Most questions have only two answers, so this is
what stops a run being won by guessing.

**Never just "no".** Every wrong answer comes with the reason: which one was right, and
why. For a thing that isn't a variable, that usually means naming the variable hiding
inside it: the Titanic isn't a variable, but ship size is.

**The idea before its name.** Sub-level 1b asks which variable is the *changer* and which
is the *change-ee*. 1c asks exactly the same questions about the same statements, using
*independent* and *dependent variable* instead. The formal terms arrive as new names for
something the student can already do, not as two more words to memorise. This is the
same idea as the Mystery Level in Shapes and Language, and nothing before 1c uses the
formal terms.

**No shortcuts through the wording.** Many statements mention the change-ee first
("Reading time goes up as sentences get more complex"), so "the first thing mentioned is
the cause" never works as a rule. 1b and 1c ask for the changer half the time and the
change-ee the other half, so tapping the cause can't become a reflex that skips the
reading.

## The levels

| | Sub-level | What it asks |
|---|---|---|
| **1a** | Variable or not? | Is this a measurable feature with different possible values? Includes constants (the speed of light) that are measurable but never vary. |
| **1b** | Changer and change-ee | In this statement, which variable changes the other? |
| **1c** | Independent and dependent | The same question, with the proper names. |
| **1d** | Match the graph | Four graphs, one statement: forwards or backwards (which variable is on which axis), crossed with increasing or decreasing. |

More levels will be added as the module outline is written.

## Running it

```sh
python3 -m http.server 8123      # then open http://localhost:8123
```

Assets carry a `?v=N` query string. Bump it in `index.html` on every change so nobody is
served a cached old copy.

## The code

| File | What's in it |
|---|---|
| `data.js` | Every item, statement, explanation and level. Adding a level means adding data here. |
| `quiz.js` | The question types (sort, roles, graph) and the quiz modal they all share. |
| `graphs.js` | The small scatter-plot graphs for 1d. |
| `app.js` | Players, progress, points, screens, menu, help, and the mascot. |
| `streak.js` | The 10-in-a-row scoring engine, shared with Shapes and Language. |
| `sound.js` | Synthesised sound effects, with no audio files. |
| `logo.svg` | The source for `logo.png` and the `icon-*.png` files. |

Comments say why, not what. If a change makes one of them false, the change probably
needs rethinking.
