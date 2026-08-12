import * as Blockly from "blockly";
import { DropoutRate } from "../../custom_fields/DropoutRate";
import { appendShapeBadge } from "../../custom_fields/FieldShapeBadge";
Blockly.Blocks["dropout_layer"] = {
  init: function () {
    const graph_preview = new DropoutRate(0.5);


    this.appendDummyInput()
        .appendField(" Dropout Layer");

    this.appendDummyInput()
        .appendField("Dropout Rate:")
        .appendField(
          new Blockly.FieldNumber(0.5, 0, 1, 0.1, function (newValue) {
            graph_preview.setValue(newValue);
          }),
            "DROPOUT_RATE"
    ).appendField(
      graph_preview, "GRAPH_PREVIEW"
        );
    appendShapeBadge(this);

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#3048e4");
    this.setTooltip("A dropout layer for regularization");
    this.setHelpUrl("");
  }
};
