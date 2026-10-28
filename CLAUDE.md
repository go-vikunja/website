# Vikunja website

## Version availability notices

To mark when a feature became available, use `<AvailableFrom>` (`src/components/AvailableFrom.astro`). Don't write the notice by hand.

```mdx
import AvailableFrom from '../../../components/AvailableFrom.astro';

<AvailableFrom version="2.8.0" />
<AvailableFrom version="2.8.0">Routing OpenID Connect requests through a proxy</AvailableFrom>
```

- `version` is the release that ships the feature. For unreleased features, use the next planned version.
- Until a `src/content/changelog/release-<version>.mdx` post exists, the notice says "only available in unstable builds". After that it says "available from <version> onwards".
- The sentence uses "is", so the subject must be singular ("Bot user support", not "Bot users").
- Marketing pages (`src/pages/`) shouldn't promise "ships with the next release". Leave out timing sentences that will go stale.
