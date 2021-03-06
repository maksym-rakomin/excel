import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from '@/components/table/table.template';
import {resizeTable} from '@/components/table/table.resize';
import {TableSelection} from '@/components/table/TableSelection';
import {selectCell} from '@/components/table/table.select';
import {keyNavigation} from '@/components/table/table.keyNavigation';
import {nextSelector} from '@core/utils';
import {$} from '@core/dom';
import * as actions from '@/redux/actions';

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options,
    });
  }

  prepare() {
    this.selection = new TableSelection()
  }

  init() {
    super.init()
    const $cell = this.$root.find('[data-id="0:0"]')
    this.selection.select($cell)
    this.$emit('table:selection', $cell)

    this.$on('formula:input', text => {
      this.selection.current
          .attr('data-value', text)
          .text(text)
      this.updateTextInStore(text)
    })
    this.$on('formula:enter', key => {
      const id = this.selection.current.id(true)
      const $next = this.$root.find(nextSelector(key, id))
      this.selection.select($next)
      this.$emit('table:selection', $next)
    })
    this.$on('toolbar:applyStyle', (value) => {
      this.selection.applyStyle(value)
      this.$dispatch(actions.applyStyle({
        value,
        ids: this.selection.selectedIds,
      }))
    })
  }

  toHTML() {
    return createTable(20, this.store.getState())
  }

  async onMousedown(event) {
    selectCell(event, this)
    await resizeTable(event, this.$root)
  }

  onKeydown(event) {
    keyNavigation(event, this)
  }

  onInput(event) {
    const text = $(event.target).text()
    this.updateTextInStore(text)
  }

  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value,
    }))
  }
}
