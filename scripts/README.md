# Scripts

## publish-release

Cross-posts a release blog post to Mastodon, Bluesky, GitHub Releases, Discourse, Matrix, LinkedIn, and Listmonk.

### Usage

```
node scripts/publish-release.js <version> [--dry-run]
```

Example:

```
node scripts/publish-release.js 2.2.0
node scripts/publish-release.js 2.2.0 --dry-run
```

The script:

1. Finds the blog post at `src/content/changelog/release-<version>.mdx`
2. Generates short (tweet-style) and LinkedIn content variants using `claude -p`
3. Opens `$EDITOR` to review and edit the generated content
4. Posts to each platform with a `[Y/n]` confirmation prompt
5. Prints a summary of all posted links

`--dry-run` skips all API calls and prints what would be posted.

### Prerequisites

- Node.js 20+
- [Claude CLI](https://docs.anthropic.com/en/docs/claude-cli) (`claude` must be on PATH)
- [GitHub CLI](https://cli.github.com/) (`gh`) authenticated for GitHub Releases
### API setup

Create a `.env` file in the project root (already gitignored) with the credentials for each platform. Platforms with missing credentials are skipped automatically.

```
# Mastodon (social.linux.pizza)
# Create an application at: https://social.linux.pizza/settings/applications
# Required scopes: write:statuses
MASTODON_TOKEN=

# Bluesky
# Create an app password at: https://bsky.app/settings/app-passwords
BLUESKY_HANDLE=
BLUESKY_APP_PASSWORD=

# Discourse (community.vikunja.io)
# Create an API key at: https://community.vikunja.io/admin/api/keys
# Scope: topics (create)
DISCOURSE_API_KEY=
DISCOURSE_USERNAME=

# Matrix (#vikunja:matrix.org)
# Get an access token by logging in via the client-server API or from Element's settings
MATRIX_ACCESS_TOKEN=
MATRIX_HOMESERVER=https://matrix.org
MATRIX_ROOM_ID=

# Listmonk
# Uses basic auth — the same credentials you log in with
LISTMONK_URL=
LISTMONK_API_USER=
LISTMONK_API_PASSWORD=
LISTMONK_LIST_ID=
```

GitHub Releases uses the `gh` CLI's existing authentication — no extra credentials needed. Run `gh auth status` to verify.

LinkedIn has no API integration — the script copies the post text to clipboard and opens the browser.
