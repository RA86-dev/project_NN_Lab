import * as Blockly from "blockly";
import { FieldActivation } from "../../custom_fields/activationMappedField";
import { KernelSizeField } from "../../custom_fields/KernelSizeField";

Blockly.Blocks["conv2d_layer"] = {
  init: function () {
    const activationPreview = new FieldActivation("relu");
    const kernelPreview = new KernelSizeField(3);

    this.appendDummyInput()
        .appendField("Conv2D Layer");

    this.appendDummyInput()
        .appendField("Filters:")
        .appendField(
          new Blockly.FieldNumber(32, 1),
          "FILTERS"
        );

    this.appendDummyInput()
        .appendField("Kernel Size:")
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
          new Blockly.FieldDropdown(
            [
              ["ReLU", "relu"],
              ["Sigmoid", "sigmoid"],
              ["Softmax", "softmax"],
              ["Tanh", "tanh"],
              ["Default", "linear"]
            ],
            function (newValue) {
              activationPreview.setValue(newValue);
            }
          ),
          "ACTIVATION"
        )
        .appendField(activationPreview, "ACTIVATION_PREVIEW");

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("A 2D convolutional neural network layer");
    this.setHelpUrl("");
  }
};
