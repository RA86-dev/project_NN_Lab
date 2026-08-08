import * as Blockly from "blockly";

Blockly.Blocks["up_sampling_2d"] = {
  init: function () {

    this.appendDummyInput()
        .appendField("UpSampling 2D");

    this.appendDummyInput()
        .appendField("Size:")
        .appendField(
            new Blockly.FieldTextInput("2,2"),
            "SIZE"
        );
    this.appendDummyInput()
        .appendField("Interpolation: ")
        .appendField(
            new Blockly.FieldDropdown(
                [
                    ["Nearest","nearest"],
                    ["Bilinear","bilinear"]
                ]
            ),
            "INTERPOLATION"
        )
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#004dba");
    this.setTooltip("Upsampling layer for 2D inputs. Repeats the rows and columns of the data by size[0] and size[1] respectively");
  }
};