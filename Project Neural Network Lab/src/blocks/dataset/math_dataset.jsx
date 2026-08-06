import * as Blockly from "blockly";

Blockly.Blocks["math_dataset"] = {
  init: function () {
    this.appendDummyInput()
        .appendField("Math Dataset");

    this.appendValueInput("EQUATION")
        .setCheck("MATH_EXPRESSION")
        .appendField("y =");

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
            new Blockly.FieldNumber(100, 2),
            "POINTS"
        );

    this.setOutput(true, "DATASET");

    this.setColour("#5ba58c");
    this.setTooltip("Generates a dataset from connected math expression blocks");
  }
};
