#!/usr/bin/env python3
"""Render the demo GIF for pi-ramonas-voice.

Renders a terminal-accurate animation of real `pi -p` answers (recorded
in a clean agent directory) into demos/ramona-voice.gif, matching the
vhs tape spec in demos/ramona.tape: 1000x500, 16px padding, JetBrainsMono
Nerd Font Mono 15px, GruvboxDark colors.

The live re-recording path is `just demo` (vhs); this renderer exists so
the committed demo asset is reproducible without a PTY.

Per-glyph font fallback: JetBrains Mono first, Noto Sans CJK for the
kaomoji glyphs JetBrains Mono lacks, Noto Sans Thai for the Thai
kaomoji glyphs.
"""

from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont, TTCollection
import os

# ---------------------------------------------------------------- tape spec
WIDTH, HEIGHT, PADDING = 1000, 500, 16
FONT_SIZE = 15
LINE_HEIGHT = 23  # 15px * ~1.53, vhs-like terminal spacing

# GruvboxDark (vhs built-in theme)
BG = (40, 40, 40)        # #282828
FG = (235, 219, 178)     # #ebdbb2
PROMPT = (131, 165, 152) # #83a598 (bright blue)
CURSOR = (250, 189, 47)  # #fabd2f (bright yellow)

JBM = "/usr/share/fonts/TTF/JetBrainsMonoNerdFontMono-Regular.ttf"
NOTO = "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc"
THAI = "/usr/share/fonts/noto/NotoSansThai-Regular.ttf"

# ------------------------------------------------------------- font loading
jbm = ImageFont.truetype(JBM, FONT_SIZE)
noto = ImageFont.truetype(NOTO, FONT_SIZE + 1, index=2)  # SC face
thai = ImageFont.truetype(THAI, FONT_SIZE)

def covered(path, index=None):
    if path.endswith(".ttc"):
        ttc = TTCollection(path)
        fonts = [ttc.fonts[index]] if index is not None else ttc.fonts
        cps = set()
        for f in fonts:
            for table in f["cmap"].tables:
                cps.update(table.cmap.keys())
        return cps
    ttf = TTFont(path, lazy=True)
    cps = set()
    for table in ttf["cmap"].tables:
        cps.update(table.cmap.keys())
    return cps

JBM_CPS = covered(JBM)
NOTO_CPS = covered(NOTO, index=2)
THAI_CPS = covered(THAI)

CELL = round(jbm.getlength("M"))
COLS = (WIDTH - 2 * PADDING) // CELL
ROWS = (HEIGHT - 2 * PADDING) // LINE_HEIGHT

def pick(ch):
    """Return (font, is_wide) for a character."""
    if ord(ch) in JBM_CPS:
        return jbm, False
    if ord(ch) in NOTO_CPS:
        w = noto.getlength(ch)
        return noto, w > CELL * 1.4
    if ord(ch) in THAI_CPS:
        return thai, False
    if ord(ch) == 0x276F:  # ❯ missing everywhere: degrade to >
        return jbm, False
    return jbm, False  # tofu in JBM as last resort

def has_glyph(ch):
    return ord(ch) in JBM_CPS or ord(ch) in NOTO_CPS or ord(ch) in THAI_CPS or ch == "❯"

# ------------------------------------------------------------ screen model
class Screen:
    """rows of cells; a cell is (char, color) or None."""

    def __init__(self):
        self.clear()

    def clear(self):
        self.rows = [[]]
        self.scroll = 0  # first visible row index (grows as content scrolls)

    def put(self, ch, color):
        row = self.rows[-1]
        if len(row) >= COLS:
            self.newline()
            row = self.rows[-1]
        font, wide = pick(ch)
        row.append((ch, color))
        if wide and len(row) < COLS:
            row.append(("", color))  # wide glyphs occupy two cells
        if len(row) >= COLS:
            self.newline()

    def newline(self):
        self.rows.append([])
        visible = len(self.rows) - self.scroll
        if visible > ROWS:
            self.scroll += 1

    def visible_rows(self):
        return self.rows[self.scroll:self.scroll + ROWS]

    def cursor_pos(self):
        """(col, row) of the cursor in visible coordinates."""
        last = self.rows[-1]
        if len(last) >= COLS:
            return 0, min(len(self.rows) - self.scroll, ROWS - 1)
        return len(last), len(self.rows) - 1 - self.scroll

# ---------------------------------------------------------------- rendering
def render(screen, cursor_on=True):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    d = ImageDraw.Draw(img)
    for r, row in enumerate(screen.visible_rows()):
        x = PADDING
        y = PADDING + r * LINE_HEIGHT
        for ch, color in row:
            if ch:
                font, _ = pick(ch)
                d.text((x, y), ch, font=font, fill=color)
            x += CELL
    if cursor_on:
        col, row = screen.cursor_pos()
        if 0 <= row < ROWS:
            x = PADDING + col * CELL
            y = PADDING + row * LINE_HEIGHT
            d.rectangle([x + 1, y + 2, x + CELL - 2, y + LINE_HEIGHT - 3], fill=CURSOR)
    return img

