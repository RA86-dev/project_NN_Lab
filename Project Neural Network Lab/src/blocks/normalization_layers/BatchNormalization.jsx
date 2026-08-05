import * as Blockly from "blockly";

Blockly.Blocks["batch_normalization"] = {
  init: function () {

    this.appendDummyInput()
        .appendField(" Batch Normalization");

    
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#54ff95");
    this.setTooltip("A batch normalization block");
    this.setHelpUrl("");
  }
};
