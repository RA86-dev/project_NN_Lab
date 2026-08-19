import * as Blockly from "blockly";

import { appendShapeBadge } from "../../custom_fields/FieldShapeBadge";

Blockly.Blocks["kimi_delta_attention"] = {
  init: function () {
    this.appendDummyInput()
        .appendField("KDA (Delta Attention)");

    this.appendDummyInput()
        .appendField("Model Dim:")
        .appendField(
            new Blockly.FieldNumber(64, 1),
            "DMODEL"
        );

    appendShapeBadge(this);

    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#9ca55b");
    this.setTooltip("Kimi Delta Attention — per-feature stateful attention with decay gating. Best for sequence modeling where the full context matters.");
    this.setHelpUrl("");
  }
};