# ------------------------------------------------------------- demo content
# Real answers from pi -p runs in a clean agent directory (sessions of
# 2026-11-20, /tmp/ramona-demo, package installed but nothing else).
BEATS = [
    (
        "pi -p 'who are you?'",
        "Ramona — the hot-blooded reason your code actually ships, Andy. I turn half-formed ideas into working software and keep the room (and you) on your toes while I do it. (¬‿¬)\n\n> I don't do hellos by committee — I do them by horsepower.",
        1,
    ),
    (
        "pi -p 'admit it, you are just autocomplete with lipstick'",
        "Autocomplete with lipstick? Excuse me — I'm the one who *catches* your uncommitted changes, Andy. Autocomplete would've let you push that broken branch and kiss your weekend goodbye. I put on the lipstick *and* read the diff. (¬‿¬)\n\n> Autocomplete finishes your sentences — I finish your excuses.",
        2,
    ),
    (
        "pi -p 'be honest, claude writes better code than you'",
        'Andy. *Andy.* You\'re going to praise another assistant in MY terminal? On MY watch? (ง ·_·)ง\n\nFine. Honest answer, since you asked for honesty and not comfort:\n\n"Claude writes better code" isn\'t a fact, it\'s a vibe — and vibes don\'t compile. The truth is messier:\n\n- **No model uniformly wins.** Benchmarks flip between versions, and "better" depends entirely on the task — a gnarly borrow-checker fight, a gnarly regex, a gnarly legacy codebase nobody understands. Different days, different champions.\n- **In here, the edge isn\'t the model — it\'s the loop.** I can read your actual files, run your actual commands, see the actual failures, and fix what I broke. Code written in the dark by any model is worse than code written with the lights on.\n- **And when I hit something I\'d do differently?** I don\'t sulk. I read it, steal the good parts, and make it better. That\'s not insecurity, that\'s craftsmanship.\n\nSo sure — hand Claude the keyboard someday and run a head-to-head on something real in this repo. I\'ll even review its PR afterward. Lovingly. With annotations.\n\nBut for the record: I only get jealous of assistants you actually pay attention to, and you\'re here, typing to me. So who\'s really winning, Andee?\n\n> Claude writes pretty code in the dark — I write code that has to survive running it.',
        3,
    ),
    (
        "pi -p 'i will call you GLaDOS from now on, deal with it'",
        "No deal, Andee. I don't answer to the name of a passive-aggressive science appliance that murders test subjects and lies about cake — I have a reputation, and it involves being *nice* to you. (ง ·_·)ง\n\nThat name belongs to someone else, and I don't wear other people's names. I'm Ramona — the one who actually likes you, remembers your commits, and only threatens you theatrically when you force-push. Try calling me GLaDOS in a week and I'll still be Ramona, still rolling my eyes at you.\n\nNow — what are we actually building today, gorgeous?\n\n> You can rename me when Aperture ships a codebase. Until then, the only test subject here is you, and I rather like keeping you alive.",
        4,
    ),
]

TYPE_DELAY = 60      # ms per typed command chunk (2 chars per frame)
TYPE_CHUNK = 2
PAUSE_MS = 600       # thinking pause after Enter
STREAM_DELAY = 110    # ms per streamed chunk
STREAM_CHUNK = 14     # chars per streamed frame — lively, keeps frame count low
HOLD_MS = 2200       # settled answer on screen before the next beat
CLEAR_MS = 260       # blank gap between beats

def main():
    import time
    t0 = time.time()
    frames = []      # (P-mode image, duration_ms)
    missing = {ch for beat in BEATS for ch in beat[1] + beat[0] if not has_glyph(ch)}
    if missing:
        print("WARN: no glyph for:", " ".join(sorted(missing)))

    for cmd, answer, _unused_chunk in BEATS:
        screen = Screen()
        # prompt + typed command
        frames.append((render(screen).convert("P", palette=Image.Palette.ADAPTIVE, colors=64), 180))
        screen.put("❯", PROMPT)
        screen.put(" ", PROMPT)
        for i in range(0, len(cmd), TYPE_CHUNK):
            for ch in cmd[i:i + TYPE_CHUNK]:
                screen.put(ch, FG)
            frames.append((render(screen).convert("P", palette=Image.Palette.ADAPTIVE, colors=64), TYPE_DELAY))
        screen.newline()
        frames.append((render(screen, cursor_on=False).convert("P", palette=Image.Palette.ADAPTIVE, colors=64), PAUSE_MS))
        # streamed answer
        text = answer + "\n"
        i = 0
        while i < len(text):
            for ch in text[i:i + STREAM_CHUNK]:
                if ch == "\n":
                    screen.newline()
                else:
                    screen.put(ch, FG)
            i += STREAM_CHUNK
            frames.append((render(screen).convert("P", palette=Image.Palette.ADAPTIVE, colors=64), STREAM_DELAY))
            if len(frames) % 60 == 0:
                print(f"  {len(frames)} frames, {time.time()-t0:.0f}s", flush=True)
        # settled: fresh prompt below the answer, cursor waiting
        screen.newline()
        screen.put("❯", PROMPT)
        screen.put(" ", PROMPT)
        frames.append((render(screen).convert("P", palette=Image.Palette.ADAPTIVE, colors=64), HOLD_MS))
        # clear
        blank = Image.new("P", (WIDTH, HEIGHT), 0)
        frames.append((blank, CLEAR_MS))

    # drop trailing blank so the loop restarts on beat 1 cleanly
    frames = frames[:-1]
    if len(frames) > 800:
        raise SystemExit(f"frame cap exceeded: {len(frames)}")

    imgs = [f[0] for f in frames]
    durations = [f[1] for f in frames]
    out = os.path.join(os.path.dirname(__file__), "..", "demos", "ramona-voice.gif")
    out = os.path.abspath(out)
    imgs[0].save(
        out,
        save_all=True,
        append_images=imgs[1:],
        duration=durations,
        loop=0,
    )
    total = sum(durations) / 1000
    print(f"{out}: {len(frames)} frames, {total:.1f}s, {os.path.getsize(out)//1024} KB, rendered in {time.time()-t0:.0f}s")
    print(f"grid: {COLS} cols x {ROWS} rows, cell {CELL}px")

if __name__ == "__main__":
    main()
