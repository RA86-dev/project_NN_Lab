import { leakyRelu } from "@tensorflow/tfjs";

export const definitions = {
    main_program:`
    #### Main Program
    This brick is the base of all code. Use it as the first block to connect your models.
    `,
    train_model:`
    #### Train Model Brick
    This brick allows you to train your neural network. It uses Tensorflow to train it in your browser.
    ##### Arguments:
    - Train Model:  MODEL Element - For example, a Sequential Neural Network. Accepts anything from the category 'Neural Networks'.
    - Dataset: DATASET Element - For example, allows Math Dataset (Anything from category Dataset)
    ###### Optimizer Argument
    Optimizer is a algorithm (like Adam) that updates a model's internal weights to reduce errors and improve prediction Accuracy. Currently, there is:
    1. Adam - The Adam Optimizer (Adaptive Moment Estimation) is a algorithm used to train deep learning models by combining Momentum (another optimizer) and RMSProp to automatically adapt the learning rate (How fast a model learns) for each model parameter. Highly efficient.
    2. SGD - The Stochastic Gradient Descent (SGD) optimizer is a fundamental algorithm that updates model parameters using individual samples. It uses the mini-batches to minimize loss, and balances both fast computation with noisy updates.
    3. RMSProp - Root Mean Square Propogation is a adaptive learning rate optimization algorithm for Neural Networks. It fixes Adagrad's agressive learning decay.
    4. Adagrad - A adaptive optimizer that scales the size of each step per parameter using past squared gradients, making it ideal for NLP (Natural Language Processing) but susceptable to early decay loss
    `,
    math_dataset: `
    #### Math Dataset
    Generates x/y training points from connected math expression blocks. The expression is calculated with TensorFlow in the browser.
    ##### Arguments:
    - y - Connect an expression made from x, number, arithmetic, and function blocks.
    - Minimum and Maximum X - the maximum and minimum that X can be (useful for certain math equations that go on forever)
    - Points - the total amount of dataset points it will generate.
    `,
    math_number_value: `
    #### Number
    A numeric constant for a math dataset expression.
    `,
    math_x_value: `
    #### X Value
    The input x value for a math dataset expression.
    `,
    math_arithmetic_value: `
    #### Arithmetic
    Combines two expressions using TensorFlow addition, subtraction, multiplication, division, or powers.
    `,
    math_function_value: `
    #### Math Function
    Applies a TensorFlow function such as absolute value, exponential, logarithm, square root, or trigonometry.
    `,
    dense_layer: `
    #### Dense Layer
    A dense layer means every neuron receives a input from a neuron from the previous layer (fully connected).
    ##### Arguments:
    - Neurons - the total amount of neurons to be activated and used
    - Activation - An activation function is a mathematical rule used in ANNs to decide if a neuron should fire or pass information.
        - ReLU - A commonly used function for activations. Its easy and quick. 
        - Sigmoid - A mathematical formula that converts a number between 0 and 1, where 0 is equal to negative infinity and 1 is equal to infinity. Good for probabilities and predictions.
        - Softmax - A function that turns a list of unconstrained numbers into a valid set of probabilities.
        - Tanh - A non-linear activation function that maps input values to a curve ranging strictly between -1 and 1. Due to this, the mean of averages is around 0, which helps models converge faster than Sigmoid.
    `,
    sequential_neural_network: `
    #### Sequential Neural Networks
    Sequential Neural Networks are models built by stacking layers linearly. Information flows directly in a straight line from the input layer.
    **NOTE:** You cannnot add spaces in the model name. This is due to a issue with Javascript identifiers. Please use "_" instead of spaces.

    `,
    mnist_dataset: `
    #### MNIST Dataset
    MNIST is a online, public dataset for handwriting recognition. It is used for benchmarking models, since most models can complete the MNIST test easily.
    **NOTE:** Mnist is quite laggy. Do not expect great performance.
    `,
    upload_dataset: `
    #### Upload Dataset
    Uploads a local JSON or JSONL file for model training or validation.

    JSON may be an array of records, or an object containing a \`data\` or \`records\` array. JSONL must contain one JSON object per line.

    Use **Input key(s)** and **Label key** to select fields from each record. Separate multiple input columns with commas; dot-separated nested keys are also supported. Classification converts scalar labels to one-hot vectors; regression accepts numeric scalar or array labels.
    `,
    gru_layer: `
    #### GRU Layer
    A specialized type of Recurrent neural network (RNN) used for processing sequential and time series data. It uses two gates.
    ### Arguments
    Units - the equivalent of neurons.
    Return Sequences - Controls whether a GRU outputs every timestep or just the final result. Required to turn on when another GRU follows, because that GRU needs a sequence.
    `,
    text_inference_model: `
    #### Raw Inference
    Runs a trained model using numeric values separated by commas or spaces. The Model ID must match the name on a model trained earlier in the program.
    `,
    math_inference_model: `
    #### Math Inference
    Predicts a y value for the supplied x value. Place this block after training and use the same Model ID.
    `,
    mnist_inference_model: `
    #### MNIST Drawing Inference
    Opens an interactive drawing pad in Output. Your drawing is cropped, centered, resized to 28×28, and normalized when the model expects normalized MNIST data.
    `,
    validate_model: `
    #### Validate Model
    Evaluates an already-trained model against the connected dataset. The Model ID must match the name used by an earlier Train block.
    `,
    multihead_attention: `
    #### Multi-Head Attention Layer
    A MHA (Multi-Head Attention) layer is a component used in transformer models to allow the model to focus on different parts of the input sequence simultaneously.
    ### Arguments
    Heads - the number of attention heads.
    Key Dimensions - the dimensionality of the key vectors.
    `,
    lstm_layer: `
    #### LSTM Layer
    A type of recurrent neural network (RNN) layer that is designed to avoid the vanishing gradient problem.
    ### Arguments
    Units - the number of units in the LSTM layer.
    Return Sequences - Controls whether an LSTM outputs every timestep or just the final result.
    `,
    dropout_layer: `
    #### Dropout Layer
    A regularization layer that randomly sets a fraction of input units to 0 at each update during training time, which helps prevent overfitting.
    ### Arguments
    Rate - the fraction of the input units to drop.`,
    conv2d_layer: `
    #### Conv2D Layer
    A 2D convolutional layer that applies a convolution operation to the input. This helps identify different features in the input.
    ### Arguments
    Filters - the number of filters to apply.
    Kernel Size - the size of the kernel.
    Strides - the stride of the convolution.
    Padding - the padding to apply.
    `,
    embedding_layer: `
    #### Embedding Layer
    A layer that maps integers to dense vectors of fixed size.
    ### Arguments
    Input Dim - the size of the vocabulary.
    Output Dim - the dimension of the dense embedding.
    `,
    activation_layer: `
    #### Activation Layer
    A layer that applies an activation function to the input.
    ### Arguments
    Activation - the activation function to apply.
    `,
    batch_normalization: `
    #### Batch Normalization Layer
    A layer that normalizes the input across the batch dimension.
    ### Arguments
    Axis - the axis along which to normalize.
    Momentum - the momentum for the moving average.
    Epsilon - a small constant for numerical stability.
    `,
    layer_normalization: `
    #### Layer Normalization Layer
    A layer that normalizes the input across the feature dimension.
    ### Arguments
    Axis - the axis along which to normalize.
    Epsilon - a small constant for numerical stability.
    `,
    rnn_layer: `
    #### RNN Layer
    A recurrent neural network layer that processes sequences of inputs.
    ### Arguments
    Units - the number of units in the RNN layer.
    Return Sequences - Controls whether an RNN outputs every timestep or just the final result.
    `,
    leakyRelu: `
    #### Leaky ReLU
    A activation function based on ReLU that solves a issue of dead neurons by letting a tiny, non-zero signal pass through when inputs are negative.
    `,
    
}
