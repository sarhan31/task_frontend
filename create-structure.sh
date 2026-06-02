#!/bin/bash

echo "Creating Task Management System folder structure..."
echo ""

# Create main directories
mkdir -p src/assets/{images,icons,fonts}
mkdir -p src/components/{ui,layout,cards,charts,forms,tasks,users}
mkdir -p src/pages/{auth,admin,user}
mkdir -p src/{layouts,routes,context,hooks,services,utils,data}
mkdir -p public

echo "✓ Folder structure created successfully!"
echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Create .env file from .env.example"
echo "3. Run: npm run dev"
echo ""
