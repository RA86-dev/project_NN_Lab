# Project NN Lab
Project Neural Network Lab is a Blockly-based neural network library that allows user to experiment with neural networks without writing a single piece of code. This is done through the use of `Blockly`, a frontend engine that was created by Raspberry Pi (visit [here](https://www.blockly.com/) to see Blockly's website) that creates a block-by-block style interface.

Project NN Lab uses Blockly's engine and the JSON code of every single block to first compile it into a AST  - A Abstract Syntax Tree. It is used in this way to then create a `tensorflow.js` script that runs in a seperate worker (to prevent lag) and to create a result. 

## AST Generation, Block Creation
AST generation is done in `src/compiler.jsx` along with the actual code generation. `compileBlock` creates a general, AST mapping of every single layer (math Exprtessions handled by compileMathExpression and compileMathExpressionCode). It also returns the said values found to the actual code generator.

Block Creation is done in `Toolbox.jsx` and `src/blocks`. Toolbox adds them to the Toolbox on the side, 
and all the blocks are defined in `src/blocks/` to allow for more structured creation.
## Code Generation
Code Generation is done in function `compileCode` in `src/compiler.jsx`. Using AST data, along with pre-defined functions for premade datasets, it can generate complex data easier. This system currently only accepts *Number* based classification and other features in custom JSONL datasets due to the way Tensorflow tensors work. Something like a encoder would be necessary to actually feed the dataset and to get it to work.
## Other Information 
- [Issue Reporting](issue_reporting.md)
- [AI Rules](ai_rules.md)
- [Extension Building](extension_building.md)