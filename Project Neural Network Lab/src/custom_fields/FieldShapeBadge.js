import * as Blockly from "blockly";

const BADGE_HEIGHT = 24;
const BADGE_MIN_WIDTH = 88;
const BADGE_HORIZONTAL_PADDING = 10;
const BADGE_CHARACTER_WIDTH = 6.4;

const MODEL_TYPES = new Set([
  "sequential_neural_network",
  "mixture_of_experts",
]);

const SHAPE_PRESERVING_LAYERS = new Set([
  "activation_layer",
  "alpha_dropout_layer",
  "batch_normalization",
  "dropout_layer",
  "gaussian_noise",
  "layer_normalization",
  "leakyReLU",
  "multihead_attention",
]);

const SEQUENCE_LAYERS = new Set(["gru_layer", "lstm_layer", "rnn_layer"]);

function positiveInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function parseDimensions(value) {
  const dimensions = String(value ?? "")
    .split(",")
    .map((dimension) => Number(dimension.trim()));
  return dimensions.length > 0 && dimensions.every(Number.isInteger)
    ? dimensions
    : null;
}

function shapeProduct(shape) {
  return shape.reduce((product, dimension) => product * dimension, 1);
}

function formatShape(shape) {
  if (!Array.isArray(shape)) return "?";
  if (shape.length === 0) return "scalar";
  return `[${shape.map((dimension) => dimension ?? "?").join(" × ")}]`;
}

function validSpatialOutput(inputSize, windowSize, stride, padding) {
  if (padding === "same") return Math.ceil(inputSize / stride);
  return Math.floor((inputSize - windowSize) / stride) + 1;
}

function result(shape, error = "") {
  return { shape, error };
}

function requireRank(block, inputShape, rank) {
  if (inputShape.length !== rank) {
    return result(null, `${block.type} expects a rank-${rank} input.`);
  }
  return null;
}

export function inferLayerShape(block, inputShape) {
  if (!Array.isArray(inputShape)) return result(null);
  if (SHAPE_PRESERVING_LAYERS.has(block.type)) return result([...inputShape]);

  switch (block.type) {
    case "dense_layer": {
      const units = positiveInteger(block.getFieldValue("UNITS"));
      if (!units) return result(null, "Dense units must be a positive integer.");
      if (inputShape.length === 0) return result(null, "Dense expects at least one input dimension.");
      return result([...inputShape.slice(0, -1), units]);
    }

    case "conv2d_layer":
    case "seperableConv2d": {
      const rankError = requireRank(block, inputShape, 3);
      if (rankError) return rankError;
      const filters = positiveInteger(block.getFieldValue("FILTERS"));
      const kernelSize = positiveInteger(block.getFieldValue("KERNEL_SIZE"));
      const stride = positiveInteger(block.getFieldValue("STRIDES"));
      if (!filters || !kernelSize || !stride) {
        return result(null, "Filters, kernel size, and strides must be positive integers.");
      }
      const padding = block.getFieldValue("PADDING");
      const height = validSpatialOutput(inputShape[0], kernelSize, stride, padding);
      const width = validSpatialOutput(inputShape[1], kernelSize, stride, padding);
      if (height < 1 || width < 1) return result(null, "The kernel is larger than the input.");
      return result([height, width, filters]);
    }

    case "max_pooling2d_layer": {
      const rankError = requireRank(block, inputShape, 3);
      if (rankError) return rankError;
      const poolSize = positiveInteger(block.getFieldValue("POOL_SIZE"));
      const stride = positiveInteger(block.getFieldValue("STRIDES"));
      if (!poolSize || !stride) return result(null, "Pool size and strides must be positive integers.");
      const height = validSpatialOutput(inputShape[0], poolSize, stride, "valid");
      const width = validSpatialOutput(inputShape[1], poolSize, stride, "valid");
      if (height < 1 || width < 1) return result(null, "The pool is larger than the input.");
      return result([height, width, inputShape[2]]);
    }

    case "flatten_layer":
      return result([shapeProduct(inputShape)]);

    case "GlobalAveragePooling2D": {
      const rankError = requireRank(block, inputShape, 3);
      return rankError ?? result([inputShape[2]]);
    }

    case "reshape_layer": {
      const requested = parseDimensions(block.getFieldValue("NEW_LAYER_FORMAT"));
      if (!requested || requested.some((dimension) => dimension === 0 || dimension < -1)) {
        return result(null, "Reshape dimensions must be positive integers with at most one -1.");
      }
      const inferredIndexes = requested
        .map((dimension, index) => dimension === -1 ? index : -1)
        .filter((index) => index !== -1);
      if (inferredIndexes.length > 1) return result(null, "Reshape can contain only one -1 dimension.");
      const inputSize = shapeProduct(inputShape);
      const knownSize = shapeProduct(requested.filter((dimension) => dimension !== -1));
      if (inferredIndexes.length === 1) {
        if (inputSize % knownSize !== 0) return result(null, "Reshape dimensions do not match the input size.");
        requested[inferredIndexes[0]] = inputSize / knownSize;
      } else if (knownSize !== inputSize) {
        return result(null, "Reshape dimensions do not match the input size.");
      }
      return result(requested);
    }

    case "permute_layer": {
      const dimensions = parseDimensions(block.getFieldValue("DIMS"));
      const expected = Array.from({ length: inputShape.length }, (_, index) => index + 1);
      const sorted = dimensions ? [...dimensions].sort((left, right) => left - right) : [];
      if (!dimensions || sorted.some((dimension, index) => dimension !== expected[index])) {
        return result(null, `Permute must contain each dimension from 1 to ${inputShape.length} once.`);
      }
      return result(dimensions.map((dimension) => inputShape[dimension - 1]));
    }

    case "up_sampling_2d": {
      const rankError = requireRank(block, inputShape, 3);
      if (rankError) return rankError;
      const size = parseDimensions(block.getFieldValue("SIZE"));
      if (!size || size.length !== 2 || size.some((dimension) => dimension < 1)) {
        return result(null, "Upsampling size must contain two positive integers.");
      }
      return result([inputShape[0] * size[0], inputShape[1] * size[1], inputShape[2]]);
    }

    case "embedding_layer": {
      const outputDimension = positiveInteger(block.getFieldValue("Output_Dim"));
      if (!outputDimension) return result(null, "Embedding output dimension must be positive.");
      return result([...inputShape, outputDimension]);
    }

    case "gru_layer":
    case "lstm_layer":
    case "rnn_layer": {
      const rankError = requireRank(block, inputShape, 2);
      if (rankError) return rankError;
      const units = positiveInteger(block.getFieldValue("UNITS"));
      if (!units) return result(null, "Recurrent units must be a positive integer.");
      const returnsSequences = block.getFieldValue("RETURN_SEQUENCES") === "TRUE";
      return result(returnsSequences ? [inputShape[0], units] : [units]);
    }

    default:
      return result([...inputShape]);
  }
}

