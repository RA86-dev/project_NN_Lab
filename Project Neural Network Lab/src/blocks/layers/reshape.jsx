
import * as Blockly from "blockly";

Blockly.Blocks["reshape_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Reshape Layer");
    this.appendDummyInput()
        .appendField(
            new Blockly.FieldTextInput("28,28,1")
        )
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("A reshape layer.");
    this.setHelpUrl("");
  }
};