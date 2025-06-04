// Script to fix common TypeScript errors in route files
import fs from 'fs';
import path from 'path';

const routesDir = 'src/routes';
const files = [
  'blog.ts',
  'contact.ts',
  'newsletter.ts',
  'projects.ts',
  'services.ts',
  'team.ts',
  'testimonials.ts'
];

function fixFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix imports to include Request, Response types
  if (!content.includes('Request, Response')) {
    content = content.replace(
      "import express from 'express';",
      "import express, { Request, Response } from 'express';"
    );
  }
  
  // Fix async route handlers to include types
  content = content.replace(
    /async \(req, res\) =>/g,
    'async (req: Request, res: Response) =>'
  );
  
  // Fix parseInt(id) to just id for string IDs
  content = content.replace(
    /parseInt\((\w+)\)/g,
    '$1'
  );
  
  // Fix error handling
  content = content.replace(
    /error\.code/g,
    '(error as any).code'
  );
  
  // Fix unused req parameters
  content = content.replace(
    /async \(req: Request, res: Response\) => {(\s*try {\s*const)/g,
    'async (_req: Request, res: Response) => {$1'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${filePath}`);
}

// Fix each file
files.forEach(file => {
  const filePath = path.join(routesDir, file);
  if (fs.existsSync(filePath)) {
    fixFile(filePath);
  }
});

console.log('TypeScript fixes applied!');
