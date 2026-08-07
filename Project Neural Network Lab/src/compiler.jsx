/* eslint-disable react-refresh/only-export-components */
import { getCurrentCode } from "./HelpDesk";
import { prepareUploadedDataset } from "./blocks/dataset/upload_dataset";

const sequenceLayerTypes = new Set(["gru_layer", "lstm_layer", "rnn_layer"]);
const shapePreservingLayerTypes = new Set([
  "layer_normalization",
  "batch_normalization",
  "dropout_layer",
  "gaussian_noise",
]); // TODO: Check for anymore "shape preserving and seq layer type"

function modelUsesSequenceInput(layers) {
  const shapeDefiningLayer = layers.find(
    (layer) => !shapePreservingLayerTypes.has(layer.type),
  );
  return sequenceLayerTypes.has(shapeDefiningLayer?.type);
}

function fail(message, block) {
  const suffix = block?.type ? ` (block: ${block.type})` : "";
  throw new Error(message + suffix);
}

function inputBlock(block, name, required = true) {
  const input = block?.inputs?.[name];
  const child = input?.block ?? input?.shadow ?? null;
  if (!child && required) fail(`${name} missing`, block);
  return child;
}

function nextBlock(block) {
  return block?.next?.block ?? null;
}

function compileChain(block) {
  const result = [];
  while (block) {
    result.push(compileBlock(block));
    block = nextBlock(block);
  }
  return result;
}

function numberField(block, name) {return Number(block.fields[name]);}
function textField(block, name) {return String(block.fields[name] ?? "");}

function compileMathExpression(block) {
  if (!block) return { type: "math_variable" };

  switch (block.type) {
    case "math_number_value":
      return { type: "math_number", value: numberField(block, "VALUE") };
    case "math_x_value":
      return { type: "math_variable" };
    case "math_arithmetic_value":
      return {
        type: "math_arithmetic",
        operation: textField(block, "OPERATION"),
        left: compileMathExpression(inputBlock(block, "LEFT")),
        right: compileMathExpression(inputBlock(block, "RIGHT")),
      };
    case "math_function_value":
      return {
        type: "math_function",
        functionName: textField(block, "FUNCTION"),
        value: compileMathExpression(inputBlock(block, "VALUE")),
      };
    case "rnn_layer":
      return {
        type: "rnn",
        units: numberField(block, "UNITS"),
        returnSequences: block.fields.RETURN_SEQUENCES === true || block.fields.RETURN_SEQUENCES === "TRUE",
      };
    default:
      fail("Unknown math expression " + block.type, block);
  }
}

function compileMathExpressionCode(node) {
  if (node.type === "math_number") return JSON.stringify(node.value);
  if (node.type === "math_variable") return "xs";

  if (node.type === "math_arithmetic") {
    const operations = {
      ADD: "add",
      SUBTRACT: "sub",
      MULTIPLY: "mul",
      DIVIDE: "div",
      POWER: "pow",
    };
    const operation = operations[node.operation];
    if (!operation) fail("Unknown math operation " + node.operation);
    return `tf.${operation}(${compileMathExpressionCode(node.left)}, ${compileMathExpressionCode(node.right)})`;
  }

  if (node.type === "math_function") {
    const functions = {
      ABS: "abs",
      EXP: "exp",
      LOG: "log",
      SQRT: "sqrt",
      SQUARE: "square",
      SIN: "sin",
      COS: "cos",
      TAN: "tan",
      TANH: "tanh",
      SIGMOID: "sigmoid",
    };
    const functionName = functions[node.functionName];
    if (!functionName) fail("Unknown math function " + node.functionName);
    return `tf.${functionName}(${compileMathExpressionCode(node.value)})`;
  }

  fail("Unknown compiled math expression " + node.type);
}

