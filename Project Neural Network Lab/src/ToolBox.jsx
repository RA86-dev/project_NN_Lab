import "./blocks/layers/DenseLayer"
import "./blocks/neural_networks/sequential"
import "./blocks/main_program"
import "./blocks/dataset/math_dataset"
import "./blocks/dataset/math_expressions"
import "./blocks/neural_networks/mixture_of_experts"
import "./blocks/dataset/mnist_dataset"
import "./blocks/dataset/xor_dataset"
import "./blocks/dataset/upload_dataset"
import "./blocks/layers/GRUModel"
import "./blocks/training/train"
import "./blocks/inference/run_inference_model"
import "./blocks/inference/validate_model"
import "./blocks/normalization_layers/BatchNormalization"
import "./blocks/normalization_layers/LayerNormalization"
import "./blocks/layers/ActivationLayer"
import "./blocks/layers/Conv2D"
import "./blocks/layers/MaxPooling2D"
import "./blocks/layers/LSTM"
import "./blocks/layers/embedding"
import "./blocks/layers/multihead_attention"
import "./blocks/layers/GaussianNoise"
import "./blocks/layers/RecurrentNeuralNetwork"
import "./blocks/layers/DropoutLayer"
import "./blocks/layers/AlphaDropout"
import "./blocks/layers/leakyReLU"
import "./blocks/layers/GlobalAveragePooling"
import "./blocks/layers/reshape"
import "./blocks/layers/Flatten"
import "./blocks/layers/PermuteLayer"
import "./blocks/set_seed"
import "./blocks/layers/upSampling2d"
import "./blocks/layers/seperableConv2d"
export const toolbox = {
kind: "categoryToolbox",
contents: [
{
    kind: "category",
    name: "Basic Items",
    colour: "#5b80a5",
    contents: [
        {
            kind: "block",
            type: "main_program"
        }
    ]
},
{
    kind: "category",
    name: "Neural Networks",
    colour: "#995ba5",
    contents: [
        {
        kind: "block",
        type: "sequential_neural_network"
      },
      {
        kind: "block",
        type: "mixture_of_experts"
      }
    ]
},
{
    kind: "category",
    name: "Normalization Layers",
    colour: "#eaffa5",
    contents: [
        {
            kind: "block",
            type: "batch_normalization"
        },
        {
            kind: "block",
            type: "layer_normalization"
        }
    ]
},
{
    kind: "category",
    name: "Actvation Layers",
    colour: "#ff5959",
    contents: [
        {
            kind: "block",
            type: "activation_layer"
        },
        {
            kind: "block",
            type: "leakyReLU"
        }
    ]
},
{
    kind: "category",
    name: "Non-NN Layers",
    colour: "#38afff",
    contents: [
        {
            kind: "block",
            type: "flatten_layer"
        },
        {
            kind: "block",
            type: "permute_layer"
        },
        {
            kind: "block",
            type: "up_sampling_2d"
        },
        {
            kind: "block",
            type: "alpha_dropout_layer"
        },
        {
            kind: "block",
            type: "GlobalAveragePooling2D"
        },
        {
            kind: "block",
            type: "gaussian_noise"
        },
        {
            kind: "block",
            type: "dropout_layer"
        },
        {
            kind: "block",
            type: "max_pooling2d_layer"
        },
        {
            kind: "block",
            type: "set_seed"
        },
        {
            kind: "block",
            type: "reshape_layer"
        }
    ]
},
{
    kind: "category",
    name: "Neural Network Layers",
    colour: "#995ba5",
    contents: [
        {
            kind: "block",
            type: "dense_layer"
        },
        {
            kind: "block",
            type: "seperableConv2d"
        },
        {
            kind: "block",
            type: "gru_layer"
        },
        {
            kind: "block",
            type: "conv2d_layer"
        },
        {
            kind: "block",
            type: "rnn_layer"
        },
        {
            kind: "block",
            type: "lstm_layer"
        },
        {
            kind: "block",
            type: "multihead_attention"
        },
        {
            kind: "block",
            type: "embedding_layer"
        },
    ]
},

{
    kind: "category",
    name: "Inference",
    colour: "#89a55b",
    contents: [
        {
            kind: "block",
            type: "text_inference_model"
        },
        {
            kind: "block",
            type: "math_inference_model"
        },
        {
            kind: "block",
            type: "mnist_inference_model"
        },
        {
            kind: "block",
            type: "validate_model"
        }
    ]
},
{
    kind: "category",
    name: "Dataset",
    colour: "#5ba58c",
    contents: [
        {
            kind: "block",
            type: 'math_dataset',
            inputs: {
                EQUATION: {
                    shadow: { type: "math_x_value" }
                }
            }
        },
        {
            kind: "block",
            type: "mnist_dataset"
        },
        {
            kind: "block",
            type: "xor_dataset"
        },
        {
            kind: "block",
            type: "upload_dataset"
        }
    ]
},
{
    kind: "category",
    name: "Math Expressions",
    colour: "#4f86a8",
    contents: [
        {
            kind: "block",
            type: "math_x_value"
        },
        {
            kind: "block",
            type: "math_number_value"
        },
        {
            kind: "block",
            type: "math_arithmetic_value",
            inputs: {
                LEFT: { shadow: { type: "math_number_value" } },
                RIGHT: { shadow: { type: "math_number_value" } }
            }
        },
        {
            kind: "block",
            type: "math_function_value",
            inputs: {
                VALUE: { shadow: { type: "math_number_value" } }
            }
        }
    ]
},
{
    kind: "category",
    name: "Training",
    colour: "#a55b5b",
    contents: [
        {
            kind: "block",
            type: 'train_model'
        }
    ]
},

]};
