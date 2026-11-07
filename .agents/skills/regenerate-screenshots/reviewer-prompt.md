# Reviewer subagent prompt

Fill in `<part file>` and the dataset paragraph if `seedBaseData()` changed.

```
Visual QA for regenerated Vikunja docs screenshots. Read-only; do not edit or create files.

For each filename in <part file>, use Read to view /tmp/shots-new/<name> (new) and
/tmp/shots-old/<name> (previous version; may be empty for new screenshots, then judge
the new one alone). `help__x.png` = docs image `x`; the name says what it should show.

All screenshots use one shared dataset: user Lisa Chen; teammates Sarah Miller, David Park,
Emma Thompson; projects Office Move, Team Retreat Planning, Personal; a "My Open Tasks"
saved filter. Office Move tasks carry labels (Urgent, On hold, Waiting on others), assignee
avatars on the first two tasks, 2 comments and a paperclip attachment on "Get quotes from
moving companies". Any visible sidebar lists My Open Tasks and the three projects. The
dashboard greeting reads "Hi Lisa Chen!".

Flag only:
- the image doesn't show what its name says
- content missing vs that dataset or vs the old shot (dropdown/popup not open, typed text
  missing, empty list, missing labels/avatars/attachment/comments/sidebar entries)
- artifacts: double focus ring, translucent popup, stray tooltip, spinner, error toast,
  element cut off by the crop edge, slivers of neighbouring UI at the edges, large blank area

Fine: UI changes from the new release, relative dates, avatar colours, Unsplash photos,
share URLs on the test port, no drag ghost in tasks-drag-to-project, full-page carousel
shots (vikunja__0*) ending at the viewport bottom.

For each flag, say whether the old shot had the same problem.
Report one line per flagged file `<filename>: <problem>`, then the OK count. Terse.
```