export function compileBlock(block) {
  switch (block.type) {
    case "leakyReLU":
      return { type: "leakyReLU", alpha: numberField(block, "ALPHA")}
    case "main_program":
      return { type: "program", statements: compileChain(inputBlock(block, "STACK", false)) };
    case "train_model":
      return {
        type: "train",
        optimizer: textField(block, "OPTIMIZER"),
        epochs: numberField(block, "EPOCHS"),
        model: compileBlock(inputBlock(block, "MODEL")),
        dataset: compileBlock(inputBlock(block, "DATASET")),
        learning_rate: numberField(block, "LEARNING_RATE"),
        loss_function: textField(block, "LOSS_FUNCTION")
      };
    case "validate_model":
      return {
        type: "validate",
        modelId: textField(block, "MODEL_ID"),
        questions: numberField(block, "QUESTIONS"),
        dataset: compileBlock(inputBlock(block, "DATASET")),
      };
    case "text_inference_model":
      return { type: "infer", mode: "raw", modelId: textField(block, "MODEL_ID"), input: textField(block, "INPUT_DATA") };
    case "math_inference_model":
      return { type: "infer", mode: "math", modelId: textField(block, "MODEL_ID"), input: numberField(block, "X_VALUE") };
    case "mnist_inference_model":
      return { type: "infer", mode: "mnist", modelId: textField(block, "MODEL_ID") };
    case "mnist_dataset":
      return {
        type: "dataset",
        name: "mnist",
        task: "classification",
        inputShape: [28, 28, 1],
        outputShape: [10],
        normalize: block.fields.NORMALIZE === true || block.fields.NORMALIZE === "TRUE",
        dataset_size: numberField(block, "DATASET_SIZE"),
      };
    case "math_dataset":
      return {
        type: "dataset",
        name: "math",
        task: "regression",
        inputShape: [1],
        outputShape: [1],
        equation: compileMathExpression(inputBlock(block, "EQUATION", false)),
        min: numberField(block, "MIN_X"),
        max: numberField(block, "MAX_X"),
        points: numberField(block, "POINTS"),
      };
    case "multihead_attention":
      return {
        type: "multihead_attention",
        heads: numberField(block, "HEADS"),
        keyDimensions: numberField(block, "DIMENSION")
      };
    case "activation_layer":
      return { type: "activation", activation: textField(block, "ACTIVATION") };
    case "sequential_neural_network":
      return { type: "model", name: textField(block, "MODEL_NAME"), layers: compileChain(inputBlock(block, "LAYERS", false)) };
    case "dense_layer":
      return { type: "dense", units: numberField(block, "UNITS"), activation: textField(block, "ACTIVATION") };
    case "gru_layer":
      return {
        type: "gru_layer",
        units: numberField(block, "UNITS"),
        return_sequences: block.fields.RETURN_SEQUENCES === true || block.fields.RETURN_SEQUENCES === "TRUE",
      };
    case "layer_normalization": return { type: "layer_normalization" };
    case "batch_normalization": return { type: "batch_normalization" };
    case "GlobalAveragePooling2D": return { type: "global_average_pooling2d" };
    case "reshape_layer": return { type: "reshape", shape: textField(block, "SHAPE") };
    case "alpha_dropout_layer": return { type: "alpha_dropout_layer", rate: numberField(block, "DROPOUT_RATE") };
    case "conv2d_layer":
      return {
        type: "conv2d",
        filters: numberField(block, "FILTERS"),
        kernelSize: numberField(block, "KERNEL_SIZE"),
        strides: numberField(block, "STRIDES"),
        padding: textField(block, "PADDING"),
        activation: textField(block, "ACTIVATION")
      };
    case "max_pooling2d_layer":
      return {
        type: "max_pooling2d",
        poolSize: numberField(block, "POOL_SIZE"),
        strides: numberField(block, "STRIDES")
      };
    case "lstm_layer":
      return {
        type: "lstm_layer",
        units: numberField(block, "UNITS"),
        return_sequences: block.fields.RETURN_SEQUENCES === true || block.fields.RETURN_SEQUENCES === "TRUE",
        activation: textField(block, "ACTIVATION")
      };
    case "dropout_layer":
      return {
        type: "dropout_layer",
        dropoutRate: numberField(block, "DROPOUT_RATE")
      };
    case "embedding_layer":
      return {
        type: "embedding_layer",
        dimensions: numberField(block, "Dimensions"),
        outputDim: numberField(block, "Output_Dim"),
        inputLength: numberField(block, "Input Length")
      };
    case "gaussian_noise":
      return {
        type: "gaussian_noise",
        stddev: numberField(block, "STDDEV")
      };
    case "upload_dataset":
      return {
        type: "dataset",
        name: "upload",
        task: textField(block, "TASK"),
        inputKey: textField(block, "INPUT_KEY"),
        labelKey: textField(block, "LABEL_KEY"),
        ...prepareUploadedDataset(
          block.id,
          textField(block, "INPUT_KEY"),
          textField(block, "LABEL_KEY"),
          textField(block, "TASK"),
        ),
      };
    default:
      fail("Unknown block " + block.type);
  }
}

