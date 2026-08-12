import * as Blockly from "blockly";
import { appendShapeBadge } from "../../custom_fields/FieldShapeBadge";

Blockly.Blocks["batch_normalization"] = {
  init: function () {

    this.appendDummyInput()
        .appendField(" Batch Normalization");

    appendShapeBadge(this);
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#1f8546");
    this.setTooltip("A batch normalization block");
    this.setHelpUrl("");
  }
};
