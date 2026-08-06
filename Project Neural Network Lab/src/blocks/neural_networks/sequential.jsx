import * as Blockly from "blockly";

Blockly.Blocks["sequential_neural_network"] = {
  init: function () {
    this.appendDummyInput()
        .appendField("Sequential Neural Network");
    this.appendDummyInput()
        .appendField("Name:")
        .appendField(
          new Blockly.FieldTextInput("Model1"),
          "MODEL_NAME"
        );
    this.appendStatementInput("LAYERS")
        .setCheck("LAYER")
        .appendField("Layers");

    this.setOutput(true, "MODEL");

    this.setColour("#995ba5");
    this.setTooltip("A sequential neural network model");
    this.setHelpUrl("");
  }
};