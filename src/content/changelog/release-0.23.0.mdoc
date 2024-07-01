---
title: "What's new in Vikunja 0.23.0"
date: 2024-02-10T14:26:30+01:00
draft: false
---

<div class="bg-primary p-4 text-white rounded">
If Vikunja is useful to you, please consider <a href="https://www.buymeacoffee.com/kolaente" target="_blank" class="!text-white !underline">buying me a coffee</a>, 
<a href="https://github.com/sponsors/kolaente" target="_blank" class="!text-white !underline">sponsoring me on GitHub</a> or <a href="https://vikunja.cloud/stickers" class="!text-white !underline">buying a sticker pack</a>.<br/>
I'm also offering <a href="https://vikunja.cloud/?utm_source=vikunja.io&utm_medium=blog&utm_campaign=release_0.23.0" class="!text-white !underline">a hosted version of Vikunja</a> if you want a hassle-free solution for yourself or your team.
</div>

I'm happy to announce Vikunja 0.23.0!

This release contains 63 changes, with one substantial change and a few bug fixes.

## New to Vikunja?

Vikunja is the open-source, self-hostable to-do app.
It lets you organize all kinds of things, from your shopping list to a multi-month project with multiple team members.
Different ways to view, filter and share your tasks make this a breeze.

Check out [the features page](https://vikunja.io/features) to learn more about all of its features.

## API, Frontend and Desktop are now merged in one repo

Previously, the API and frontend parts of Vikunja were located in separate repositories.
This made sense from an architectural point of view, but also meant that you had to deploy both parts individually.

With this release, the two repositories (and the desktop package as well) are merged into one.
This enables us to create a single binary release artifact, simplifying the deployment and hosting of Vikunja a lot.

In a nutshell, the API now contains the frontend files as well.

### How to upgrade

To upgrade, you need to remove the frontend deployment and update the API binary.
Let's dive into what that means exactly.

#### Manual deployment

If you've previously deployed the API by downloading a binary release, follow these steps to upgrade to the new version:

1. Replace the API binary with the new `vikunja` binary.
2. Remove the web server configuration used to host the frontend files.
3. Remove the frontend files from your host.
4. Update your reverse proxy config (if any) to send all traffic to the vikunja service (previously API).
5. Set the new public URL config (see below).

Check out the [docs](https://vikunja.io/docs/installing/#install-from-binary) for more information.

See below for configuration values you might need to adjust.

#### Using docker

If you've previously deployed Vikunja via docker, follow these steps to upgrade to the new version:

1. Replace the `vikunja/api` docker image with `vikunja/vikunja`.
2. Remove the frontend docker container, migrating any config from it (see below).
3. Update your reverse proxy config (if any) to send all traffic to the new `vikunja/vikunja` container instead of splitting it between frontend and API.
4. If you previously had a `proxy` nginx container in your setup, you can remove that as well.
5. Set the new public URL config (see below).

Check out the [docs](https://vikunja.io/docs/installing/#docker) or [docker examples](https://vikunja.io/docs/full-docker-example/) for more information.

See below for configuration values you might need to adjust.

### Configuration changes

Some configuration options for the API and frontend have changed with this release:

* All configuration is now done via the config file or environment variables. No split between API and frontend options.
* The `staticpath` option has been removed, since the frontend is now bundled with the API.
* Configuration for Sentry has been changed. [Check out the config docs](https://vikunja.io/docs/config-options/#sentry) for more information.
* A new option [`publicurl`](https://vikunja.io/docs/config-options/#publicurl) has been introduced. This option replaces the old `frontendurl` option and is also the default API URL for the frontend.
* CORS is now disabled by default. If you relied on it previously, you need to [enable it again](https://vikunja.io/docs/config-options/#cors). This includes if you want to use your Vikunja instance with the desktop client.
* Infinite nesting of tasks is now always enabled, the old frontend config option was removed.
* The frontend options to allow icon changes or set a custom logo have been moved to the general config. [Check out the docs](https://vikunja.io/docs/config-options/#allowiconchanges) if you were using them before.

## Closing

If you have any questions about this release, please reach out either [in the community forum](https://community.vikunja.io), [Twitter / X](https://twitter.com/vikunja.io), [Mastodon](https://social.linux.pizza/@vikunja) or [via email](mailto:hello@vikunja.io).

