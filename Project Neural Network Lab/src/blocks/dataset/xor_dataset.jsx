import * as Blockly from "blockly";

Blockly.Blocks.xor_dataset = {
  init() {
    this.appendDummyInput()
      .appendField("XOR Dataset");

    this.appendDummyInput()
      .appendField("Samples:")
      .appendField(new Blockly.FieldNumber(400, 4, 10000, 4), "SAMPLES");

    this.setOutput(true, "DATASET");
    this.setColour("#5ba58c");
    this.setTooltip("Generates balanced XOR inputs and two-class labels.");
  },
};
