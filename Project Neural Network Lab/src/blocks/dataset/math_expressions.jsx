import * as Blockly from "blockly";

const MATH_COLOUR = "#4f86a8";
const MATH_EXPRESSION = "MATH_EXPRESSION";

Blockly.Blocks.math_number_value = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0), "VALUE");
    this.setOutput(true, MATH_EXPRESSION);
    this.setColour(MATH_COLOUR);
    this.setTooltip("A number used in a math dataset expression.");
  },
};

Blockly.Blocks.math_x_value = {
  init() {
    this.appendDummyInput().appendField("x");
    this.setOutput(true, MATH_EXPRESSION);
    this.setColour(MATH_COLOUR);
    this.setTooltip("The x value currently being generated.");
  },
};

Blockly.Blocks.math_arithmetic_value = {
  init() {
    this.appendValueInput("LEFT").setCheck(MATH_EXPRESSION);
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
      ["+", "ADD"],
      ["−", "SUBTRACT"],
      ["×", "MULTIPLY"],
      ["÷", "DIVIDE"],
      ["power", "POWER"],
    ]), "OPERATION");
    this.appendValueInput("RIGHT").setCheck(MATH_EXPRESSION);
    this.setInputsInline(true);
    this.setOutput(true, MATH_EXPRESSION);
    this.setColour(MATH_COLOUR);
    this.setTooltip("Combines two values using a TensorFlow arithmetic operation.");
  },
};

Blockly.Blocks.math_function_value = {
  init() {
    this.appendValueInput("VALUE")
      .setCheck(MATH_EXPRESSION)
      .appendField(new Blockly.FieldDropdown([
        ["absolute", "ABS"],
        ["exponential", "EXP"],
        ["natural log", "LOG"],
        ["square root", "SQRT"],
        ["square", "SQUARE"],
        ["sine", "SIN"],
        ["cosine", "COS"],
        ["tangent", "TAN"],
        ["tanh", "TANH"],
        ["sigmoid", "SIGMOID"],
      ]), "FUNCTION");
    this.setOutput(true, MATH_EXPRESSION);
    this.setColour(MATH_COLOUR);
    this.setTooltip("Applies a TensorFlow math function to a value.");
  },
};
