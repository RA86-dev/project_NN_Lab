import * as Blockly from "blockly";

Blockly.Blocks["dense_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField(" Dense Layer");

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
                ['elu','elu'],
                ['Hard Sigmoid','hardSigmoid'],
                ['Linear','linear'],
                ['ReLU','relu'],
                ['ReLU6','relu6'],
                ['SELU','selu'],
                ['Sigmoid','sigmoid'],
                ['Softmax','softmax'],
                ['Softplus','softplus'],
                ['Softsign','softsign'],
                ['Tanh','tanh'],
                ['Swish','swish'],
                ['Mish','mish'],
                ['GELU','gelu'],
                ['GELU (New)','gelu_new']
            ]),
            "ACTIVATION"
        )

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("A fully connected neural network layer");
    this.setHelpUrl("");
  }
};