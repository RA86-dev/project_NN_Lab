import * as Blockly from "blockly";

import { FieldActivation } from "../../custom_fields/activationMappedField";
import { appendShapeBadge } from "../../custom_fields/FieldShapeBadge";

Blockly.Blocks["lstm_layer"] = {
  init: function () {
    const preview = new FieldActivation("elu");

    this.appendDummyInput()
        .appendField("LSTM Layer");

    this.appendDummyInput()
        .appendField("Units:")
        .appendField(
            new Blockly.FieldNumber(128),
            "UNITS"
        );

    this.appendDummyInput()
        .appendField("Return Sequences:")
        .appendField(
            new Blockly.FieldCheckbox(false),
            "RETURN_SEQUENCES"
        );
    this.appendDummyInput()
    .appendField("Activation:")
    .appendField(
        new Blockly.FieldDropdown([
            ['ELU', 'elu'],
            ['Hard Sigmoid', 'hardSigmoid'],
            ['Linear', 'linear'],
            ['ReLU', 'relu'],
            ['ReLU6', 'relu6'],
            ['SELU', 'selu'],
            ['Sigmoid', 'sigmoid'],
            ['Softmax', 'softmax'],
            ['Softplus', 'softplus'],
            ['Softsign', 'softsign'],
            ['Tanh', 'tanh']
        ], function (newValue) {
          preview.setValue(newValue)
        }),
        "ACTIVATION"
    ).appendField(preview, "PREVIEW");
    appendShapeBadge(this);
    this.setPreviousStatement(true, "LAYER");
    this.setNextStatement(true, "LAYER");

    this.setColour("#a5895b");
    this.setTooltip("Long Short-Term Memory layer");
  }
};
