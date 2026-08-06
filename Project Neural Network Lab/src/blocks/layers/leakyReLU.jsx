import * as Blockly from "blockly";

Blockly.Blocks["leakyReLU"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Leaky ReLU Layer");
    this.appendDummyInput()
        .appendField(
            new Blockly.FieldNumber(0.3, 0, 1, 0.1)
        )
        

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("A fully connected neural network layer");
    this.setHelpUrl("");
  }
};