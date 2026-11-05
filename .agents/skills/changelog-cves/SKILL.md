---
name: changelog-cves
description: Check GHSAs linked in changelog or release posts for assigned CVEs missing from the text. Update the posts and open a PR when requested. Use for requests to backfill CVEs, refresh advisory identifiers, or check whether changelog GHSAs now have CVEs.
---

# Changelog CVEs

Find assigned CVEs missing from existing changelog posts. Distinguish a request to check and report from authorization to edit or open a PR.

## Find the advisory references

- Locate the changelog content. In the Vikunja website, it lives in `src/content/changelog/`.
- Search all posts for `GHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}` and `CVE-[0-9]{4}-[0-9]+`. Record each GHSA, its URL, and every file and location mentioning it. Deduplicate network lookups, not occurrences.
- Read each advisory's surrounding heading, bullet, and paragraph to determine whether its own CVE is already included. A different CVE elsewhere in the post does not count. One paragraph can link several distinct advisories, including a combined exploit-chain advisory with no CVE of its own.

## Check current assignments

**Use GitHub's global Advisory Database as the primary source:**

- Page: `https://github.com/advisories/GHSA-xxxx-xxxx-xxxx`
- API: `GET /advisories/GHSA-xxxx-xxxx-xxxx`, for example with `gh api` when available. Read `cve_id` and the identifiers whose type is `CVE`.

Repository advisories at `github.com/OWNER/REPO/security/advisories/GHSA-...` and their repository API responses can still say "No known CVE" after the global database has assigned one. Do not stop at a null repository `cve_id`.

Fetch each candidate's global advisory individually. Use its CVE field, not an arbitrary CVE from the description: advisories often reference other vulnerabilities. If the sources disagree, verify against the published CVE record and check that it references this GHSA.

Use authenticated API access when available and modest concurrency. On rate limits, timeouts, or missing global records, try the official advisory page or a published CVE record. Repository advisories can provide additional evidence. Record unresolved lookups as **unverified**, separately from advisories explicitly reporting **no known CVE**; a failed request is not evidence of no assignment. Do not bypass access controls or retry indefinitely.

For a check-only request, report the missing GHSA-to-CVE mappings grouped by post, then advisories with no known CVE and any unverified lookups. Link to the sources actually fetched. Leave files untouched.

## Update the posts when requested

- Add each verified CVE beside the relevant heading, bold issue title, or advisory link, following that post's existing format. When one bullet covers several advisories, associate each CVE with its specific link.
- Update every occurrence missing that advisory's CVE, including references to an earlier release's issue.
- Remove or replace statements such as "No CVE has been assigned yet" once that issue has an assigned CVE.
- Preserve advisory URLs, researcher credits, release metadata, and vulnerability explanations. Leave issues without a verified CVE unchanged.
- Review the diff against the verified mappings. Check that identifiers are associated with the correct issue, all affected occurrences were updated, and existing URLs were preserved. Run `git diff --check` and the repository's relevant checks.

## Open a PR when requested

Use the available `open-pr` skill. Check the branch against the fetched target before committing so the PR contains only this task. If necessary, create a fresh branch from that target and carry over only the post updates; preserve existing commits and user work.

Install dependencies from the final branch's lockfile before running checks. For Astro, generate content types with `astro sync` if required. Switching branches after installation can leave dependencies out of sync and produce misleading diagnostics.

Use conventional commits, keeping each release's update atomic. Keep the PR description short: which posts gained CVEs and whether an outdated unassigned-CVE statement was removed. Report the PR URL and validation outcome.
