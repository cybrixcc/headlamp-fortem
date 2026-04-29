# Fortem IDP — Headlamp Plugin

A [Headlamp](https://headlamp.dev) plugin that brings [Fortem](https://fortem.dev) directly into your Kubernetes dashboard. View all your Fortem-managed environments and clusters, see their live status and cost data, and jump straight into the Fortem UI — without leaving Headlamp.

---

## What it does

The plugin adds a **Fortem** section to the Headlamp sidebar with two views:

- **Environments** — lists every Fortem environment with its name, namespace, cluster, team, status (color-coded badge), cost per day, and last-updated timestamp. Each row has an **Open in Fortem** button that links directly to that environment in the Fortem web app.
- **Clusters** — lists every cluster registered with Fortem, showing provider, region, phase, Kubernetes version, node count, and last heartbeat time.

---

## Prerequisites

| Requirement | Minimum version |
|---|---|
| [Headlamp](https://headlamp.dev) | 0.20.0 |
| [Fortem](https://fortem.dev) | any self-hosted installation |

---

## Installation

```bash
headlamp-plugin install @cybrixcc/headlamp-fortem
```

Or place the built `dist/main.js` and `package.json` into your Headlamp plugins directory:

- **macOS / Linux:** `$HOME/.config/Headlamp/plugins/fortem-idp/`
- **Windows:** `%APPDATA%\Headlamp\Config\plugins\fortem-idp\`

---

## Configuration

After installing the plugin, open **Settings → Plugins → Fortem IDP** in Headlamp and fill in:

| Field | Example | Description |
|---|---|---|
| Fortem URL | `https://app.fortem.dev` | Base URL of your Fortem installation |
| API Token | `ft_live_xxx…` | Bearer token from Fortem → Account → API Keys |

Settings are persisted via Headlamp's built-in plugin configuration store (not localStorage).

---

## Screenshots

<!-- Add screenshots here once the plugin is deployed -->

*Environments list view — coming soon*

*Clusters list view — coming soon*

---

## Development

```bash
git clone https://github.com/cybrixcc/headlamp-fortem.git
cd headlamp-fortem
npm install
npm run build        # outputs dist/main.js
npm start            # watch mode for local Headlamp dev
```

TypeScript strict mode is enabled. Run `npm run tsc` to type-check without building.

---

## Links

- [fortem.dev](https://fortem.dev)
- [Fortem documentation](https://fortem.dev/docs)
- [Headlamp plugin development guide](https://headlamp.dev/docs/latest/development/plugins/)
- [Report an issue](https://github.com/cybrixcc/headlamp-fortem/issues)

---

## License

Apache 2.0 — see [LICENSE](LICENSE) for details.
