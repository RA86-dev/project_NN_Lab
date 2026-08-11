import * as Blockly from 'blockly';

export class DropoutRate extends Blockly.Field {
  constructor(value = 0.2) {
    super(Number(value) || 0.2);
    this.SERIALIZABLE = true;
    this.size_ = new Blockly.utils.Size(44, 22);
    this.circles_ = [];
  }
  getText() {
    return '';
  }

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
    this.circles_ = [];
    const cols = 4;
    const rows = 2;
    const startX = 8;
    const startY = 6;
    const spacingX = 8;
    const spacingY = 8;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const circle = Blockly.utils.dom.createSvgElement('circle', {
          'cx': startX + c * spacingX,
          'cy': startY + r * spacingY,
          'r': 2.5,
          'fill': '#38bdf8'
        }, this.fieldGroup_);

        this.circles_.push(circle);
      }
    }
    this.updateDotGrid(this.getValue());
  }
  render_() {
    if (this.textElement_) {
      this.textElement_.style.display = 'none';
    }
    this.updateSize_();
  }
  doValueUpdate_(newValue) {
    const numericValue = parseFloat(newValue) || 0;
    super.doValueUpdate_(numericValue);
    this.updateDotGrid(numericValue);
  }

  updateDotGrid(rate) {
    if (!this.circles_ || this.circles_.length === 0) return;

    const totalDots = this.circles_.length;
    const disabledCount = Math.round(rate * totalDots);

    this.circles_.forEach((circle, index) => {
      if (index < disabledCount) {
        circle.setAttribute('fill', '#334155');
        circle.setAttribute('opacity', '0.4');
      } else {
        circle.setAttribute('fill', '#38bdf8');
        circle.setAttribute('opacity', '1.0');
      }
    });
  }

  updateSize_() {
    this.size_.width = 44;
    this.size_.height = 22;
  }
}

Blockly.fieldRegistry.register('fieldDropout', DropoutRate);
