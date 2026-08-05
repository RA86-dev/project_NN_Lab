/* eslint-disable react-refresh/only-export-components */
import { getCurrentCode } from "./HelpDesk";
import { prepareUploadedDataset } from "./blocks/dataset/upload_dataset";

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

function numberField(block, name) {
  return Number(block.fields[name]);
}

function textField(block, name) {
  return String(block.fields[name] ?? "");
}

export function compileBlock(block) {
  switch (block.type) {
    case "main_program":
      return { type: "program", statements: compileChain(inputBlock(block, "STACK", false)) };
    case "train_model":
      return {
        type: "train",
        optimizer: textField(block, "OPTIMIZER"),
        epochs: numberField(block, "EPOCHS"),
        model: compileBlock(inputBlock(block, "MODEL")),
        dataset: compileBlock(inputBlock(block, "DATASET")),
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
        equation: textField(block, "EQUATION"),
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
    case "layer_normalization":
      return { type: "layer_normalization" };
    case "batch_normalization":
      return { type: "batch_normalization" };
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
        const expression = node.equation.replace(/^\s*y\s*=\s*/i, "");
        return `function generateData() {
  console.log("Generating math dataset...");
  const xs = [];
  const ys = [];
  const min = ${node.min};
  const max = ${node.max};
  const points = ${node.points};
  const step = (max - min) / Math.max(points - 1, 1);
  const equation = Function("x", "return (" + ${JSON.stringify(expression)} + ")");
  for (let i = 0; i < points; i += 1) {
    const x = min + i * step;
    xs.push(x);
    ys.push(equation(x));
  }
  return {
    xs: ${context.sequenceInput ? "tf.tensor3d(xs, [xs.length, 1, 1])" : "tf.tensor2d(xs, [xs.length, 1])"},
    ys: tf.tensor2d(ys, [ys.length, 1])
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
      const sequenceInput =
  layers[0]?.type === "gru_layer" ||
  layers[0]?.type === "lstm_layer";
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
      for (let index = 0; index < layers.length;) {
        const layer = layers[index];
        if (layer.type === "flatten") {
          const first = index === 0;
          compiledLayers.push(`tf.layers.flatten(${first ? `{ inputShape: ${JSON.stringify(dataset.inputShape)} }` : ""})`);
          index += 1;
          continue;
        }
        if (layer.type === "layer_normalization") {
          compiledLayers.push(`tf.layers.layerNormalization()`);
        } else if (layer.type === "batch_normalization") {
          compiledLayers.push(`tf.layers.batchNormalization()`);
        } else if (layer.type === "activation_layer") {
          compiledLayers.push(`tf.layers.activation({ activation: ${JSON.stringify(layer.activation)}, inputShape: ${JSON.stringify(inputShape)} })`);
        } else if (layer.type === "conv2d") {
          compiledLayers.push(`tf.layers.conv2d({
            filters: ${layer.filters},
            kernelSize: ${layer.kernelSize},
            strides: ${layer.strides},
            padding: ${JSON.stringify(layer.padding)},
            activation: ${JSON.stringify(layer.activation)},
            inputShape: ${JSON.stringify(inputShape)}
          })`);

        } else if (layer.type === "max_pooling2d") {
          compiledLayers.push(`tf.layers.maxPooling2d({
            poolSize: ${layer.poolSize},
            strides: ${layer.strides},
            inputShape: ${JSON.stringify(inputShape)}
          })`);
        } else if (layer.type === "dropout_layer") {
          compiledLayers.push(`tf.layers.dropout({ rate: ${layer.dropoutRate} })`);
        } else if (layer.type === "embedding_layer") {
          compiledLayers.push(`tf.layers.embedding({
            inputDim: ${layer.dimensions},
            outputDim: ${layer.outputDim},
            inputLength: ${layer.inputLength}
          })`);
        } else if (layer.type === "multihead_attention") {
          compiledLayers.push(`tf.layers.multiHeadAttention({
            num_heads: ${layer.heads},
            key_dim: ${layer.keyDimensions}
          })`);
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
                ${index === 0
                  ? `, inputShape: ${JSON.stringify(inputShape)}`
                  : ""}
              })`);
            } else {
              compiledLayers.push(`tf.layers.lstm({
                units: ${layer.units},
                returnSequences: ${layer.return_sequences ?? false},
                activation: ${JSON.stringify(layer.activation)}
                ${index === 0
                  ? `, inputShape: ${JSON.stringify(inputShape)}`
                  : ""}
              })`);
            }

            index = end;
            continue;
          }

        if (layer.type === "dense") {
          const first = index === 0 && layers[0].type !== "flatten";
          compiledLayers.push(`tf.layers.dense({ units: ${layer.units}, activation: ${JSON.stringify(layer.activation)}${first ? `, inputShape: ${JSON.stringify(dataset.inputShape)}` : ""} })`);
          index += 1;
          continue;
        }
        if (layer.type === "gru_layer") {
          let end = index + 1;
          while (layers[end]?.type === "gru_layer") end += 1;
          const group = layers.slice(index, end);
          if (group.length > 1) {
            const cells = group.map((item) => `tf.layers.gruCell({ units: ${item.units} })`).join(",");
            compiledLayers.push(`tf.layers.rnn({ cell: [${cells}], returnSequences: ${group.at(-1).return_sequences ?? false}${index === 0 ? `, inputShape: ${JSON.stringify(inputShape)}` : ""} })`);
          } else {
            compiledLayers.push(compileCode(layer, { inputShape: index === 0 ? inputShape : null }));
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
      const sequenceInput =
    node.model.layers[0]?.type === "gru_layer" ||
    node.model.layers[0]?.type === "lstm_layer";
      const classification = dataset.task === "classification";
      const loss = classification ? "categoricalCrossentropy" : "meanSquaredError";
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
