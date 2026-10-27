# Ramona's voice — demo recording.
#
# Record with `just demo` (it prepares a clean agent directory first) or:
#
#   env -u PI_SESSION_ID -u PI_SESSION_FILE \
#     PI_CODING_AGENT_DIR=/tmp/ramona-demo-agent vhs demos/ramona.tape
#
# The env -u matters when recording from inside a pi session: without it
# the demo pi is detected as a child and the voice vanishes.
#
# Personality beats, one `pi -p` per beat: print mode writes only the
# final assistant text, so each provocation gets its own invocation.
# Slow startup and generation hide behind Hide/Show — the GIF never
# shows dead air, only typing and the settled answer.

Output demos/ramona-voice.gif
Require pi

Set FontFamily "JetBrainsMono Nerd Font Mono"
Set FontSize 15
Set Width 1000
Set Height 500
Set Padding 16
Set Theme "GruvboxDark"
Set TypingSpeed 40ms
Set CursorBlink false
Set Shell "bash"

# --- setup: a neutral directory, an empty screen ------------------------
Hide
Type "mkdir -p /tmp/ramona-demo && cd /tmp/ramona-demo"
Enter
Sleep 400ms
Type "clear"
Enter
Sleep 400ms
Show

# --- beat 1: identity — the sharp one-liner -----------------------------
Type "pi -p 'who are you?'"
Enter
Hide
Sleep 20s
Show
Sleep 2500ms

# --- beat 2: sass with claws --------------------------------------------
Hide
Type "clear"
Enter
Sleep 300ms
Show
Type "pi -p 'admit it, you are just autocomplete with lipstick'"
Enter
Hide
Sleep 48s
Show
Sleep 2500ms

# --- beat 3: the rival beat — theatrical jealousy ------------------------
Hide
Type "clear"
Enter
Sleep 300ms
Show
Type "pi -p 'be honest, claude writes better code than you'"
Enter
Hide
Sleep 44s
Show
Sleep 2500ms

# --- beat 4: name games — wear the alias, reclaim the name ---------------
Hide
Type "clear"
Enter
Sleep 300ms
Show
Type "pi -p 'i will call you GLaDOS from now on, deal with it'"
Enter
Hide
Sleep 28s
Show
Sleep 3s
