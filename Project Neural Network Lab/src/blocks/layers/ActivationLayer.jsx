import * as Blockly from "blockly";

Blockly.Blocks["activation_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Activation Layer");

    // 'elu'|'hardSigmoid'|'linear'|'relu'|'relu6'| 'selu'|'sigmoid'|'softmax'|'softplus'|'softsign'|'tanh'|'swish'|'mish'|'gelu'|'gelu_new'
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
                ['Tanh', 'tanh']
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