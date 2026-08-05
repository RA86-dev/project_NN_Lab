import * as Blockly from "blockly";

Blockly.Blocks["validate_model"] = {
  init() {
    this.appendDummyInput()
      .appendField("Validate model")
      .appendField("Model ID")
      .appendField(new Blockly.FieldTextInput("Model1"), "MODEL_ID");
    this.appendValueInput("DATASET")
      .setCheck("DATASET")
      .appendField("Dataset");
    this.appendDummyInput()
      .appendField("Samples")
      .appendField(new Blockly.FieldNumber(200, 1), "QUESTIONS");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#557a49");
    this.setTooltip("Evaluates a trained model against samples from a dataset.");
  },
};
