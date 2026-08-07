
import * as Blockly from "blockly";

Blockly.Blocks["flatten_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField(" Flatten Layer");

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("A layer that flattens data to make it more accepted between different types of layers.");
    this.setHelpUrl("");
  }
};
