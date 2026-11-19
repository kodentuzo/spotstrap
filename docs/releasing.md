# Releasing

Spotstrap follows [SemVer](https://semver.org/spec/v2.0.0.html). Its public API is the export
paths, class names, token names, `@kodentuzo/spotstrap/js`'s `init()` and the recipes' signatures
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
7. The push to `main` also deploys spotstrap.dev (`.github/workflows/pages.yml`); check that the
   site shows the new version in its footer.

An npm version can't be replaced: fix a broken one with a new patch release and deprecate the
broken one (`npm deprecate @kodentuzo/spotstrap@0.1.0 "Use 0.1.1"`).

## One-time npm setup

Only the original repository (`kodentuzo/spotstrap`) publishes; CI skips the step in forks.

1. **First release only:** npm can't link a trusted publisher to a package that doesn't exist
   yet, so the first version needs a token:
   - on npmjs.com, the free organization `kodentuzo` owns the `@kodentuzo` scope;
   - create a granular access token that can publish packages, with read and write on the
     `kodentuzo` organization and 2FA bypass (expiry: a few days);
   - store it as the secret `NPM_TOKEN` in a GitHub environment named `npm` in
     `kodentuzo/spotstrap`;
   - release as above.
2. On npmjs.com, in the settings of `@kodentuzo/spotstrap`, link a **trusted publisher**. The fields are
   case-sensitive:
   - provider: GitHub Actions;
   - organization or user: `kodentuzo`, repository: `spotstrap`;
   - workflow filename: `ci.yml`, environment: `npm`;
   - allow `npm publish`.
3. Delete the `NPM_TOKEN` secret and revoke the token. From then on CI publishes through
   GitHub's OIDC token, with no stored secret.

## One-time website setup

spotstrap.dev is the `site/` package, deployed to GitHub Pages from `main`
([ADR 0006](decisions/0006-website.md)).

1. In `kodentuzo/spotstrap` → Settings → Pages: set the source to **GitHub Actions** and the
   custom domain to `spotstrap.dev`; turn on **Enforce HTTPS** once the certificate is issued.
2. In the kodentuzo organization → Settings → Pages, verify `spotstrap.dev` (a TXT record), so
   no other repository can claim it.
3. In Cloudflare's DNS for spotstrap.dev, **DNS only** (not proxied):
   - `A` `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
     `2606:50c0:8003::153`
   - `CNAME` `www` → `kodentuzo.github.io`
4. Run the Pages workflow from `main` (it also runs on every release).
