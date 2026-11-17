# Dheeraj Soni — Full Stack Developer Portfolio

A lightweight, responsive personal portfolio built with semantic HTML5, modern CSS3, vanilla ES6+ modules, a performance-guarded Three.js hero scene, GSAP ScrollTrigger animations, and a bilingual Gemini AI chatbot (`/api/chat.js`) deployable on Vercel.

---

## 1. Get a Free Gemini API Key

1. Visit **Google AI Studio** at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) and sign in with your Google account.
2. Click **Create API key** and select or create a Google Cloud project.
3. Copy the generated key (starts with `AIza...`). Never commit this key to Git or place it in frontend JavaScript.

---

## 2. Run Locally

### Portfolio voice assistant

- Open **Ask Dheeraj's AI**, select **English** or **हिंदी**, and press the microphone. Allow microphone access when your browser asks. Pause after speaking; the final transcript sends automatically and the reply is read aloud when voice is enabled. Typed messages still use Send.
- Microphone use enables spoken replies. **Voice on / Voice off** controls playback. Provider failures show a specific notice (expired/invalid key, quota, or temporary outage) and switch to typed portfolio answers. Sending a typed question retries the provider; voice controls return after a successful AI reply. Closing the chat, clearing it, or switching tabs stops microphone capture and playback.
- Speech recognition needs a supported browser and HTTPS (or localhost). Browser speech recognition may send audio to the browser vendor's recognition service. If unsupported or denied, text chat remains available. Spoken Hindi requires a Hindi voice supplied by the device/browser.
- Set `GEMINI_API_KEY` and optionally `GEMINI_MODEL` (default `gemini-3.1-flash-lite`) on the server for conversational AI. The Express server loads `.env.local` and `.env`; on Vercel, set these in the project's environment variables and redeploy. Never put API keys in frontend files.
- Without a working provider, the header shows **Portfolio answers** and serves curated Hindi/English answers about skills, education, projects, experience and contact. This is a limited topic-based fallback; arbitrary follow-up questions require the configured AI provider. Keep `api/profile.cjs`, `api/chat.js` and the visible portfolio facts synchronized when editing your profile.
- Verify the assistant with `node --test --test-isolation=none tests/chat.test.cjs tests/voice.test.js`, `npm run lint`, and `npm run build`. Provider tests use mocks; real Gemini calls require your own configured key and quota.

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
   GEMINI_MODEL=gemini-3.1-flash-lite
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
   - Add `GEMINI_MODEL` with value `gemini-3.1-flash-lite`.
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
- **Contact form email delivery**: The form posts to `/api/contact` for validation. Without a Resend key, the browser then submits directly to FormSubmit for **dheerajsoni.dev@gmail.com** and displays FormSubmit’s confirmation page. With Resend configured, delivery is server-side and visitors stay on the portfolio. The notification includes their name, email and message, and Reply-To is set to the visitor's email.
  - The first real submission triggers an activation email from FormSubmit. Check the recipient inbox and spam folder and click the activation link. Delivery cannot be considered ready until activation and a received test email are confirmed.
  - Optionally set `CONTACT_EMAIL` to change the receiving inbox (requires activation again), and `PUBLIC_SITE_URL` to your deployed URL. Default settings need no API key. On Vercel, redeploy the source changes so `api/contact.js` is deployed as a function.
  - Messages are processed by the external FormSubmit service. It retains pending submissions for up to 30 days according to its [FAQ](https://formsubmit.co/help).
  - Validation, a honeypot and an in-memory per-instance rate limit help reduce basic spam. The browser preserves entered text on errors and does not open an email application. A successful response means the relay accepted the submission, not proof of inbox delivery.
  - Run `node --test --test-isolation=none tests/contact.test.cjs` to verify mocked delivery, validation, honeypot behavior, provider failures and rate limiting.

### Alternative contact delivery with Resend

If FormSubmit times out, set `RESEND_API_KEY` in `.env.local` (and Vercel environment variables for deployment). The handler automatically uses Resend when that key is present. It never exposes the key to the browser.

For an initial test, register Resend using the receiving inbox, `dheerajsoni.dev@gmail.com`. The default sender is `Portfolio <onboarding@resend.dev>`; that test sender may send only to the Resend account owner's email. For production, verify your sender domain and set `CONTACT_FROM_EMAIL` to an address on that domain. See [Resend sender requirements](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

Restart the Express server after editing environment variables; redeploy Vercel after setting deployment variables. A Gemini API key does not authorize email delivery.

### FormSubmit direct delivery

Without a Resend key, `/api/contact` validates the request and returns the FormSubmit action. The browser then submits a standard POST form directly to FormSubmit and shows its confirmation page. This avoids the hanging server-side AJAX relay. `FORMSUBMIT_FORM_ID` can hold the random ID from the activation email; otherwise the configured recipient address is used. The form sends name, email, message and Reply-To. Email delivery is not confirmed until the recipient receives the message.
