
# Project Neural Network Lab

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
![Maintainer](https://img.shields.io/badge/maintainer-RA86--dev-blue)
[![Website Ra86-dev.github.io/project_NN_Lab](https://img.shields.io/website-up-down-green-red/http/ra86-dev.github.io/project_NN_Lab)](Server_Status)
![GitHub License](https://img.shields.io/github/license/RA86-dev/project_NN_Lab)
![GitHub last commit](https://img.shields.io/github/last-commit/RA86-dev/project_NN_lab)
![Hackatime Tracking](https://hackatime.hackclub.com/api/v1/badge/U0BL0LQQH8D/RA86-dev/project_NN_Lab)
---
A blockly based (*Scratch-style engine*) that allows you to run neural network models and customize it based on blockly blocks. It uses NPM and runs *Tensorflow.JS* in the browser, making demos very easy. See the demo [here](https://ra86-dev.github.io/project_NN_Lab/). It's run on GitHub Pages using a GitHub Actions workflow that auto-compiles.


**I recommend that you read this README before you go to the project**.

This was made for Stardance Hackclub (*2026-2027*). (NOTE: The CDN used in this project is from Stardance! If it is no longer available, please modify src/mnist.jsx and replace the link with the one from lorenmh below). 

*NOTE: I used lorenmh/mnist_handwritten_json* in this project. You can view that repository [here](https://github.com/lorenmh/mnist_handwritten_json).

**NOTE:** Due to memory restrictions in the browser, do not expect large datasets to perform very well. We have swapped to Web Workers so that training is performed on a separate "worker" to prevent other workers (including the frontend) from lagging.

I also recorded a video [here](README_assets/video_recording.mp4). It occasionally makes mistakes — the neural network isn't perfect. This demo is meant to show how to get started; for a production-level neural network you'd need a larger model and more data (which would lag the browser).
## Features
Currently, the following has been added:
- Blockly Engine
- Sequential Neural Network 
- A Chart for neural network weight values + Built in presets
- WebGPU/WebGL support! 
    - Web Workers!
- Multiple Layers:
    - GRU
    - Dense Layers
    - Activation Layer
    - Conv2d Layer
    - Maxpooling2d Layer
    - Dropout Layer
    - AlphaDropout
    - GlobalAveragePooling2D
    - Reshape
    - LeakyReLU
    - Embedding Layer
    - LSTM Layer
    - Flatten Layers
    - Multi-Head Attention
    - Gaussian Noise
- Normalization Layers
    - BatchNormalization
    - LayerNormalization
- Types of Neural Networks:
  - Mixture of Experts 
  - Sequential
- Two Datasets:
    - MNIST (**VERY LAGGY**)
    - Synthetic Math Dataset Generator
    - JSON Datasets acceptable through a new block.
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
npm run dev # Development is for non-production grade (like testing)
# FOR PRODUCTION:
npm run build
npm run start
# Modify vite.config.js if you need something changed.
```
</details>


## License
Licensed under Apache 2.0. [here](LICENSE)
## AI Use Declaration
In this project, AI was used for the user interface and debugging issues along with writing some functions. It was not used to write documentation.
## Example Image
<p align="center">
  <img src="README_assets/screenshot.png" alt="Screenshot" width="600"/>
</p>

## Getting Started Guide (How to Use)
Hello! This is a guide on how to use my project.
The goal of this project is to simplify AI models and training, so it doesn't overwhelm people while still allowing them to build what they want and experiment (and break stuff). To start, head to the Basic Blocks section, drag out a main Program block, then add Train and Inference blocks. Choose a dataset, and you're ready to design your system. Note, you might need a lot of Neural network knowledge to use this, however, it's designed to be easier to understand and build scripts to train and experiment with AI models.

It consists of three main sections:
1. The Editor - this is the area where you build the model. This uses Blockly.
2. The Tools - section of tools and other useful things (including importing extensions)
3. Execution/Inference Lab 
### Vocabulary
Every "fancy" word is listed here, along with a simplified definition.
- Model - the neural network. A neural network in this case, is essentially an artificial version of the brain network structure.
- Activation Layer - A mathematical formula inside of a neural network. It decides whether the node should fire, or to pass the signal. It basically just adds nonlinearity.
- Conv2d - Conv2d is a neural network architecture style, that basically identifies patterns in a 2d shape ("2d" refers to two-dimensional data). It's designed to detect patterns in 2D shapes — for example, image pixels. Convolution uses a sliding layer to identify patterns.
- Dense Layer - A dense layer is basically a layer where everything is connected. In some other architectures, such as MoE (Mixture of Experts), not all parameters are connected (which improves efficiency). This is the most commonly used layer in AI and machine learning.
- Dropout Layer - This layer effectively turns off a certain percentage of connections. This is used for testing models or to train models to be more compressed. DURING TRAINING. In actual inference, it does not do this.
- GRU - GRU means Gated Recurrent Unit. It is a simpler version of a LSTM, and has "gates" to control things like how much past information to keep for the future, how much to forget, and a hidden state to merge the short term and long term memory into one. For LSTM and GRUs, you need to turn on return sequences for if there are more layers underneath it.
- Recurrent Neural Network (RNN) - A model that processes data by repeatedly updating an internal state.
- LSTM - A special form of a Recurrent Neural Network designed to remember information over long sequences. Traditional RNNs suffer from the vanishing gradient problem, which basically means that it forgets short term data, however, this one does not. However, these are slower than Traditional RNNs.
- Embedding Layer - A layer which basically converts each word into a token for the AI model. This is useful for Transformers, which is used in large LLMs (Generative* AI models).
- MaxPooling2D - Downsamples the input using the maximum value. It's used to downsample spatial dimensions while retaining the most "dominant" features, which decreases computation time.
- Sequential Neural Network - A model that goes in order of each layer.
- Normalization - This basically scales the data down to a common range, to prevent large features from overpowering smaller features.
- Batch Normalization - Standardizes the inputs to each layer of a neural network.
- Layer Normalization - Instead of normalizing across a batch of data (Batch Normalization), it calculates the mean and variability across the features of a training example.
- MNIST dataset - The MNIST dataset is a 70,000 images dataset of data classification. It contains handwritten numbers, and the model must identify what number is it. It is useful for testing new structures. It is useful for quick sanity checks)
- Alpha Dropout - A variation of dropout that maintains the mean and variance of the inputs, designed for self-normalizing networks (like SeLU!)
- GlobalAveragePooling2D - Calculates the average value for each feature map, replacing the heavy Flatten and Dense layer to reduce model parameters.
- LeakyReLU - An activation function based on ReLU that solves an issue of dead neurons by letting a tiny, non-zero signal pass through when inputs are negative.
- Reshape - Alters the dimensions of a input tensor without changing the data.

Here's a example model:

![Alt-Text](README_assets/SNN-default-model.png)
This is how you configure a normal neural network model. In this case, we are using MNIST, not the math dataset which uses just one neuron — useful for fast testing). In the SNN model, we define the name (which is used for inference as shown by the MNIST brick) and 3 dense layers after that. 
#### Basic Activation Definitions
- Activation - An activation function is a mathematical rule used in ANNs to decide if a neuron should fire or pass information.
    - ReLU - A commonly used function for activations. It's easy and quick. 
    - Sigmoid - A mathematical formula that converts a number between 0 and 1, where 0 is equal to negative infinity and 1 is equal to infinity. Good for probabilities and predictions.
    - Softmax - A function that turns a list of unconstrained numbers into a valid set of probabilities. Good for problems that require generating a list of predicted classes.
    - Tanh - A non-linear activation function that squashes input values into the range -1 to 1. Due to this, the mean of averages is around 0, which helps models converge faster than Sigmoid.
These are the most commonly used activations. Some are better than others for certain tasks, some worse for certain tasks.
## Documentation Page
[Visit Here to see documentation](docs/README.md)
- [Issue Reporting](docs/issue_reporting.md)
- [AI Rules](docs/ai_rules.md)
- [Extension Documentation](docs/extension_building.md)
