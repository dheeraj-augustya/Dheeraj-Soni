# Dheeraj Soni — Full Stack Developer Portfolio

A lightweight, responsive personal portfolio built with semantic HTML5, modern CSS3, vanilla ES6+ modules, a performance-guarded Three.js hero scene, GSAP ScrollTrigger animations, and a bilingual Gemini AI chatbot (`/api/chat.js`) deployable on Vercel.

---

## 1. Get a Free Gemini API Key

1. Visit **Google AI Studio** at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) and sign in with your Google account.
2. Click **Create API key** and select or create a Google Cloud project.
3. Copy the generated key (starts with `AIza...`). Never commit this key to Git or place it in frontend JavaScript.

---

## 2. Run Locally

### Option A: Using the Vercel CLI (Recommended for testing Vercel serverless `/api/chat.js`)

1. Install the Vercel CLI globally if you haven't already:
   ```bash
   npm install -g vercel
   ```
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
4. Install dependencies and start the local Vercel dev server:
   ```bash
   npm install
   vercel dev
   ```
5. Open the local URL shown in your terminal (for example `http://localhost:3000`).

### Option B: Using the included Express + Vite dev server

1. Set `GEMINI_API_KEY` in `.env` or `.env.local` (or in AI Studio **Settings > Secrets**).
2. Run:
   ```bash
   npm install
   npm run dev
   ```
3. Visit `http://localhost:3000`.

---

## 3. Deploy to Vercel (Step-by-Step)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
   *(Verify `.env` and `.env.local` are NOT tracked, as configured in `.gitignore`.)*

2. **Import into Vercel**:
   - Go to [https://vercel.com/new](https://vercel.com/new).
   - Click **Add New... > Project** and import your GitHub repository.
   - Keep the detected build command (`vite build`) and output directory (`dist`).

3. **Configure Environment Variables**:
   - In Vercel, open **Project Settings > Environment Variables**.
   - Add `GEMINI_API_KEY` with your Google AI Studio API key.
   - Add `GEMINI_MODEL` with value `gemini-2.5-flash`.
   - Select **Production**, **Preview**, and **Development** environments and click **Save**.

4. **Redeploy**:
   - Go to **Deployments**, click the menu (`...`) on the latest deployment, and select **Redeploy** so the new environment variables take effect.

5. **Test `/api/chat`**:
   - Open your deployed Vercel URL, click the floating **Ask Dheeraj's AI** button in the bottom-right corner, and test a question in English, Hindi, or Hinglish.
   - You can also verify directly with `curl`:
     ```bash
     curl -X POST https://your-project.vercel.app/api/chat \
       -H "Content-Type: application/json" \
       -d '{"messages":[{"role":"user","text":"What are Dheeraj'\''s skills?"}]}'
     ```

---

## 4. Customizing Your Content & Assets

- **Swap Profile Photo**: Place your photo at `/public/assets/profile.jpg` (or `/assets/profile.jpg`) and update the `<img src="...">` attribute inside `#about` in `/index.html`.
- **Replace Resume PDF**: Replace `/public/assets/Dheeraj_Soni_Resume.pdf` with your designed PDF keeping the exact filename `Dheeraj_Soni_Resume.pdf`.
- **Update Favicon & Social Preview (OG Image)**: Replace `/public/assets/favicon.svg` and `/public/assets/og-image.svg` (or add a `1200x630` PNG and update `<meta property="og:image">` and `<meta name="twitter:image">` in `/index.html`). Also update `<link rel="canonical">`, `public/robots.txt`, and `public/sitemap.xml` with your final Vercel domain.
- **Add Projects, Skills, Experience, or Sections**: Open `/js/main.js` and edit the `SKILLS`, `PROJECTS`, `ACADEMIC_PROJECTS`, `EXPERIENCE`, `EDUCATION`, and `CERTIFICATIONS` arrays at the top of the file. Remember to also mirror any new facts inside `SYSTEM_PROMPT` in `/api/chat.js`.
- **Connect the Contact Form Service (Formspree / Web3Forms)**:
  1. Create a free form endpoint at [https://formspree.io](https://formspree.io) or [https://web3forms.com](https://web3forms.com).
  2. Open `initContactForm()` in `/js/main.js`, uncomment the `fetch(...)` snippet inside the submit handler, paste your endpoint URL, and remove the `window.location.href = mailto:...` fallback.
