import * as Blockly from "blockly";

const uploadedDatasets = new Map();
const uploadIcon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      d="M12 16V4m0 0L7 9m5-5 5 5M5 14v5h14v-5"/>
  </svg>
`)}`;

function recordsFromText(text, fileName) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("The selected dataset is empty.");

  if (fileName.toLowerCase().endsWith(".jsonl")) {
    return trimmed
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line, index) => {
        try {
          return JSON.parse(line);
        } catch (error) {
          throw new Error(`Invalid JSON on line ${index + 1}: ${error.message}`, { cause: error });
        }
      });
  }

  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`, { cause: error });
  }

  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.data)) return parsed.data;
  if (Array.isArray(parsed.records)) return parsed.records;
  throw new Error('JSON datasets must be an array or contain a "data" or "records" array.');
}

function chooseDatasetFile(block) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,.jsonl,application/json,application/x-ndjson";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;

    try {
      const records = recordsFromText(await file.text(), file.name);
      if (records.length === 0) throw new Error("The selected dataset has no records.");
      uploadedDatasets.set(block.id, { fileName: file.name, records });
      block.getField("FILE_NAME")?.setValue(file.name);
      block.setWarningText(null);
    } catch (error) {
      uploadedDatasets.delete(block.id);
      block.getField("FILE_NAME")?.setValue("Choose JSON/JSONL file");
      block.setWarningText(error.message);
    }
  }, { once: true });
  input.click();
}

function readKey(record, key) {
  return key.split(".").reduce((value, part) => value?.[part], record);
}

function numericShape(value, path) {
  if (typeof value === "number" && Number.isFinite(value)) return [];
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${path} must contain a number or a non-empty numeric array.`);
  }

  const childShape = numericShape(value[0], `${path}[0]`);
  for (let index = 1; index < value.length; index += 1) {
    const shape = numericShape(value[index], `${path}[${index}]`);
    if (shape.length !== childShape.length || shape.some((size, axis) => size !== childShape[axis])) {
      throw new Error(`${path} contains arrays with inconsistent shapes.`);
    }
  }
  return [value.length, ...childShape];
}

function assertSameShape(value, expectedShape, path) {
  const shape = numericShape(value, path);
  if (shape.length !== expectedShape.length || shape.some((size, axis) => size !== expectedShape[axis])) {
    throw new Error(`${path} has shape [${shape}], expected [${expectedShape}].`);
  }
}

export function prepareUploadedDataset(blockId, inputKey, labelKey, task) {
  const upload = uploadedDatasets.get(blockId);
  if (!upload) throw new Error("Choose a JSON or JSONL file on the Upload Dataset block before running.");
  const inputKeys = inputKey.split(",").map((key) => key.trim()).filter(Boolean);
  if (inputKeys.length === 0) throw new Error("Enter at least one input key.");

  const inputs = [];
  const labels = [];
  for (let index = 0; index < upload.records.length; index += 1) {
    const record = upload.records[index];
    if (record == null || typeof record !== "object" || Array.isArray(record)) {
      throw new Error(`Dataset record ${index + 1} must be a JSON object.`);
    }
    const inputValues = inputKeys.map((key) => readKey(record, key));
    const label = readKey(record, labelKey);
    const missingInputIndex = inputValues.findIndex((value) => value === undefined);
    if (missingInputIndex !== -1) {
      throw new Error(`Dataset record ${index + 1} is missing input key "${inputKeys[missingInputIndex]}".`);
    }
    if (label === undefined) throw new Error(`Dataset record ${index + 1} is missing label key "${labelKey}".`);
    inputs.push(inputKeys.length === 1 ? inputValues[0] : inputValues);
    labels.push(label);
  }

  const rawInputShape = numericShape(inputs[0], `Record 1.${inputKey}`);
  const inputShape = rawInputShape.length === 0 ? [1] : rawInputShape;
  const xs = inputs.map((value, index) => {
    assertSameShape(value, rawInputShape, `Record ${index + 1}.${inputKey}`);
    return rawInputShape.length === 0 ? [value] : value;
  });

  let ys;
  let outputShape;
  if (task === "classification" && !Array.isArray(labels[0])) {
    const classIndexes = new Map();
    const encoded = labels.map((label, index) => {
      if (!["string", "number", "boolean"].includes(typeof label)) {
        throw new Error(`Record ${index + 1}.${labelKey} must be a scalar class or numeric array.`);
      }
      const classKey = `${typeof label}:${JSON.stringify(label)}`;
      if (!classIndexes.has(classKey)) classIndexes.set(classKey, classIndexes.size);
      return classIndexes.get(classKey);
    });
    outputShape = [classIndexes.size];
    ys = encoded.map((classIndex) => Array.from(
      { length: outputShape[0] },
      (_, index) => index === classIndex ? 1 : 0,
    ));
  } else {
    const rawOutputShape = numericShape(labels[0], `Record 1.${labelKey}`);
    outputShape = rawOutputShape.length === 0 ? [1] : rawOutputShape;
    ys = labels.map((value, index) => {
      assertSameShape(value, rawOutputShape, `Record ${index + 1}.${labelKey}`);
      return rawOutputShape.length === 0 ? [value] : value;
    });
  }

  return { fileName: upload.fileName, xs, ys, inputShape, outputShape };
}

Blockly.Blocks.upload_dataset = {
  init() {
    this.appendDummyInput()
      .appendField("Upload Dataset")
      .appendField(new Blockly.FieldImage(
        uploadIcon,
        20,
        20,
        "Choose JSON or JSONL file",
        () => chooseDatasetFile(this),
      ))
      .appendField(new Blockly.FieldLabelSerializable("Choose JSON/JSONL file"), "FILE_NAME");

    this.appendDummyInput()
      .appendField("Input key(s):")
      .appendField(new Blockly.FieldTextInput("features"), "INPUT_KEY");

    this.appendDummyInput()
      .appendField("Label key:")
      .appendField(new Blockly.FieldTextInput("label"), "LABEL_KEY");

    this.appendDummyInput()
      .appendField("Task:")
      .appendField(new Blockly.FieldDropdown([
        ["Classification", "classification"],
        ["Regression", "regression"],
      ]), "TASK");

    this.setOutput(true, "DATASET");
    this.setColour("#5ba58c");
    this.setTooltip("Upload a JSON or JSONL dataset. Multiple input keys can be separated with commas.");
  },
};