function metadataCode(dataset, sequenceInput) {
  return `{
    dataset: ${JSON.stringify(dataset.name)},
    task: ${JSON.stringify(dataset.task)},
    inputShape: model.inputs[0].shape.slice(1),
    normalized: ${dataset.name === "mnist" && dataset.normalize},
    sequenceInput: ${sequenceInput}
  }`;
}

export function compileCode(node, context = {}) {
  switch (node.type) {
    case "program":
      return `const modelRegistry = new Map();
async function predictRecord(record, values) {
  const expected = record.metadata.inputShape.reduce((total, size) => total * size, 1);
  if (values.length !== expected) {
    throw new Error("Expected " + expected + " input values, received " + values.length + ".");
  }
  const prepared = record.metadata.normalized ? values.map(value => value / 255) : values;
  const input = tf.tensor(prepared, [1, ...record.metadata.inputShape]);
  const rawOutput = record.model.predict(input);
  const outputs = Array.isArray(rawOutput) ? rawOutput : [rawOutput];
  const valuesOut = Array.from(await outputs[0].data());
  input.dispose();
  outputs.forEach(tensor => tensor.dispose());
  return valuesOut;
}
return (async () => {
${node.statements.map((statement) => compileCode(statement, context)).join("\n")}
})();`;

    case "dataset":
      if (node.name === "mnist") {
        return `async function generateData() {
  console.log("Loading MNIST...");
  const data = await loadMNIST(${node.dataset_size});
  let xs = data.xs;
  const ys = data.ys;
  ${node.normalize ? "xs = xs.div(255);" : ""}
  ${context.sequenceInput ? "xs = xs.reshape([xs.shape[0], 28, 28]);" : ""}
  console.log("MNIST loaded", xs.shape, ys.shape);
  return { xs, ys };
}`;
      }

      if (node.name === "math") {
        const expression = compileMathExpressionCode(node.equation);
        return `function generateData() {
  console.log("Generating math dataset...");
  const min = ${node.min};
  const max = ${node.max};
  const points = ${node.points};
  const xs = tf.linspace(min, max, points).reshape([points, 1]);
  const result = ${expression};
  const ys = result instanceof tf.Tensor
    ? tf.broadcastTo(result, [points, 1])
    : tf.fill([points, 1], result);
  return {
    xs: ${context.sequenceInput ? "xs.reshape([points, 1, 1])" : "xs"},
    ys
  };
}`;
      }

      if (node.name === "upload") {
        const reshapeSequence = context.sequenceInput && node.inputShape.length === 1
          ? "xs = xs.reshape([xs.shape[0], 1, xs.shape[1]]);"
          : "";
        return `function generateData() {
  console.log("Loading uploaded dataset ${node.fileName.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}...");
  let xs = tf.tensor(${JSON.stringify(node.xs)});
  const ys = tf.tensor(${JSON.stringify(node.ys)});
  ${reshapeSequence}
  console.log("Uploaded dataset loaded", xs.shape, ys.shape);
  return { xs, ys };
}`;
      }
      break;

    case "dense":
      return `tf.layers.dense({ units: ${node.units}, activation: ${JSON.stringify(node.activation)} })`;
    case "gru_layer":
      return `tf.layers.gru({
  units: ${node.units},
  returnSequences: ${node.return_sequences ?? false}${context.inputShape ? `,\n  inputShape: ${JSON.stringify(context.inputShape)}` : ""}
})`;
    case "layer_normalization":
      return `tf.layers.layerNormalization()`;
    case "batch_normalization":
      return `tf.layers.batchNormalization()`;
    case "model": {
      const dataset = context.dataset;
      const layers = [...node.layers];
      const sequenceInput = modelUsesSequenceInput(layers);
      const inputShape = sequenceInput
        ? dataset.inputShape.length === 1 ? [1, dataset.inputShape[0]] : dataset.inputShape.slice(0, 2)
        : dataset.inputShape;
      const hasOutput = layers.at(-1)?.type === "dense" && layers.at(-1)?.units === dataset.outputShape[0];
      if (!hasOutput) {
        layers.push({ type: "dense", units: dataset.outputShape[0], activation: dataset.task === "regression" ? "linear" : "softmax" });
      }
      const firstDenseIndex = layers.findIndex(layer => layer.type === "dense");
      if (dataset.inputShape.length === 3 && !sequenceInput && firstDenseIndex !== -1) {
        layers.splice(firstDenseIndex, 0, { type: "flatten" });
      }

      const compiledLayers = [];
      const firstInputShape = () => compiledLayers.length === 0
        ? `, inputShape: ${JSON.stringify(inputShape)}`
        : "";
      const firstInputShapeConfig = () => compiledLayers.length === 0
        ? `{ inputShape: ${JSON.stringify(inputShape)} }`
        : "{}";
      for (let index = 0; index < layers.length;) {
        const layer = layers[index];
        if (layer.type === "flatten") {
          const first = compiledLayers.length === 0;
          compiledLayers.push(`tf.layers.flatten(${first ? `{ inputShape: ${JSON.stringify(dataset.inputShape)} }` : ""})`);
          index += 1;
          continue;
        }
        if (layer.type === "layer_normalization") {
          compiledLayers.push(`tf.layers.layerNormalization(${firstInputShapeConfig()})`);
        } else if (layer.type === "rnn_layer") {
          compiledLayers.push(`tf.layers.rnn({
            units: ${layer.units},
            returnSequences: ${layer.returnSequences}${firstInputShape()}
          })`);
        } else if (layer.type === "batch_normalization") {
          compiledLayers.push(`tf.layers.batchNormalization(${firstInputShapeConfig()})`);
        } else if (layer.type === "activation") {
          compiledLayers.push(`tf.layers.activation({ activation: ${JSON.stringify(layer.activation)}${firstInputShape()} })`);
        } else if (layer.type === "conv2d") {
          compiledLayers.push(`tf.layers.conv2d({
            filters: ${layer.filters},
            kernelSize: ${layer.kernelSize},
            strides: ${layer.strides},
            padding: ${JSON.stringify(layer.padding)},
            activation: ${JSON.stringify(layer.activation)}${firstInputShape()}
          })`);

        } else if (layer.type === "max_pooling2d") {
          compiledLayers.push(`tf.layers.maxPooling2d({
            poolSize: ${layer.poolSize},
            strides: ${layer.strides}${firstInputShape()}
          })`);
        } else if (layer.type === "dropout_layer") {
          compiledLayers.push(`tf.layers.dropout({ rate: ${layer.dropoutRate}${firstInputShape()} })`);
        } else if (layer.type === "embedding_layer") {
          compiledLayers.push(`tf.layers.embedding({
            inputDim: ${layer.dimensions},
            outputDim: ${layer.outputDim},
            inputLength: ${layer.inputLength}${firstInputShape()}
          })`);
        } else if (layer.type === "multihead_attention") {
          compiledLayers.push(`tf.layers.multiHeadAttention({
            num_heads: ${layer.heads},
            key_dim: ${layer.keyDimensions}${firstInputShape()}
          })`);
        }  else if (layer.type == "gaussian_noise") {
          compiledLayers.push(`tf.layers.gaussianNoise({ stddev: ${layer.stddev}${firstInputShape()} })`);
        } else if (layer.type === "alpha_dropout_layer") {
          compiledLayers.push(`tf.layers.alphaDropout({ rate: ${layer.rate}${firstInputShape()} })`);
        } else if (layer.type == "leakyReLU") {
          compiledLayers.push(`tf.layers.leakyReLU({ alpha: ${layer.alpha}${firstInputShape()} })`);
        } else if (layer.type == "reshape_layer") {
          compiledLayers.push(`tf.layers.reshape({ shape: ${JSON.stringify(layer.shape)}${firstInputShape()} })`);
        } else if (layer.type == "global_average_pooling2d") {
          compiledLayers.push(`tf.layers.globalAveragePooling2d()`);
        }
        if (layer.type === "lstm_layer") {
            let end = index + 1;

            while (layers[end]?.type === "lstm_layer") {
              end += 1;
            }

            const group = layers.slice(index, end);

            if (group.length > 1) {
              const cells = group
                .map(
                  item => `tf.layers.lstmCell({
                    units: ${item.units},
                    activation: ${JSON.stringify(item.activation)}
                  })`
                )
                .join(",");

              compiledLayers.push(`tf.layers.rnn({
                cell: [${cells}],
                returnSequences: ${group.at(-1).return_sequences ?? false}
                ${compiledLayers.length === 0
                  ? `, inputShape: ${JSON.stringify(inputShape)}`
                  : ""}
              })`);
            } else {
              compiledLayers.push(`tf.layers.lstm({
                units: ${layer.units},
                returnSequences: ${layer.return_sequences ?? false},
                activation: ${JSON.stringify(layer.activation)}
                ${compiledLayers.length === 0
                  ? `, inputShape: ${JSON.stringify(inputShape)}`
                  : ""}
              })`);
            }

            index = end;
            continue;
          }

        if (layer.type === "dense") {
          compiledLayers.push(`tf.layers.dense({ units: ${layer.units}, activation: ${JSON.stringify(layer.activation)}${firstInputShape()} })`);
          index += 1;
          continue;
        }
        if (layer.type === "gru_layer") {
          let end = index + 1;
          while (layers[end]?.type === "gru_layer") end += 1;
          const group = layers.slice(index, end);
          if (group.length > 1) {
            const cells = group.map((item) => `tf.layers.gruCell({ units: ${item.units} })`).join(",");
            compiledLayers.push(`tf.layers.rnn({ cell: [${cells}], returnSequences: ${group.at(-1).return_sequences ?? false}${firstInputShape()} })`);
          } else {
            compiledLayers.push(compileCode(layer, { inputShape: compiledLayers.length === 0 ? inputShape : null }));
          }
          index = end;
          continue;
        }
        index += 1;
      }
      return `tf.sequential({ layers: [${compiledLayers.join(",")}] })`;
    }
    case "train": {
      const dataset = node.dataset;
      const loss_function = node.loss_function;
      const sequenceInput = modelUsesSequenceInput(node.model.layers);
      const classification = dataset.task === "classification";
      const loss = loss_function;
      const metrics = classification ? `, metrics: ["accuracy"]` : "";
      return `{
${compileCode(dataset, { sequenceInput })}
const model = ${compileCode(node.model, { dataset })};
model.compile({ optimizer: ${JSON.stringify(node.optimizer)}, loss: ${JSON.stringify(loss)}${metrics} });
const data = await generateData();
await model.fit(data.xs, data.ys, {
  epochs: ${node.epochs},
  validationSplit: 0.2,
  shuffle: true,
  callbacks: {
    onEpochEnd: (epoch, logs) => logger({
      type: "epoch", epoch: epoch + 1, loss: logs.loss,
      accuracy: logs.accuracy ?? logs.acc,
      valLoss: logs.val_loss,
      valAccuracy: logs.val_accuracy ?? logs.val_acc
    })
  }
});

const sampleCount = Math.min(12, data.xs.shape[0]);
const activationSample = tf.slice(data.xs, [0, ...data.xs.shape.slice(1).map(() => 0)], [sampleCount, ...data.xs.shape.slice(1)]);
const inspector = tf.model({ inputs: model.inputs, outputs: model.layers.map(layer => layer.output) });
const rawPredictions = inspector.predict(activationSample);
const predictions = Array.isArray(rawPredictions) ? rawPredictions : [rawPredictions];
const activationLayers = [];
for (let index = 0; index < model.layers.length; index += 1) {
  const layer = model.layers[index];
  const prediction = predictions[index];
  const flattened = prediction.reshape([sampleCount, -1]);
  const neuronCount = Math.min(24, flattened.shape[1]);
  const sampled = tf.slice(flattened, [0, 0], [sampleCount, neuronCount]);
  const values = await sampled.array();
  activationLayers.push({
    id: String(index), name: layer.name, type: layer.getClassName(),
    outputShape: prediction.shape.slice(1), totalNeurons: flattened.shape[1],
    values: values.map(row => row.map(value => Number.isFinite(value) ? value : null))
  });
  sampled.dispose();
  flattened.dispose();
}
predictions.forEach(tensor => tensor.dispose());
activationSample.dispose();
const metadata = ${metadataCode(dataset, sequenceInput)};
modelRegistry.set(${JSON.stringify(node.model.name)}, { model, metadata });
logger({ type: "activation-map", layers: activationLayers });
logger({ type: "model-trained", modelId: ${JSON.stringify(node.model.name)}, metadata });
}`;
    }

    case "infer": {
      const id = JSON.stringify(node.modelId);
      if (node.mode === "mnist") {
        return `{
const record = modelRegistry.get(${id});
if (!record) throw new Error("No trained model named " + ${id} + ". Place inference after its Train block.");
if (record.metadata.dataset !== "mnist") throw new Error("MNIST drawing inference requires a model trained on MNIST.");
logger({ type: "inference-ready", mode: "mnist", modelId: ${id}, model: record.model, metadata: record.metadata });
}`;
      }
      const values = node.mode === "math"
        ? `[${Number(node.input)}]`
        : `${JSON.stringify(node.input)}.trim().split(/[\\s,]+/).filter(Boolean).map(Number)`;
      return `{
const record = modelRegistry.get(${id});
if (!record) throw new Error("No trained model named " + ${id} + ". Place inference after its Train block.");
const inputValues = ${values};
if (inputValues.some(value => !Number.isFinite(value))) throw new Error("Inference input must contain only numbers.");
const output = await predictRecord(record, inputValues);
logger({ type: "inference-ready", mode: ${JSON.stringify(node.mode)}, modelId: ${id}, model: record.model, metadata: record.metadata });
logger({ type: "inference-result", mode: ${JSON.stringify(node.mode)}, modelId: ${id}, input: inputValues, output });
}`;
    }

    case "validate": {
      const dataset = node.dataset;
      const id = JSON.stringify(node.modelId);
      return `{
const record = modelRegistry.get(${id});
if (!record) throw new Error("No trained model named " + ${id} + ". Place validation after its Train block.");
${compileCode(dataset)}
const validationData = await generateData();
let validationXs = validationData.xs;
if (record.metadata.sequenceInput && validationXs.rank === 4) validationXs = validationXs.reshape([validationXs.shape[0], 28, 28]);
if (record.metadata.sequenceInput && validationXs.rank === 2) validationXs = validationXs.reshape([validationXs.shape[0], 1, validationXs.shape[1]]);
const validationCount = Math.min(${node.questions}, validationXs.shape[0]);
const xs = tf.slice(validationXs, [0, ...validationXs.shape.slice(1).map(() => 0)], [validationCount, ...validationXs.shape.slice(1)]);
const ys = tf.slice(validationData.ys, [0, ...validationData.ys.shape.slice(1).map(() => 0)], [validationCount, ...validationData.ys.shape.slice(1)]);
const rawMetrics = record.model.evaluate(xs, ys);
const metricTensors = Array.isArray(rawMetrics) ? rawMetrics : [rawMetrics];
const metricValues = await Promise.all(metricTensors.map(tensor => tensor.data().then(values => values[0])));
logger({ type: "validation", modelId: ${id}, samples: validationCount, loss: metricValues[0], accuracy: metricValues[1] });
metricTensors.forEach(tensor => tensor.dispose());
xs.dispose();
ys.dispose();
}`;
    }

    default:
      throw new Error("Unknown AST node " + node.type);
  }
}

export function Interpreter(workspace) {
  const data = getCurrentCode(workspace);
  const main = data.blocks.blocks.find((block) => block.type === "main_program");
  if (!main) throw new Error("No Main Program block");
  return compileCode(compileBlock(main));
}

export const compileWorkspace = Interpreter;
