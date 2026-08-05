# Deployment Guide (Vercel)

This project is fully optimized for zero-config deployment on Vercel. Follow these steps to push your project live.

## 1. Preparing the Codebase
Before deploying, ensure you have run a clean build locally to catch any TypeScript errors.
```bash
npm run build
```
*(If the build succeeds, you are ready to deploy.)*

## 2. GitHub Integration
1. Push your code to a private GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your GitHub repository.

## 3. Configure Vercel Settings
Vercel will automatically detect that this is a Next.js project. Leave the Build and Output Settings as default.

**Crucial Step:** Open the **Environment Variables** tab before clicking deploy.
You must add the following variables exactly as they appear in your `.env.local` (See `ENV_VARS.md` for details):
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`

*Note on Private Keys:* When pasting the `FIREBASE_PRIVATE_KEY` into Vercel, simply copy the exact string from your JSON file (it should contain `\n` characters). Vercel handles the parsing securely.

## 4. Deploy
Click **Deploy**. Vercel will build your project, optimize your images, and spin up the serverless functions for your API routes.

## 5. Post-Deployment Checks
Once the deployment finishes:
1. Visit the production URL provided by Vercel.
2. Go to `/admin/login` and attempt to log in using the default admin credentials.
3. Test creating a Manual Booking.
4. Check that images are loading correctly (Next.js Image Optimization is enabled for Firebase Storage in `next.config.mjs`).

## 6. Custom Domain (Optional)
1. In Vercel, go to **Settings > Domains**.
2. Enter your custom domain (e.g., `passnavratri.com`).
3. Follow the Vercel instructions to add the required `A` or `CNAME` records to your domain's DNS settings (e.g., in GoDaddy, Namecheap, or Cloudflare).
