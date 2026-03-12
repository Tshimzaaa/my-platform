+# Data Academy OS (Local)
+
+A clean, modern, premium-feel learning platform focused on two programs only:
+- Data Analytics
+- Data Science
+
+## Highlights
+
+- Modern dashboard with:
+  - Today's mission checklist (lesson, exercises, Data Lab, quiz, revision)
+  - program progress, weekly target, streak, upcoming module, achievements
+- Visual learning roadmap with completed/current/locked module states
+- Lesson page optimized for reading + coding flow:
+  - lesson explanation, worked examples, exercises, quizzes, common mistakes, revision
+- Data Lab interface:
+  - task instructions, dataset viewer, notebook-style coding area, output area, submission CTA
+- Projects view:
+  - available/completed projects, progress state, and portfolio output expectations
+- Progress persistence via `localStorage`
+- Responsive layout for desktop, tablet, and mobile
+
+## Run locally
+
+```bash
+python3 -m http.server 4173
+```
+
+Open `http://localhost:4173`.
+
+
+## Deploy on GitHub (GitHub Pages)
+
+This repo includes `.github/workflows/deploy-pages.yml` to deploy the static app automatically.
+
+1. Push this repository to GitHub.
+2. In your GitHub repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
+3. Push to `main` (or `master`) or run the workflow manually from **Actions**.
+4. Your site will be published at `https://<your-username>.github.io/<repo-name>/`.
+
+> Note: this is a static app, so no build step is required.
+
+
+## ZIP package
+
+A full packaged archive is included as `data-academy-os.zip` in the repository root.
+- Complete repository archive: `all-files.zip` (includes all project files in this repo)
