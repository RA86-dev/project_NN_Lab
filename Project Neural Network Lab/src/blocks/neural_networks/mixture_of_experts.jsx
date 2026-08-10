import * as Blockly from "blockly";

Blockly.Blocks["mixture_of_experts"] = {
  init: function () {
    this.appendDummyInput()
        .appendField("Mixture of Experts Neural Network");
    this.appendDummyInput()
        .appendField("Name:")
        .appendField(
          new Blockly.FieldTextInput("Model1"),
          "MODEL_NAME"
        );
    this.appendDummyInput()
        .appendField("Number of Experts")
        .appendField(
            new Blockly.FieldNumber(2),
            "EXPERTS"
        )
    this.appendStatementInput("LAYERS")
        .setCheck("LAYER")
        .appendField("Layers");

    this.setOutput(true, "MODEL");


    this.setColour("#995ba5");
    this.setTooltip("A sequential neural network model");
    this.setHelpUrl("");
  }
};
