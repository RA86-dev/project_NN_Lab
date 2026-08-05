import * as Blockly from "blockly";

Blockly.Blocks["dropout_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField(" Dropout Layer");

    this.appendDummyInput()
        .appendField("Dropout Rate:")
        .appendField(
            new Blockly.FieldNumber(0.5, 0, 1, 0.1),
            "DROPOUT_RATE"
        );

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#3048e4");
    this.setTooltip("A dropout layer for regularization");
    this.setHelpUrl("");
  }
};