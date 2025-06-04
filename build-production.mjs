#!/usr/bin/env node

/**
 * Production build optimization script for Al Fatah Enterprise
 * This script prepares the application for production deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function execCommand(command, description) {
  log(`\n${colors.blue}📦 ${description}...${colors.reset}`);
  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    log(`${colors.green}✅ ${description} completed successfully${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ ${description} failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    log(`${colors.green}✅ ${description} exists${colors.reset}`);
    return true;
  } else {
    log(`${colors.yellow}⚠️  ${description} not found at ${filePath}${colors.reset}`);
    return false;
  }
}

function createProductionEnv() {
  const envProductionPath = path.join(__dirname, '.env.production');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  if (!fs.existsSync(envProductionPath) && fs.existsSync(envExamplePath)) {
    log(`${colors.yellow}📝 Creating production environment file...${colors.reset}`);
    
    let envContent = fs.readFileSync(envExamplePath, 'utf8');
    
    // Update for production settings
    envContent = envContent.replace(/VITE_API_BASE_URL=".*"/, 'VITE_API_BASE_URL="https://api.alfatahenterprise.com/api/v1"');
    envContent = envContent.replace(/VITE_ENABLE_ANALYTICS=false/, 'VITE_ENABLE_ANALYTICS=true');
    envContent = envContent.replace(/VITE_ENABLE_ERROR_REPORTING=false/, 'VITE_ENABLE_ERROR_REPORTING=true');
    envContent = envContent.replace(/VITE_LOG_LEVEL="debug"/, 'VITE_LOG_LEVEL="error"');
    
    fs.writeFileSync(envProductionPath, envContent);
    log(`${colors.green}✅ Production environment file created${colors.reset}`);
    log(`${colors.yellow}⚠️  Please review and update .env.production with your actual production values${colors.reset}`);
  }
}

function generateSitemap() {
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://alfatahenterprise.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://alfatahenterprise.com/#services</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://alfatahenterprise.com/#projects</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://alfatahenterprise.com/#about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://alfatahenterprise.com/#contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
  log(`${colors.green}✅ Sitemap generated${colors.reset}`);
}

function generateRobotsTxt() {
  const robotsContent = `User-agent: *
Allow: /

Sitemap: https://alfatahenterprise.com/sitemap.xml

# Disallow admin areas if they exist
Disallow: /admin/
Disallow: /dashboard/
Disallow: /auth/`;

  const publicDir = path.join(__dirname, 'public');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent);
  log(`${colors.green}✅ Robots.txt generated${colors.reset}`);
}

function main() {
  log(`${colors.bright}${colors.cyan}🚀 Al Fatah Enterprise - Production Build Process${colors.reset}`);
  log(`${colors.cyan}=================================================${colors.reset}\n`);

  // Pre-build checks
  log(`${colors.bright}📋 Pre-build Checks${colors.reset}`);
  checkFile('package.json', 'Package.json');
  checkFile('tsconfig.json', 'TypeScript config');
  checkFile('vite.config.ts', 'Vite config');
  checkFile('tailwind.config.js', 'Tailwind config');

  // Environment setup
  log(`\n${colors.bright}🔧 Environment Setup${colors.reset}`);
  createProductionEnv();

  // Generate SEO files
  log(`\n${colors.bright}🔍 SEO Optimization${colors.reset}`);
  generateSitemap();
  generateRobotsTxt();

  // Dependencies check and install
  log(`\n${colors.bright}📦 Dependencies${colors.reset}`);
  execCommand('npm ci', 'Installing dependencies');

  // Type checking
  log(`\n${colors.bright}🔍 Type Checking${colors.reset}`);
  execCommand('npm run lint', 'Running ESLint');

  // Build process
  log(`\n${colors.bright}🏗️  Building Application${colors.reset}`);
  execCommand('npm run build', 'Building for production');

  // Post-build analysis
  log(`\n${colors.bright}📊 Build Analysis${colors.reset}`);
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    execCommand('ls -la dist/', 'Listing build output');
    
    // Check build size
    try {
      const indexHtmlPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexHtmlPath)) {
        const stats = fs.statSync(indexHtmlPath);
        log(`${colors.green}✅ Build completed - index.html size: ${(stats.size / 1024).toFixed(2)} KB${colors.reset}`);
      }
    } catch (error) {
      log(`${colors.yellow}⚠️  Could not analyze build size: ${error.message}${colors.reset}`);
    }
  }

  // Success message
  log(`\n${colors.bright}${colors.green}🎉 Production Build Complete!${colors.reset}`);
  log(`${colors.green}✨ Your Al Fatah Enterprise application is ready for deployment${colors.reset}`);
  
  log(`\n${colors.bright}📝 Next Steps:${colors.reset}`);
  log(`${colors.cyan}1. Review .env.production and update with your production values${colors.reset}`);
  log(`${colors.cyan}2. Test the build locally: npm run preview${colors.reset}`);
  log(`${colors.cyan}3. Deploy the 'dist' folder to your web server${colors.reset}`);
  log(`${colors.cyan}4. Configure your web server for SPA routing${colors.reset}`);
  log(`${colors.cyan}5. Set up SSL certificate for HTTPS${colors.reset}`);
}

// Run the build process
main();
