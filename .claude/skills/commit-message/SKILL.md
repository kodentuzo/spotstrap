---
name: commit-message
description: Write a Conventional Commits message and commit the current changes in Spotstrap. Use when a step is finished and verified, or when the user asks for a commit. The agent commits; it pushes, merges and tags only when the user asks.
---

# Commit

You commit finished, verified work with this message, following
[Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Never force-push
or push to `dev` or `main` directly; work on a branch off `dev`. Push, merge and tag only when the user asks.

## Steps

1. Read the change: `git status` and `git diff` (plus `git diff --staged` if anything is
   staged). Base the message on the diff, not on memory.
2. If the changes mix unrelated work, say so and split them into separate commits.
3. If the change is user-facing, add it to `## [Unreleased]` in `CHANGELOG.md` in the same
   commit (see "Changelog" below).
4. Stage only the files that belong to the commit (`git add <paths>`), commit with the
   message, and show the user the resulting `git log --oneline` line.

## Format

```
<type>(<scope>)<!>: <summary>

<body>

<footer>
```

- **Summary:** imperative and lower case, with no trailing period, **at most 50 characters**
  including the type and scope (72 is the hard limit). Count before committing.
- **Body (optional):** explains *why*, plus anything non-obvious. Wrap at 72 characters. Skip
  it for trivial changes.
- **Breaking changes:** add `!` after the scope, and a
  `BREAKING CHANGE: <what and how to migrate>` footer.

## Types

`feat`, `fix`, `refactor`, `perf`, `style` (formatting only), `test`, `docs`, `build`
(toolchain, dependencies), `ci`, `chore` (repo housekeeping), `revert`.

`feat` maps to a minor release, `fix` and `perf` to a patch, and a breaking change to a major
one ([SemVer 2.0.0](https://semver.org/spec/v2.0.0.html)). While the version is `0.y.z`, a
breaking change raises the minor version instead.

## Scopes

Optional, but use one when it fits:

| Scope  | Covers                                   |
| ------ | ---------------------------------------- |
| `docs` | `docs/`, ADRs                            |
| `deps` | dependency changes                       |
| `ci`   | GitHub workflows                         |
| `ai`   | `.claude/`, skills, `CLAUDE.md`          |
| `repo` | license, root config, repo metadata      |

Add a scope here when a new package or area appears. Leave the scope out for repo-wide changes.

## Changelog

`CHANGELOG.md` follows [Keep a Changelog 1.0.0](https://keepachangelog.com/en/1.0.0/):

- New entries go under `## [Unreleased]`, in `### Added`, `### Changed`, `### Deprecated`,
  `### Removed`, `### Fixed` or `### Security`, in that order. Add a heading only when it has
  entries.
- Write for the people who use the library, not about the commit. Internal changes (`ci`,
  `chore`, `ai`, refactors) don't get an entry.
- Breaking changes go under **Changed** or **Removed**, with migration steps.
- A release renames `[Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD` and opens a new empty
  `[Unreleased]` above it.

## Example

```
feat(docs): add decision record for theming

Projects need to know whether they pull in a preset or a CSS file
before any component exists, so this is settled first.
```