function findModelBlock(layerBlock) {
  let block = layerBlock;
  while (block) {
    if (MODEL_TYPES.has(block.type)) return block;
    block = block.getSurroundParent?.() ?? block.getParent?.() ?? null;
  }
  return null;
}

function findTrainingBlock(modelBlock) {
  let block = modelBlock?.getParent?.() ?? null;
  while (block && block.type !== "train_model") block = block.getParent?.() ?? null;
  return block;
}

function datasetInputShape(datasetBlock) {
  switch (datasetBlock?.type) {
    case "mnist_dataset": return [28, 28, 1];
    case "xor_dataset": return [2];
    case "math_dataset": return [1];
    case "upload_dataset": return datasetBlock.getDatasetInputShape?.() ?? null;
    default: return null;
  }
}

function sequenceInputShape(modelBlock, inputShape) {
  let layer = modelBlock?.getInputTargetBlock?.("LAYERS") ?? null;
  while (layer && (SHAPE_PRESERVING_LAYERS.has(layer.type) || layer.type === "set_seed")) {
    layer = layer.getNextBlock?.() ?? null;
  }
  if (!SEQUENCE_LAYERS.has(layer?.type)) return inputShape;
  return inputShape.length === 1 ? [1, inputShape[0]] : inputShape.slice(0, 2);
}

function inferBadgeShape(layerBlock) {
  const modelBlock = findModelBlock(layerBlock);
  const trainingBlock = findTrainingBlock(modelBlock);
  const datasetBlock = trainingBlock?.getInputTargetBlock?.("DATASET") ?? null;
  const datasetShape = datasetInputShape(datasetBlock);
  if (!modelBlock || !datasetShape) return { input: null, output: null, error: "" };

  let currentShape = sequenceInputShape(modelBlock, datasetShape);
  let layer = modelBlock.getInputTargetBlock?.("LAYERS") ?? null;
  let priorError = "";

  while (layer) {
    if (layer.type === "set_seed") {
      layer = layer.getNextBlock?.() ?? null;
      continue;
    }
    const input = currentShape;
    const inferred = priorError ? result(null, priorError) : inferLayerShape(layer, input);
    if (layer === layerBlock) return { input, output: inferred.shape, error: inferred.error };
    currentShape = inferred.shape;
    priorError = inferred.error ? `Previous layer error: ${inferred.error}` : "";
    layer = layer.getNextBlock?.() ?? null;
  }

  return { input: null, output: null, error: "" };
}

