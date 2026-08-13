import * as Blockly from "blockly";
import { FieldActivation } from "../../custom_fields/activationMappedField";
import { appendShapeBadge } from "../../custom_fields/FieldShapeBadge";

Blockly.Blocks["dense_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField(" Dense Layer");
    const preview = new FieldActivation("elu");

    this.appendDummyInput()
        .appendField("Neurons:")
        .appendField(
            new Blockly.FieldNumber(128, 1),
            "UNITS"
        );

    this.appendDummyInput()
      .appendField("Activation:")
      .appendField(
        new Blockly.FieldDropdown([
          ['ELU', 'elu'],
          ['Hard Sigmoid', 'hardSigmoid'],
          ['Linear', 'linear'],
          ['ReLU', 'relu'],
          ['ReLU6', 'relu6'],
          ['SELU', 'selu'],
          ['Sigmoid', 'sigmoid'],
          ['Softmax', 'softmax'],
          ['Softplus', 'softplus'],
          ['Softsign', 'softsign'],
          ['Tanh', 'tanh'],
          ['GELU', 'gelu']
        ],
          function (newValue) {
            preview.setValue(newValue);
        }),
        "ACTIVATION",
      ).appendField(preview, "PREVIEW");

    appendShapeBadge(this);

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("A fully connected neural network layer");
    this.setHelpUrl("");
  }
};
