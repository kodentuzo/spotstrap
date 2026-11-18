# Spotstrap

A UI library. The first focus is Tailwind CSS and how other projects pull it in.

## Layout

| Path           | What                                  |
| -------------- | ------------------------------------- |
| `docs/`        | Guides and ADRs (`docs/decisions/`)   |
| `CHANGELOG.md` | Keep a Changelog; `Unreleased` on top |

## Conventions

- **Branches:** `dev` is the default; branch from it and open PRs into it. `main` is
  production.
- **Releases:** fast-forward `main` to `dev`, tag `vX.Y.Z` on `main`, then merge `main` back
  into `dev`.
- **Commits:** commit each finished, verified step with a
  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) message (skill
  `commit-message`). Never force-push or push to `dev` or `main` directly. Push, merge and tag only
  when the user asks.
- **Versions** follow [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html); `CHANGELOG.md`
  follows [Keep a Changelog 1.0.0](https://keepachangelog.com/en/1.0.0/). User-facing changes
  go under `Unreleased` in the same commit. Breaking changes need migration steps.
- **Decisions** get an ADR in `docs/decisions/` (skill `adr`); a changed decision gets a new ADR
  that supersedes the old one.
- **Docs describe how things work now.** The reasoning and the story behind them go in the
  private journal, `~/Repositories/SPOTSTRAP_JOURNAL.md` (outside the repo, never committed). ADRs are the
  one place decisions are written up in the repo.
- Plain, short sentences in docs and comments.
