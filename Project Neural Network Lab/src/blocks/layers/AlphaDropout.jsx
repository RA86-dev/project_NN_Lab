import * as Blockly from "blockly";
import { DropoutRate } from "../../custom_fields/DropoutRate";
Blockly.Blocks["alpha_dropout_layer"] = {
  init: function () {
    const dropoutRateCanvas = new DropoutRate(0.5);

    this.appendDummyInput()
        .appendField("Alpha Dropout Layer");

    this.appendDummyInput()
        .appendField("Dropout Rate:")
        .appendField(
          new Blockly.FieldNumber(0.5, 0, 1, 0.1, function (newValue) {
            dropoutRateCanvas.setValue(newValue)
            }),
            "DROPOUT_RATE"
    ).appendField(
      dropoutRateCanvas, "DROPOUT_CANVAS"
        );

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#3048e4");
    this.setTooltip("Alpha Dropout preserves the mean and variance of SELU activations.");
    this.setHelpUrl("");
  }
};
