import * as Blockly from "blockly";
import { appendShapeBadge } from "../../custom_fields/FieldShapeBadge";

Blockly.Blocks["prelu_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Parametric ReLU (PReLU)");

    this.appendDummyInput()
        .appendField("Alpha:")
        .appendField(
            new Blockly.FieldNumber(0.25, 0.01),
            "ALPHA"
        );

    appendShapeBadge(this);
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#ff5959");
    this.setTooltip("Parametric ReLU activation. Uses a fixed Alpha to scale negative inputs — works like Leaky ReLU but with user-configurable slope.");
    this.setHelpUrl("");
  }
};
