import {ExcelComponent} from '@core/ExcelComponent'
import {$} from '@core/dom'

export class Formula extends ExcelComponent {
  static className = 'excel__formula'

  constructor($root, options) {
    super($root, {
      name: 'Formula',
      listeners: ['input', 'keydown'],
      subscribe: ['currentText'],
      ...options,
    });
  }

  toHTML() {
    return `
    <div class="info">fx</div>
      <div id="formula" class="input" contenteditable spellcheck="false"></div>
    `
  }
  init() {
    super.init()

    this.formula = this.$root.find('#formula')
    this.$on('table:selection', textCell => {
      this.formula.text(textCell.data.value)
    })
  }

  storeChanged({currentText}) {
    this.formula.text(currentText)
  }

  onInput(event) {
    this.$emit('formula:input', $(event.target).text())
  }

  onKeydown(event) {
    const keys = [
      'Enter',
      'Tab',
    ]

    const {key} = event
    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault()
      this.$emit('formula:enter', key)
    }
  }
}
