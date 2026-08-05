import * as Blockly from "blockly";

Blockly.Blocks["mnist_dataset"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("MNIST Dataset");


    this.appendDummyInput()
        .appendField("Classes:")
        .appendField(
            new Blockly.FieldNumber(10),
            "Classes"
        );
    this.appendDummyInput()
        .appendField("Normalize")
        .appendField(
            new Blockly.FieldCheckbox("TRUE"),
            "NORMALIZE"
        )
    this.appendDummyInput()
        .appendField("Split")
        .appendField(
            new Blockly.FieldDropdown([
                ['Training','TRAINING'],
                ['Testing','TESTING'],
                ['Both','BOTH']
            ]),
            "Split"
        )
    this.appendDummyInput()
        .appendField("Dataset Size")
        .appendField(
            new Blockly.FieldNumber(1000),
            "DATASET_SIZE"
        )
    this.setOutput(true, "DATASET");

    this.setColour("#5ba58c");
    this.setTooltip("Pulls MNIST (Number Recognition Dataset)");
  }
};