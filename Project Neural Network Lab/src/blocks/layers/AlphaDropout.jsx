import * as Blockly from "blockly";

Blockly.Blocks["alpha_dropout_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Alpha Dropout Layer");

    this.appendDummyInput()
        .appendField("Dropout Rate:")
        .appendField(
            new Blockly.FieldNumber(0.5, 0, 1, 0.1),
            "DROPOUT_RATE"
        );

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#3048e4");
    this.setTooltip("Alpha Dropout preserves the mean and variance of SELU activations.");
    this.setHelpUrl("");
  }
};
