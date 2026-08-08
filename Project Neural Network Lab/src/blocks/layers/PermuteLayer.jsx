
import * as Blockly from "blockly";

Blockly.Blocks["permute_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Permute Layer");
    this.appendDummyInput()
        .appendField("Dimension: ")
        .appendField(
            new Blockly.FieldTextInput("2,1"),
            "DIMS"
        );
    
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#0072a2");
    this.setTooltip("Permutes the dimensions of the input according to a given pattern. Useful for, e.g., connecting RNNs and convnets together.");
    this.setHelpUrl("");
  }
};
