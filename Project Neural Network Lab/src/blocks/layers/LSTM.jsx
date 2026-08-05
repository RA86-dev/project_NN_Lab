import * as Blockly from "blockly";

Blockly.Blocks["lstm_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("LSTM Layer");

    this.appendDummyInput()
        .appendField("Units:")
        .appendField(
            new Blockly.FieldNumber(128),
            "UNITS"
        );

    this.appendDummyInput()
        .appendField("Return Sequences:")
        .appendField(
            new Blockly.FieldCheckbox(false),
            "RETURN_SEQUENCES"
        );
    this.appendDummyInput()
    .appendField("Activation:")
    .appendField(
        new Blockly.FieldDropdown([
            ["tanh", "tanh"],
            ["relu", "relu"],
            ["sigmoid", "sigmoid"]
        ]),
        "ACTIVATION"
    );
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#a5895b");
    this.setTooltip("Long Short-Term Memory layer");
  }
};