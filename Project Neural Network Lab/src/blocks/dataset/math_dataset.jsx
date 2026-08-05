import * as Blockly from "blockly";

Blockly.Blocks["math_dataset"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("Math Dataset");

    this.appendDummyInput()
        .appendField("Equation:")
        .appendField(
            new Blockly.FieldTextInput("y = 2*x - 1"),
            "EQUATION"
        );

    this.appendDummyInput()
        .appendField("Minimum X:")
        .appendField(
            new Blockly.FieldNumber(-10),
            "MIN_X"
        );

    this.appendDummyInput()
        .appendField("Maximum X:")
        .appendField(
            new Blockly.FieldNumber(10),
            "MAX_X"
        );

    this.appendDummyInput()
        .appendField("Points:")
        .appendField(
            new Blockly.FieldNumber(100),
            "POINTS"
        );

    this.setOutput(true, "DATASET");

    this.setColour("#5ba58c");
    this.setTooltip("Generates a dataset from a mathematical equation");
  }
};