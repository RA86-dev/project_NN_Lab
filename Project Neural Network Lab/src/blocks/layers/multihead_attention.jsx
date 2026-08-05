import * as Blockly from "blockly";

Blockly.Blocks["multihead_attention"] = {
  init: function () {

    this.appendDummyInput()
        .appendField(" Multi-Head Attention");
    this.appendDummyInput()
        .appendField(" Heads:")
        .appendField(
            new Blockly.FieldNumber(8, 1),
            "HEADS"
        );
    this.appendDummyInput()
        .appendField("Key Dimensions:")
        .appendField(
            new Blockly.FieldNumber(64, 1),
            "DIMENSION"
        );

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#9ca55b");
    this.setTooltip("Multi-Head Attention Layer");
    this.setHelpUrl("");
  }
};