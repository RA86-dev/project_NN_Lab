import * as Blockly from "blockly";

Blockly.Blocks["gru_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("GRU Layer");

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

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#995ba5");
    this.setTooltip("Gated Recurrent Unit layer");
  }
};