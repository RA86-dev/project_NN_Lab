import * as Blockly from 'blockly';

export class KernelSizeField extends Blockly.Field {
  constructor(value = 3) {
    super(Number(value) || 3);
    this.EDITABLE = false;
    this.SERIALIZABLE = false;
    this.size_ = new Blockly.utils.Size(72, 38);
    this.gridCells_ = [];
  }

  getText() {
    return '';
  }

  initView() {
    super.initView();
    this.fieldGroup_.classList.add('blocklyFieldKernelSize');
    this.borderRect_.setAttribute('display', 'none');
    this.textElement_.setAttribute('display', 'none');

    const previewGroup = Blockly.utils.dom.createSvgElement('g', {
      'class': 'kernelSizePreview'
    }, this.fieldGroup_);

    Blockly.utils.dom.createSvgElement('rect', {
      'class': 'kernelSizeCard',
      'rx': 7,
      'ry': 7,
      'x': 2,
      'y': 2,
      'width': 68,
      'height': 34
    }, previewGroup);

    this.gridCells_ = [];
    const gridSize = 5;
    const cellSize = 4.5;
    const spacing = 1.5;
    const gridWidth = gridSize * cellSize + (gridSize - 1) * spacing;
    const startX = (72 - gridWidth) / 2;
    const startY = (38 - gridWidth) / 2;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = Blockly.utils.dom.createSvgElement('rect', {
          'class': 'kernelSizeCell',
          'x': startX + c * (cellSize + spacing),
          'y': startY + r * (cellSize + spacing),
          'width': cellSize,
          'height': cellSize,
          'rx': 1
        }, previewGroup);

        this.gridCells_.push({
          element: cell,
          row: r,
          col: c
        });
      }
    }
    this.updateKernelGrid(this.getValue());
  }

  render_() {
    if (this.textElement_) {
      this.textElement_.style.display = 'none';
    }
    this.updateSize_();
  }

  doValueUpdate_(newValue) {
    const numericValue = parseInt(newValue, 10) || 3;
    super.doValueUpdate_(numericValue);
    this.updateKernelGrid(numericValue);
  }

  updateKernelGrid(kSize) {
    if (!this.gridCells_ || this.gridCells_.length === 0) return;
    const maxGrid = 5;
    const clampedK = Math.min(maxGrid, Math.max(1, kSize));
    const offset = Math.floor((maxGrid - clampedK) / 2);

    this.gridCells_.forEach(({ element, row, col }) => {
      const isInKernel =
        row >= offset && row < offset + clampedK &&
        col >= offset && col < offset + clampedK;

      element.classList.toggle('kernelSizeCellActive', isInKernel);
    });
  }

  updateSize_() {
    this.size_.width = 72;
    this.size_.height = 38;
  }
}

Blockly.fieldRegistry.register('fieldKernelSize', KernelSizeField);
