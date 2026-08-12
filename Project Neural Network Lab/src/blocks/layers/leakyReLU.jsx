import * as Blockly from "blockly";
import { appendShapeBadge } from "../../custom_fields/FieldShapeBadge";

Blockly.Blocks["leakyReLU"] = {
  init: function () {
    this.appendDummyInput()
        .appendField("Leaky ReLU Layer");
        
    this.appendDummyInput()
        .appendField("Alpha:")
        .appendField(
            new Blockly.FieldNumber(0.3, 0, 1, 0.1),
            "ALPHA"
        ); 
    appendShapeBadge(this);

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("A Leaky ReLU activation layer for neural networks.");
    this.setHelpUrl("");
  }
};
