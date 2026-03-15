# Contributing to DevFolio Directory

Thank you for your interest in adding your portfolio to this directory! This guide walks you through the process.

## How to Add Your Portfolio

Adding your portfolio is done entirely through a pull request — no code changes required, just a single line added to `WEBSITES.md`.

### Step-by-step

1. **Fork** this repository.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/devfolio-directory.git
   cd devfolio-directory
   ```
3. **Open** `WEBSITES.md` in any text editor.
4. **Add your entry** at the end of the file using this format:
   ```
   Website Name | Website URL | Owner | Work Title | Source Code Link (optional)
   ```
   Example:
   ```
   Jane Smith | https://janesmith.dev | Jane Smith | Frontend Engineer | https://github.com/janesmith/portfolio
   ```
5. **Commit** your change:
   ```bash
   git add WEBSITES.md
   git commit -m "feat: add Jane Smith portfolio"
   git push origin main
   ```
6. **Open a Pull Request** against the `main` branch of this repository.

That's it! A maintainer will review your PR and merge it.

---

## Format Reference

| Field | Required | Description |
|---|---|---|
| Website Name | Yes | The name or title of your portfolio site |
| Website URL | Yes | Full URL including `https://` |
| Owner | Yes | Your full name or handle |
| Work Title | Yes | Your role (e.g. "Full-Stack Developer", "UI/UX Designer") |
| Source Code Link | No | Link to the portfolio's source code repository |

### Rules

- One entry per person.
- The URL must be publicly accessible.
- No placeholder, parked, or broken links.
- The `Work Title` field must be a genuine professional role.
- Source Code Link must point to a real repository.
- No promotional or commercial content.

---

## Pull Request Checklist

Before submitting, please verify:

- [ ] Your entry is at the **end** of the list in `WEBSITES.md`
- [ ] All fields are separated by ` | ` (space-pipe-space)
- [ ] The URL starts with `https://`
- [ ] The website is live and accessible
- [ ] Your Work Title accurately reflects your role
- [ ] If including a source code link, it is a valid public repository URL

---

## Code of Conduct

By participating in this project you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Questions?

Open an [issue](https://github.com/YOUR_USERNAME/devfolio-directory/issues) and we'll be happy to help.
