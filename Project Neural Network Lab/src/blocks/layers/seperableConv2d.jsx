import * as Blockly from "blockly";
import { FieldActivation } from "../../custom_fields/activationMappedField";

Blockly.Blocks["seperableConv2d"] = {
  init: function () {
    const preview = new FieldActivation("relu");
    this.appendDummyInput()
        .appendField("Separable Convolution 2D");
    this.appendDummyInput()
        .appendField("Filters: ")
        .appendField(
            new Blockly.FieldNumber(32, 1), // min value of 1
            "FILTERS"
        );
    this.appendDummyInput()
        .appendField("Kernel Size: ")
        .appendField(
            new Blockly.FieldNumber(3, 1),
            "KERNEL_SIZE"
        );
    this.appendDummyInput()
        .appendField("Strides:")
        .appendField(
            new Blockly.FieldNumber(1, 1), // Default stride is usually 1, not 3!
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
                ["Linear", "linear"],
                ["Sigmoid", "sigmoid"],
                ["Tanh", "tanh"]
            ], function (newValue) {
              preview.setValue("preview")
            }),
            "ACTIVATION"
        ).appendField(preview, "PREVIEW");

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("2-D convolution with separable filters. Performs a depthwise spatial convolution followed by a pointwise channel-mixing convolution.");
    this.setHelpUrl("");
  }
};
