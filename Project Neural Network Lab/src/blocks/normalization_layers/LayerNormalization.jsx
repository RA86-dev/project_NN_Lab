import * as Blockly from "blockly";

Blockly.Blocks["layer_normalization"] = {
  init: function () {

    this.appendDummyInput()
        .appendField(" Layer Normalization");

    
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#eaffa5");
    this.setTooltip("A layer normalization block");
    this.setHelpUrl("");
  }
};
