import * as Blockly from 'blockly';

function generateActivationSvg(type, alpha = 1.0) {
  const width = 40;
  const height = 20;
  let points = [];

  const point_count = 25;

  for (let i = 0; i <= point_count; i++) {
    const x = -3 + (i / point_count) * 6;
    let y;

    switch (type) {
      case 'elu':
        y = x > 0 ? x : alpha * (Math.exp(x) - 1);
        break;
      case 'hardSigmoid':
        if (x < -2.5) { y = 0; }
        else if (x > 2.5) { y = 1; }
        else { y = 0.2 * x + 0.5; }
        break;
      case 'linear':
        y = x;
        break;
      case 'relu':
        y = Math.max(0, x);
        break;
      case 'relu6':
        y = Math.min(Math.max(0, x), 6);
        break;
      case 'selu': {
        const SELU_LAMBDA = 1.0507009873554805;
        const SELU_ALPHA = 1.6732632423543772;
        y = x > 0 ? SELU_LAMBDA * x : SELU_LAMBDA * SELU_ALPHA * (Math.exp(x) - 1);
        break;
      }
      case 'sigmoid':
        y = 1 / (1 + Math.exp(-x)); // Fixed typo here
        break;
      case 'softmax':
        y = 1 / (1 + Math.exp(-x));
        break;
      case 'softplus':
        y = Math.log(1 + Math.exp(x));
        break;
      case 'softsign':
        y = x / (1 + Math.abs(x));
        break;
      case 'gelu': {
        const sigma = 1 / (1 + Math.exp(-1.6 * x));
        y = x * sigma;
        break;
      }
      case 'tanh':
        y = Math.tanh(x);
        break;
      default:
        y = 0;
        break;
    }

    const X_Coords = (i / point_count) * width;
    let minY = -1.5;
    let maxY = 3.0;
    let normal_Y = (y - minY) / (maxY - minY);
    let clampedY = Math.max(0, Math.min(1, normal_Y));
    let svgHeight = height - (clampedY * height);

    points.push(`${X_Coords.toFixed(1)},${svgHeight.toFixed(1)}`);
  }

  return `M ${points.join(' L ')}`;
}

export class FieldActivation extends Blockly.Field {
  constructor(value = 'relu') {
    super(value);
    this.SERIALIZABLE = true;
    this.size_ = new Blockly.utils.Size(44, 22);
  }
  getText() {return ''}
  initView() {
      super.initView();
      this.rect_ = Blockly.utils.dom.createSvgElement('rect', {
        'rx': 4,
        'ry': 4,
        'x': 0,
        'y': 0,
        'width': 40,
        'height': 20,
        'fill': '#0f172a',
        'stroke': '#334155',
        'stroke-width': '1'
      }, this.fieldGroup_);

      this.path_ = Blockly.utils.dom.createSvgElement('path', {
        'd': generateActivationSvg(this.getValue()),
        'stroke': '#38bdf8',
        'stroke-width': '2',
        'fill': 'none'
      }, this.fieldGroup_);
    }
  doValueUpdate_(newValue) {
    super.doValueUpdate_(newValue);
    if (!this.path_) { return; }
    const pathData = generateActivationSvg(newValue);
    this.path_.setAttribute('d', pathData);
  }

  updateSize_() {
    this.size_.width = 44;
    this.size_.height = 22;
  }
}

Blockly.fieldRegistry.register('fieldActivation', FieldActivation);
