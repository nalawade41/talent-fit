# Netlify Deployment Guide

## Quick Setup

1. **Connect your repository to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select this repository

2. **Configure build settings:**
   The `netlify.toml` file in the root directory will automatically configure:
   - Build command: `npm install && npm run build:web`
   - Publish directory: `apps/web/dist`
   - Node.js version: 18

3. **Set environment variables in Netlify dashboard:**
   ```
   VITE_API_URL=https://your-production-api-url.com
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_APP_ENV=prod
   ```

4. **Deploy:**
   - Click "Deploy site"
   - Your site will be available at a Netlify-generated URL
   - You can customize the domain in site settings

## Environment Variables

Make sure to set these in your Netlify site dashboard under **Site settings > Environment variables**:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Your production API endpoint | `https://api.yourapp.com` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | `590503648623-xxx.apps.googleusercontent.com` |
| `VITE_APP_ENV` | Environment name | `prod` |

## Custom Domain (Optional)

1. Go to **Site settings > Domain management**
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Build Process

The deployment follows these steps:
1. Netlify detects the `netlify.toml` configuration
2. Installs root dependencies (`npm install`)
3. Runs the build script (`npm run build:web`)
4. Publishes the `apps/web/dist` directory
5. Applies redirect rules for SPA routing

## Features Configured

✅ **SPA Routing** - All routes redirect to index.html  
✅ **Security Headers** - XSS protection, frame options, etc.  
✅ **Caching Strategy** - Static assets cached for 1 year  
✅ **Performance Optimization** - CSS/JS minification and bundling  
✅ **Node.js 18** - Specified in both `.nvmrc` and `netlify.toml`

## Troubleshooting

**Build fails?**
- Check the build logs in Netlify dashboard
- Ensure all environment variables are set
- Verify Node.js version compatibility

**404 on page refresh?**
- The `_redirects` file handles SPA routing
- Check that the file exists in `apps/web/public/_redirects`

**API calls failing?**
- Verify `VITE_API_URL` environment variable
- Check CORS settings on your API server
- Ensure API endpoints are accessible from the browser

## Manual Deployment

You can also build locally and deploy manually:

```bash
# Build the application
npm run build:web

# Deploy the dist folder using Netlify CLI
npx netlify deploy --prod --dir=apps/web/dist
```
