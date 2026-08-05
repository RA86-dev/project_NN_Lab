import * as Blockly from "blockly";

Blockly.Blocks["batch_normalization"] = {
  init: function () {

    this.appendDummyInput()
        .appendField(" Batch Normalization");

    
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#1f8546");
    this.setTooltip("A batch normalization block");
    this.setHelpUrl("");
  }
};
