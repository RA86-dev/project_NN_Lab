# AGENTS.md
Project NN Lab is a full-purpose scratch-like (Blockly based) neural network experimentation engine. Its supposed to be simple, easy to use, and clearly interactive and should allow the user to experiment. 
## Architecture Overview:
This Project uses React and Vite. Do not add things like traditional NodeJS - this is to prevent it from becoming based on the backend. This is done to keep simplicity, and make it more widely available. 
- **src/blocks/** - this is a directory organized into general categories. These use `Blockly.Blocks['name']` to define a function that is then used in `Toolbox.jsx`.

12 directories, 50 files
## AI Rules
1. Do not edit without permission. First, come up with a plan and present it to the user. Do not edit anything unless given explicit permission from the user.
2. Always double check through `npm run build` and let the user experiment to see if it works.
3. When reporting a potential issue, please state a potential fix to this issue.
4. Keep the code organized!  Do not create hundreds of unused files.
5. Do not run Git commit! Unless given permission, do not run git commit so that the user can write the actual push message.
6. Read `README.md` and the `docs/` folder! This gives you a general knowledge of the project.
