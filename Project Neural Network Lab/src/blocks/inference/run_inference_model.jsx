import * as Blockly from "blockly";

Blockly.Blocks["text_inference_model"] = {
  init() {
    this.appendDummyInput()
      .appendField("⌨ Raw inference")
      .appendField("Model ID")
      .appendField(new Blockly.FieldTextInput("Model1"), "MODEL_ID");
    this.appendDummyInput()
      .appendField("Values")
      .appendField(new Blockly.FieldTextInput("1"), "INPUT_DATA");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#8a6a45");
    this.setTooltip("Runs inference from comma- or space-separated numeric values.");
  },
};

Blockly.Blocks["math_inference_model"] = {
  init() {
    this.appendDummyInput()
      .appendField("∑ Math inference")
      .appendField("Model ID")
      .appendField(new Blockly.FieldTextInput("Model1"), "MODEL_ID");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#8a6a45");
    this.setTooltip("Predicts y for one x value using a trained math model.");
  },
};

Blockly.Blocks["mnist_inference_model"] = {
  init() {
    this.appendDummyInput()
      .appendField("✎ MNIST drawing inference")
      .appendField("Model ID")
      .appendField(new Blockly.FieldTextInput("Model1"), "MODEL_ID");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#8a6a45");
    this.setTooltip("Opens a drawing pad in Output for digit inference.");
  },
};
