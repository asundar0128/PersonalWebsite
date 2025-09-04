# Serverless Contact (Vercel) with reCAPTCHA + Formspree

## What this does
- Validates Google reCAPTCHA v2 (server-side) to block bots
- Forwards the message to Formspree → delivered to your email
- Keeps your email off the page (no scraping)

## 1) Create a Formspree endpoint
- Go to https://formspree.io → create a form → copy your endpoint URL like `https://formspree.io/f/xxxxxx`

## 2) Get reCAPTCHA keys
- Go to https://www.google.com/recaptcha/admin/create
- Choose **reCAPTCHA v2 (“I’m not a robot” Checkbox)** and add your domain (or localhost)
- Copy **Site key** and **Secret key**

## 3) Deploy on Vercel
- New Project → Deploy Other → drag this folder
- In **Project Settings → Environment Variables**, add:
  - `RECAPTCHA_SECRET` = your secret key
  - `FORMSPREE_ENDPOINT` = your form endpoint URL

- Replace `%RECAPTCHA_SITE_KEY%` in `index.html` with your site key.
  (In Vercel you can do this once locally before upload, or later via a CI step.)

## 4) Test
- Open your site, fill the form, complete reCAPTCHA, click Send
- You should see a success message; check your Formspree inbox/email

---

### Netlify Option (no server code needed)
- Use Netlify Forms `<form netlify>` and add reCAPTCHA widget
- Or use Netlify Functions with the same `siteverify` call as in `/api/contact.js`

