import * as Blockly from "blockly";
import { FieldActivation } from "../../custom_fields/activationMappedField";

Blockly.Blocks["activation_layer"] = {
  init: function () {
    const preview = new FieldActivation("elu");
    this.appendDummyInput()
        .appendField("Activation Layer");
    this.appendDummyInput()
        .appendField("Activation:")
        .appendField(
          new Blockly.FieldDropdown(
            [
              ["ELU", "elu"],
              ["Hard Sigmoid", "hardSigmoid"],
              ["Linear", "linear"],
              ["ReLU", "relu"],
              ["ReLU6", "relu6"],
              ["SELU", "selu"],
              ["Sigmoid", "sigmoid"],
              ["Softmax", "softmax"],
              ["Softplus", "softplus"],
              ["Softsign", "softsign"],
              ["Tanh", "tanh"],
            ],
            function (newValue) {
              preview.setValue(newValue);
            }
          ),
          "ACTIVATION"
        )
        .appendField(preview, "PREVIEW");
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");
    this.setColour("#5ba58c");
    this.setTooltip("Applies a non-linear activation function to the input data.");
    this.setHelpUrl("");
  },
};
