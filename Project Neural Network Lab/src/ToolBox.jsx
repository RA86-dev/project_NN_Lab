import "./blocks/layers/DenseLayer"
import "./blocks/neural_networks/sequential"
import "./blocks/main_program"
import "./blocks/dataset/math_dataset"
import "./blocks/dataset/mnist_dataset"
import "./blocks/layers/GRUModel"
import "./blocks/training/train"
import "./blocks/inference/run_inference_model"
import "./blocks/inference/validate_model"
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
            type: "gru_layer"
        }
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
            type: 'math_dataset'
        },
        {
            kind: "block",
            type: "mnist_dataset"
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
}
]};
