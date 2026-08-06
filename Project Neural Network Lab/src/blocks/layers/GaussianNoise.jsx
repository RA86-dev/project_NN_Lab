import * as Blockly from "blockly";

Blockly.Blocks["gaussian_noise"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Gaussian Noise");
    this.appendDummyInput()
        .appendField("Standard Deviation:")
        .appendField(new Blockly.FieldNumber(0.1, 0, 1, 0.1), "STDDEV");
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#499300");
    this.setTooltip("Adds Gaussian noise to the input");
    this.setHelpUrl("");
  }
};