export class FieldShapeBadge extends Blockly.Field {
  constructor(inShape = null, outShape = null) {
    super("");
    this.EDITABLE = false;
    this.SERIALIZABLE = false;
    this.inShape_ = inShape;
    this.outShape_ = outShape;
    this.error_ = "";
    this.workspace_ = null;
    this.workspaceListener_ = null;
    this.size_ = new Blockly.utils.Size(BADGE_MIN_WIDTH, BADGE_HEIGHT);
  }

  init() {
    super.init();
    const sourceBlock = this.getSourceBlock();
    if (!sourceBlock || sourceBlock.isInFlyout) return;
    this.workspace_ = sourceBlock.workspace;
    this.workspaceListener_ = (event) => {
      if (!event?.isUiEvent) this.refreshShape();
    };
    this.workspace_.addChangeListener(this.workspaceListener_);
    this.refreshShape();
  }

  initView() {
    super.initView();
    this.fieldGroup_?.classList.add("blocklyFieldShapeBadge");
    this.textElement_?.setAttribute("font-size", "11px");
    this.textElement_?.setAttribute("font-weight", "600");
    this.applyBadgeStyle_();
  }

  getText() {
    return `${formatShape(this.inShape_)} → ${this.error_ ? "error" : formatShape(this.outShape_)}`;
  }

  getAriaValue() {
    if (this.error_) return `Shape error: ${this.error_}`;
    return `Input shape ${formatShape(this.inShape_)}, output shape ${formatShape(this.outShape_)}`;
  }

  render_() {
    const text = this.getText();
    if (this.textContent_) this.textContent_.nodeValue = text;
    const width = Math.max(
      BADGE_MIN_WIDTH,
      Math.ceil(text.length * BADGE_CHARACTER_WIDTH + BADGE_HORIZONTAL_PADDING * 2),
    );
    this.size_.width = width;
    this.size_.height = BADGE_HEIGHT;
    if (this.borderRect_) {
      this.borderRect_.setAttribute("width", String(width));
      this.borderRect_.setAttribute("height", String(BADGE_HEIGHT));
      this.borderRect_.setAttribute("rx", String(BADGE_HEIGHT / 2));
      this.borderRect_.setAttribute("ry", String(BADGE_HEIGHT / 2));
    }
    if (this.textElement_) {
      this.textElement_.setAttribute("x", String(width / 2));
      this.textElement_.setAttribute("y", String(BADGE_HEIGHT / 2));
      this.textElement_.setAttribute("text-anchor", "middle");
      this.textElement_.setAttribute("dominant-baseline", "middle");
    }
  }

  setShape(inShape, outShape, error = "") {
    this.inShape_ = Array.isArray(inShape) ? [...inShape] : null;
    this.outShape_ = Array.isArray(outShape) ? [...outShape] : null;
    this.error_ = error || "";
    this.applyBadgeStyle_();
    this.setTooltip(this.error_ || this.getAriaValue());
    this.forceRerender();
  }

  refreshShape() {
    const sourceBlock = this.getSourceBlock();
    if (!sourceBlock || sourceBlock.isDisposed?.()) return;
    const { input, output, error } = inferBadgeShape(sourceBlock);
    this.setShape(input, output, error);
  }

  applyBadgeStyle_() {
    if (!this.borderRect_ || !this.textElement_) return;
    this.borderRect_.setAttribute("fill", this.error_ ? "#450a0a" : "#0f172a");
    this.borderRect_.setAttribute("stroke", this.error_ ? "#ef4444" : "#334155");
    this.borderRect_.setAttribute("stroke-width", "1.5");
    this.textElement_.setAttribute("fill", this.error_ ? "#fca5a5" : "#38bdf8");
  }

  dispose() {
    if (this.workspace_ && this.workspaceListener_) {
      this.workspace_.removeChangeListener(this.workspaceListener_);
    }
    this.workspace_ = null;
    this.workspaceListener_ = null;
    super.dispose();
  }

  static fromJson(options) {
    return new FieldShapeBadge(options?.inShape, options?.outShape);
  }
}

export function appendShapeBadge(block) {
  block.appendDummyInput("SHAPE")
    .setAlign(Blockly.inputs.Align.CENTRE)
    .appendField(new FieldShapeBadge(), "SHAPE_BADGE");
}

Blockly.fieldRegistry.register("fieldShapeBadge", FieldShapeBadge);
