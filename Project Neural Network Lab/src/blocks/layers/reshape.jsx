
import * as Blockly from "blockly";
import { appendShapeBadge } from "../../custom_fields/FieldShapeBadge";

Blockly.Blocks["reshape_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Reshape Layer");
    this.appendDummyInput()
        .appendField(
            new Blockly.FieldTextInput("28,28,1"),
            "NEW_LAYER_FORMAT"
        )
    appendShapeBadge(this);
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("A reshape layer.");
    this.setHelpUrl("");
  }
};
