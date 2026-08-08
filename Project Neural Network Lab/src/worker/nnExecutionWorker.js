import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgpu";
import "@tensorflow/tfjs-backend-webgl";
import { loadMNIST } from "../mnist";

const modelRegistry = new Map();

async function initBackend() {
  await tf.ready();
}

function disposeModels() {
  modelRegistry.forEach((record) => record.model.dispose());
  modelRegistry.clear();
}

async function predict(modelId, values) {
  const record = modelRegistry.get(modelId);
  if (!record) {
    throw new Error(`No trained model named ${modelId}.`);
  }

  const expected = record.metadata.inputShape.reduce((total, size) => total * size, 1);
  if (values.length !== expected) {
    throw new Error(`Expected ${expected} input values, received ${values.length}.`);
  }
  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error("Inference input must contain only numbers.");
  }

  const prepared = record.metadata.normalized
    ? values.map((value) => value / 255)
    : values;
  const input = tf.tensor(prepared, [1, ...record.metadata.inputShape]);

  try {
    const rawOutput = record.model.predict(input);
    const outputs = Array.isArray(rawOutput) ? rawOutput : [rawOutput];
    try {
      return Array.from(await outputs[0].data());
    } finally {
      outputs.forEach((tensor) => tensor.dispose());
    }
  } finally {
    input.dispose();
  }
}

self.onmessage = async (event) => {
  const { type, code, modelId, values, requestId } = event.data;

  try {
    if (type === "START_TRAINING") {
      disposeModels();
      await initBackend();
      const logger = (data) => self.postMessage(data);
      const runtime = { modelRegistry };
      const runTraining = new Function(
        "tf",
        "logger",
        "loadMNIST",
        "runtime",
        `return (async () => { ${code} })();`,
      );

      await runTraining(tf, logger, loadMNIST, runtime);
      self.postMessage({ type: "TRAINING_COMPLETE" });
      return;
    }

    if (type === "PREDICT") {
      const output = await predict(modelId, values);
      self.postMessage({ type: "PREDICTION_RESULT", requestId, output });
    }
  } catch (error) {
    self.postMessage({
      type: "ERROR",
      requestId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
