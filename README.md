# Project Neural Network Lab
A blockly based (*Scratch-style engine*) that allows you to run neural network models and customize it based on blockly blocks. It uses NPM and runs *Tensorflow.JS* in the browser, making demos very easy. *NOTE: I used lorenmh/mnist_handwritten_json* in this project. You can view that repository [here](https://github.com/lorenmh/mnist_handwritten_json).

**NOTE:** Due to memory restrictions in the browser, do not expect large datasets to perform very well in the browser. This is due to browser restrictions from the browser's memory restrictions and how much memory you have.
## Features
Currently, the following has been added:
- Blockly Engine
- Sequential Neural Network 
- Two Layers:
    - GRU
    - Dense Layers
- Two Datasets:
    - MNIST (**VERY LAGGY**)
    - Synthetic Math Dataset Generator
## Requirements
- NodeJS
- npm

<details>
<summary>Installation Instructions</summary>
<h2> Installation </h2>

```bash
git clone https://github.com/RA86-dev/project_NN_Lab
cd project_NN_Lab/Project\ Neural\ Network\ Lab/ 
npm install 
npm run dev 

```
</details>


## License
Licensed under MIT [here](LICENSE)
## Example Image
<p align="center">
  <img src="README_assets/screenshot.png" alt="Screenshot" width="600"/>
</p>
