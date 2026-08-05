
import * as Blockly from "blockly";

Blockly.Blocks["conv2d_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField(" Conv2D Layer");

    this.appendDummyInput()
        .appendField("Filters:")
        .appendField(
            new Blockly.FieldNumber(32, 1),
            "FILTERS"
        );

    this.appendDummyInput()
        .appendField("Kernel Size:")
        .appendField(
            new Blockly.FieldNumber(3, 1),
            "KERNEL_SIZE"
        );

    this.appendDummyInput()
        .appendField("Strides:")
        .appendField(
            new Blockly.FieldNumber(1, 1),
            "STRIDES"
        );

    this.appendDummyInput()
        .appendField("Padding:")
        .appendField(
            new Blockly.FieldDropdown([
                ["Same", "same"],
                ["Valid", "valid"]
            ]),
            "PADDING"
        );

    this.appendDummyInput()
        .appendField("Activation:")
        .appendField(
            new Blockly.FieldDropdown([
                ["ReLU", "relu"],
                ["Sigmoid", "sigmoid"],
                ["Softmax", "softmax"],
                ["Tanh", "tanh"],
                ["None", "linear"]
            ]),
            "ACTIVATION"
        );

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("A 2D convolutional neural network layer");
    this.setHelpUrl("");
  }
};
