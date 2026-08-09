import * as Blockly from "blockly";

Blockly.Blocks["set_seed"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Set Global Seed");
    this.appendDummyInput()
        .appendField("Seed:")
        .appendField(
            new Blockly.FieldNumber(42),
            "SEED"
        );

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");
    this.setColour("#5ba58c");
    this.setTooltip("A fully connected neural network layer");
    this.setHelpUrl("");
  }
};