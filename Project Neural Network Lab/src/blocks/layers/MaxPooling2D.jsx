// tf.layers.maxPooling2d({
//     poolSize: 2,
//     strides: 2
// })
import * as Blockly from "blockly";
import { appendShapeBadge } from "../../custom_fields/FieldShapeBadge";

Blockly.Blocks["max_pooling2d_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Max Pooling 2D Layer");
    this.appendDummyInput()
        .appendField("Pool Size:")
        .appendField(
            new Blockly.FieldNumber(2, 1, null, null),
            "POOL_SIZE"
        );
    this.appendDummyInput()
        .appendField("Strides:")
        .appendField(
            new Blockly.FieldNumber(2, 1, null, null),
            "STRIDES"
        );
    appendShapeBadge(this);

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("A fully connected neural network layer");
    this.setHelpUrl("");
  }
};
