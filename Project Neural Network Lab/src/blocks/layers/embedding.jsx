import * as Blockly from "blockly";

Blockly.Blocks["embedding_layer"] = {
  init: function () {

    this.appendDummyInput()
        .appendField(" Embedding Layer");

    this.appendDummyInput()
        .appendField("Embedding Dimension") // What is a DIM?
        .appendField(
            new Blockly.FieldNumber(10000, 1),
            "Dimensions"
        );
    this.appendDummyInput()
        .appendField("Output Dimension")
        .appendField(
            new Blockly.FieldNumber(128, 1),
            "Output_Dim"
        );
    this.appendDummyInput()
        .appendField("Input Length")
        .appendField(
            new Blockly.FieldNumber(100, 1),
            "Input Length"
        );

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#5ba58c");
    this.setTooltip("An embedding layer for converting integers to dense vectors");
    this.setHelpUrl("");
  }
};