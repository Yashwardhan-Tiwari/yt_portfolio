# Yashwardhan Tiwari — Developer Portfolio

A seven-page, cyber-minimalist portfolio built with HTML5, CSS3 and vanilla JavaScript. No build step, package manager or framework is required.

## Pages

- `index.html` — home, animated typing intro, terminal-style panel and featured projects
- `about.html` — profile, philosophy and printable starter resume link
- `projects.html` — filterable project cards with case-study modals
- `skills.html` — filterable skills list, 8-bit bitwise explorer and sorting visualizer
- `experience.html` — education and learning timeline
- `blog.html` — interactive reader for starter development notes
- `contact.html` — real-time form validation, email-preparation flow and copy buttons

## Run locally

1. Extract the ZIP archive.
2. Open the extracted portfolio folder (the folder containing `index.html`).
3. Double-click `index.html` to preview it in a browser. Do not open it from inside the ZIP preview.
4. For the most reliable local experience, use VS Code with the Live Server extension, or run a simple local HTTP server from this folder:

   ```bash
   python -m http.server 8000
   ```

   Then open `http://localhost:8000`.

## Publish

### GitHub Pages

1. Create a GitHub repository (for example, `my-portfolio`).
2. Upload the contents of this folder to the repository root (not the ZIP file itself).
3. In GitHub, open **Settings → Pages**.
4. Select the deployment branch and `/ (root)` folder, then save.

The site uses relative paths, so it works as a project site under a repository URL.

### InfinityFree / other shared hosting

Upload the contents of this folder into the host's web root (often `htdocs` or `public_html`). Keep the folder structure unchanged.

## Personalise before publishing

- Replace `assets/images/yashwardhan-headshot.png` with the final portrait you want to use. Keep the filename the same, or update its references in `index.html` and `about.html`.
- Update project details, stack labels and skill notes in `js/data.js`.
- Add GitHub repository/demo URLs to each project's `links` array in `js/data.js` when the projects are publicly available.
- The INNOVEX and earlier portfolio projects are labelled as local coursework because the provided `file:///C:/...` paths are only accessible on your own computer. Publish those projects first, then add their web URLs.
- CampusParcel is labelled as a concept/in-planning project. The site describes the proposed guard intake, parcel photo records, storage tracking and six-digit OTP handover flow; it does not claim to provide production authentication, database storage or SMS delivery.
- Update the starter resume at `assets/resume.html`. Use **Print / Save as PDF** from that page when you want a PDF copy.
- Contact form validation runs in the browser and prepares a `mailto:` link. It does not send or store messages. To receive submissions directly, connect a backend or a form service and update the form handler.
- A mobile number is not included in this public starter version. Add a phone contact only if you deliberately want it visible to anyone on the internet.

## Features

- Responsive desktop navigation and mobile drawer
- Dark/light themes saved in `localStorage`
- Animated hero typing effect
- Scroll reveal via `IntersectionObserver`
- Smooth same-site page transitions
- Hover tilt effect on cards
- Filterable projects and case study modal
- Filterable skill list
- Interactive 8-bit bitwise playground
- Bubble sort / selection sort visualizer
- Interactive developer-note reader drawer
- Real-time contact form validation and simulated email-preparation state
- One-click copy for email and GitHub URL
- Keyboard escape-to-close for modal / reader drawer
- Reduced-motion support

## Tech notes

The site is plain HTML, CSS and JavaScript. Google Fonts are loaded when internet access is available; system font fallbacks are defined. No server-side code, cookies or analytics are included. The theme preference is stored in browser `localStorage`.
