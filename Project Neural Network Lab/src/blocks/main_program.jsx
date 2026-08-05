import * as Blockly from "blockly";

Blockly.Blocks["main_program"] = {
  init: function () {
    this.appendStatementInput("STACK")
      .setCheck(null)
      .appendField("Main Program");

    this.setColour("#ffab19");
    this.setTooltip("Starting point of the AI program");
  }
};