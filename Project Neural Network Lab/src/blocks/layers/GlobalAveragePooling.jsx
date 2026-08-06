// tf.layers.maxPooling2d({
//     poolSize: 2,
//     strides: 2
// })
import * as Blockly from "blockly";

Blockly.Blocks["GlobalAveragePooling2D"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Global Average Pooling 2D Layer");
        

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("A global average pooling 2D layer.");
    this.setHelpUrl("");
  }
};