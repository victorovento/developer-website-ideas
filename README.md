# Developer Website Ideas

An open-source, community-driven directory of developer portfolios. Browse talented engineers, designers, and creators — and add your own.

> **Repo:** [github.com/victorovento/developer-website-ideas](https://github.com/victorovento/developer-website-ideas)

---

## What is this?

Developer Website Ideas is a curated, searchable gallery of developer portfolio websites. It's:

- **Open source** — the full source code is public and contributions are welcome
- **Community driven** — anyone can add their portfolio via a pull request
- **Simple** — portfolio data lives in a single `WEBSITES.md` file; no database required
- **Fast** — built with Angular + SSR for speed and great SEO

---

## Adding Your Portfolio

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide. The short version:

1. Fork this repo
2. Add your entry to `public/WEBSITES.md`:
   ```
   Website Name | Website URL | Owner | Work Title | Source Code Link (optional)
   ```
3. Open a pull request

---

## WEBSITES.md Format

The data file lives at `public/WEBSITES.md`. Each line represents one portfolio:

```
John Doe | https://johndoe.dev | John Doe | Full-Stack Developer | https://github.com/johndoe/portfolio
Jane Smith | https://janesmith.io | Jane Smith | Frontend Engineer |
```

| Field | Required | Notes |
|---|---|---|
| Website Name | Yes | Display name for the site |
| Website URL | Yes | Must start with `https://` |
| Owner | Yes | Full name or handle |
| Work Title | Yes | Used for filtering (e.g. "Full-Stack Developer") |
| Source Code Link | No | Leave empty if private |

Lines beginning with `#` are treated as comments and ignored.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Angular 21](https://angular.dev) with SSR |
| Styling | SCSS with CSS custom properties |
| Rendering | Angular Universal (Server-Side Rendering) |
| Data | Flat Markdown file (`WEBSITES.md`) |
| Fonts | Inter + JetBrains Mono (Google Fonts) |

---

## Local Development

### Prerequisites

- Node.js 20+
- npm 9+

### Setup

```bash
# Clone the repo
git clone https://github.com/victorovento/developer-website-ideas.git
cd developer-website-ideas

# Install dependencies
npm install

# Start the dev server
npm start
```

Open [http://localhost:4200](http://localhost:4200).

### Production Build (SSR)

```bash
npm run build
node dist/developer-website-ideas/server/server.mjs
```

---

## Deployment

This project is built for SSR. You can deploy to:

- **Node.js server** — run `node dist/developer-website-ideas/server/server.mjs`
- **Docker** — build the app, copy `dist/`, set `NODE_ENV=production`, expose port 4000
- **Vercel / Render / Railway** — set build command to `npm run build` and start command to `node dist/developer-website-ideas/server/server.mjs`

After deploying, update the canonical URL and Open Graph URLs in `src/index.html` with your production domain.

---

## Project Structure

```
developer-website-ideas/
├── public/
│   ├── WEBSITES.md          # Portfolio data — edit this to add entries
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── filter-bar/  # Search & filter UI
│   │   │   └── portfolio-card/  # Individual portfolio card
│   │   ├── pages/
│   │   │   └── home/        # Main directory page
│   │   └── services/
│   │       └── portfolio.service.ts  # Parses WEBSITES.md
│   ├── index.html           # SEO meta tags & fonts
│   └── styles.scss          # Global design tokens
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── README.md
```

---

## Contributing

Contributions beyond adding portfolios are also welcome! Bug fixes, accessibility improvements, performance optimizations, and new features are all appreciated.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before submitting.

---

## License

[MIT](LICENSE)
