import * as Blockly from "blockly";

Blockly.Blocks["activation_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Activation Layer");


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
    this.setTooltip("A fully connected neural network layer");
    this.setHelpUrl("");
  }
};