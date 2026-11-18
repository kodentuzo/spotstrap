# Releasing

Spotstrap follows [SemVer](https://semver.org/spec/v2.0.0.html). Its public API is the export
paths, class names, token names, `spotstrap/js`'s `init()` and the recipes' signatures
([ADR 0002](decisions/0002-package-and-publishing.md)): renaming or removing any of them is a
breaking change. While the version is 0.y.z, a breaking change raises the minor version.

## A release

1. On a branch off `dev`, set `version` in `package.json`, and in `CHANGELOG.md` rename
   `Unreleased` to the version and date and add its compare link. Merge the PR into `dev`.
2. Fast-forward `main` to `dev` and push it: `git push origin origin/dev:main`.
3. Tag the commit and push the tag: `git tag -s v0.1.0 -m v0.1.0 origin/main^{commit}` and
   `git push origin v0.1.0`.
4. CI verifies the tagged commit, then publishes `spotstrap` to npm (`latest`, or `next` for a
   pre-release) with provenance. A version already on npm is skipped, so a failed run can be
   re-run.
5. Merge `main` back into `dev`.
6. Publish a GitHub Release for the tag with its changelog section.

An npm version can't be replaced: fix a broken one with a new patch release and deprecate the
broken one (`npm deprecate spotstrap@0.1.0 "Use 0.1.1"`).

## One-time npm setup

Only the original repository (`kodentuzo/spotstrap`) publishes; CI skips the step in forks.

1. **First release only:** npm can't link a trusted publisher to a package that doesn't exist
   yet, so the first version needs a token:
   - on npmjs.com, create a granular access token that can publish packages (expiry: a few
     days);
   - store it as the secret `NPM_TOKEN` in a GitHub environment named `npm` in
     `kodentuzo/spotstrap`;
   - release as above.
2. On npmjs.com, in the settings of `spotstrap`, link a **trusted publisher**. The fields are
   case-sensitive:
   - provider: GitHub Actions;
   - organization or user: `kodentuzo`, repository: `spotstrap`;
   - workflow filename: `ci.yml`, environment: `npm`;
   - allow `npm publish`.
3. Delete the `NPM_TOKEN` secret and revoke the token. From then on CI publishes through
   GitHub's OIDC token, with no stored secret.
