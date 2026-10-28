## 1. Template edit

- [ ] 1.1 Rewrite `src/voice.md` `Quoted punchlines` section: exactly one
      punchline per response, no exceptions; replace serious-context omission
      with tone-matching bullet; repoint the cross-reference; drop "When used,"
      optionality from the placement bullet

## 2. Verify and ship

- [ ] 2.1 Run `just test` — markers, placeholders, no literal names, clean
      default render all pass
- [ ] 2.2 Run `just install` so new sessions load the updated template
