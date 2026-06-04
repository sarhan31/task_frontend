const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const buttonImport = `import Button from "@components/ui/Button";`;

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (dirPath.endsWith('.jsx')) {
            callback(dirPath);
        }
    });
}

const filesToSkip = [
    'Button.jsx', 'Input.jsx', 'AdvancedInput.jsx', 'Modal.jsx', 
    'Drawer.jsx', 'Toaster.jsx', 'Pagination.jsx', 'Dropdown.jsx', 'FileUpload.jsx'
];

walkDir(srcDir, (filePath) => {
    const filename = path.basename(filePath);
    
    // Skip low-level primitive components that should keep raw <button> tags or are already using <Button> internally
    if (filesToSkip.includes(filename)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file contains <button
    if (!content.includes('<button') && !content.includes('</button>')) {
        return;
    }

    // Check if import Button already exists
    if (!content.includes('import Button from')) {
        // Find last import
        const lines = content.split('\n');
        let lastImportIdx = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
                lastImportIdx = i;
            }
        }
        
        if (lastImportIdx !== -1) {
            lines.splice(lastImportIdx + 1, 0, buttonImport);
            content = lines.join('\n');
        } else {
            content = buttonImport + '\n' + content;
        }
    }

    // Replace all <button with <Button variant="custom" size="none"
    // EXCEPT those that are already <Button 
    // Wait, regex to match <button (with space or newline) but not <Button
    content = content.replace(/<button([\s>])/g, '<Button variant="custom" size="none"$1');
    content = content.replace(/<\/button>/g, '</Button>');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filename}`);
});

console.log("Done.");
