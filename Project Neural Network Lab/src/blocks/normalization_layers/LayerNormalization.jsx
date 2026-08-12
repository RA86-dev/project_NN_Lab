import * as Blockly from "blockly";
import { appendShapeBadge } from "../../custom_fields/FieldShapeBadge";

Blockly.Blocks["layer_normalization"] = {
  init: function () {
    this.appendDummyInput()
        .appendField(" Layer Normalization");
    appendShapeBadge(this);
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#586c15");
    this.setTooltip("A layer normalization block");
    this.setHelpUrl("");
  }
};
