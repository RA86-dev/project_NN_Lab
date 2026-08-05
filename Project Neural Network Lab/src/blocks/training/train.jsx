import * as Blockly from "blockly";

Blockly.Blocks["train_model"] = {
  init: function () {

    this.appendValueInput("MODEL")
        .setCheck("MODEL")
        .appendField("Train Model")
        .appendField("Model:");

    this.appendValueInput("DATASET")
        .setCheck("DATASET")
        .appendField("Dataset:");

    this.appendDummyInput()
        .appendField("Epochs:")
        .appendField(
            new Blockly.FieldNumber(50, 1),
            "EPOCHS"
        );
    this.appendDummyInput()
        .appendField("Optimizer:")
        .appendField(
            new Blockly.FieldDropdown([
                ["Adam", "adam"],
                ["SGD", "sgd"],
                ["RMSprop", "rmsprop"],
                ["Adagrad", "adagrad"]
            ]),
            "OPTIMIZER"
        );


    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour("#a55b5b");
    this.setTooltip("Trains a neural network using a dataset");
    this.setHelpUrl("");
  }
};