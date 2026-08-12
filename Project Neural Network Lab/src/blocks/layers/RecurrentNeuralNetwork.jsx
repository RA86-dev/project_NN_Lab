import * as Blockly from "blockly";
import { appendShapeBadge } from "../../custom_fields/FieldShapeBadge";

Blockly.Blocks["rnn_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("RNN Layer");

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
    appendShapeBadge(this);
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#004dba");
    this.setTooltip("Recurrent Neural Network layer");
  }
};
