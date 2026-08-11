import * as Blockly from "blockly";
import { FieldActivation } from "../../custom_fields/activationMappedField";
import { KernelSizeField } from "../../custom_fields/KernelSizeField";

Blockly.Blocks["seperableConv2d"] = {
  init: function () {
    const activationPreview = new FieldActivation("relu");
    const kernelPreview = new KernelSizeField(3);

    this.appendDummyInput()
        .appendField("Separable Convolution 2D");
    this.appendDummyInput()
        .appendField("Filters: ")
        .appendField(
            new Blockly.FieldNumber(32, 1),
            "FILTERS"
        );
    this.appendDummyInput()
        .appendField("Kernel Size: ")
        .appendField(
            new Blockly.FieldNumber(3, 1, 5, 1, function (newValue) {
              kernelPreview.setValue(newValue);
            }),
            "KERNEL_SIZE"
        )
        .appendField(kernelPreview, "KERNEL_PREVIEW");
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
                ["Linear", "linear"],
                ["Sigmoid", "sigmoid"],
                ["Tanh", "tanh"]
            ], function (newValue) {
              activationPreview.setValue(newValue);
            }),
            "ACTIVATION"
        ).appendField(activationPreview, "PREVIEW");

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("2-D convolution with separable filters. Performs a depthwise spatial convolution followed by a pointwise channel-mixing convolution.");
    this.setHelpUrl("");
  }
};
