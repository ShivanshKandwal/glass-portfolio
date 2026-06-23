# 💫 Shivansh Kandwal — Interactive AI & Data Science Portfolio

A premium, highly interactive Glassmorphism developer portfolio showcasing end-to-end Machine Learning pipelines, Big Data cluster computing configurations, and full-stack Generative AI applications. 

Designed with modern typography, smooth color-shifting gradients, slow-drifting constellation grids, physics-based warp effects, and interactive UI showcases.

---

## 🚀 Key Features

* **🖥️ Interactive CLI Terminal Console**: A functional, keyboard-accessible command-line utility. Type `help` to list commands or execute `skills`, `papers`, `hackathons`, `experience`, `academics`, and `clear`. Includes suggestion chips, Tab-autocomplete, and keyboard navigation (ArrowUp, ArrowDown, Enter).
* **🧩 2-Column Spacious Bento Grid**: Showcases four core priority engineering projects with spacious side-by-side cards on desktop:
  1. **Kairo (Generative AI / Host)**: Electron wrapper hosting ComfyUI local server nodes, exposing FLUX.1 Kontext 12B transformer models across intranet endpoints.
  2. **Sus-10-Able (Computer Vision / Godot 4)**: Gamified SIH sustainability portal incorporating Godot 2D platformer quests and edge vision scanners (Ollama + Gemma-3-4B).
  3. **VerbIQ Coaching Bot (Speech Emotion Recognition)**: Low-latency SER training bot integrated with Gemini Live API, extracting 125-dimensional acoustic feature vectors (MFCCs, Pause Ratio).
  4. **ShopEasy (NLP & Analytics / Power BI)**: Consumer intelligence dashboard tracking conversion funnel drop-offs and sentiment split scorecards powered by a custom RoBERTa classifier.
* **🔄 Interactive Switcher Chips**: Clickable tabs inside each Bento card (*Welcome, Portal Dashboard, Generator, Journey Funnel, Analytics*) to instantly swap screenshots and explore app states.
* **🖼️ Product Gallery Carousel**: A sleek, horizontal scrolling carousel displaying high-resolution snaps of dashboards, pipeline flowcharts, and setup configurations, keeping the landing page clean and compact.
* **🔦 Lightroom Lightbox viewer**: Clicking any gallery card launches a fullscreen Lightroom modal featuring keyboard controls (`←`/`→`/`Esc`) and a technical sidebar explaining exactly **"How it fits"** inside production pipelines.
* **🌌 Cosmic Blueprint Theme**: Slow-drifting vector meshes, coordinates grids, diagonal meteor streak animations, and a cursor-spotlight follow glow that shifts colors dynamically based on active viewport sections.
* **🔮 Warp Mode**: Click-and-hold anywhere on the screen to morph the background into deep-space purple with high-saturation neon blobs and colorful shooting stars.

---

## 📂 Project Structure

```
glass-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD deployment pipeline
├── public/                     # Static assets (favicons, etc.)
├── src/
│   ├── assets/                 # Image assets (screenshots, diagrams, etc.)
│   ├── components/             # Reusable UI components
│   │   ├── DragPhoto.tsx       # Physics-based draggable photos component
│   │   ├── GlassCard.tsx       # Glassmorphism container wrapper
│   │   ├── Magnetic.tsx        # Framer Motion physics-based magnetic button wrapper
│   │   └── ProjectRow.tsx      # Sidebar/secondary projects list row
│   ├── App.tsx                 # Main application containing all portfolio state and UI
│   ├── index.css               # Tailwind CSS base styles and cosmic animations
│   └── main.tsx                # React root entry point
├── eslint.config.js            # Linter configuration
├── index.html                  # HTML template
├── package.json                # Project dependencies and script runner configurations
├── tsconfig.json               # TypeScript base compiler options
├── vite.config.ts              # Vite bundle configuration
└── README.md                   # This project manual
```

---

## 🛠️ Technology Stack

* **Core Framework**: React 19 + TypeScript 5
* **Build System**: Vite 8 (extremely fast hot-module reloading and compiling)
* **Styling Engine**: Tailwind CSS v4 (fully customized fluid design values)
* **Animation Library**: Framer Motion (smooth transition springs, layout shifts, physics warp)
* **Gestures Engine**: `@use-gesture/react` (for fluid physics-based drag interactions)
* **Iconography**: Lucide React
* **Hosting Pipeline**: GitHub Pages + GitHub Actions CI/CD

---

## 💻 Local Setup & Development

### Prerequisites
Make sure you have Node.js (v18+) and npm installed locally.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ShivanshKandwal/glass-portfolio.git
   cd glass-portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Verify production compilation**:
   ```bash
   npm run build
   ```

---

## 📦 Automated Deployment (GitHub Actions)

This project is pre-configured with a continuous integration pipeline under `.github/workflows/deploy.yml` that builds and deploys to **GitHub Pages** automatically on every push to the `main` branch.

### Push to GitHub:
If you haven't created the repository on your GitHub account yet, go to [github.com/new](https://github.com/new), create a blank repository named **`glass-portfolio`**, and run:
```bash
git remote add origin https://github.com/ShivanshKandwal/glass-portfolio.git
git branch -M main
git push -u origin main
```

*(Be sure to go to **Settings** -> **Pages** on your repository page and change the deployment **Source** to **`GitHub Actions`**).*
