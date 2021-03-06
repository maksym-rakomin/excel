import {toInlineStyles} from '@core/utils';
import {defaultStyles} from '@/constants';
import {parse} from '@core/parse';

const CODES = {
  A: 65,
  Z: 90,
}

function createCell(state, row) {
  return function(params, col) {
    const id = `${row}:${col}`
    const data = state.dataState[id] || ''
    const styles = toInlineStyles({...defaultStyles, ...state.stylesState[id]})

    return `<div 
      class="cell" 
      data-col="${col}" 
      data-type="cell"
      data-id="${id}" 
      contenteditable
      data-value="${data}"
      style="${params.width} ${styles}"
      >${parse(data)}</div>
    `
  }
}

function toColumn({col, index, width}) {
  return `
    <div
      class ="column"
      data-type="resizeble"
      data-col="${index}"
      style="${width}"
    >
      ${col}
      <div class="col-resize" data-resize="col"></div>
    </div>
  `
}

function createRow(content, index, state = {}) {
  const resizeItem =
    index ? '<div class="row-resize" data-resize="row"></div>' : ''
  const resizebleRow =
    index ? `data-row="${index}"` : ''

  return `<div
            class="row"
            data-type="resizeble"
            ${resizebleRow}
            ${getHeightRow(index, state)}
          >
            <div class="row-info">
              ${index ? index: ''}
              ${resizeItem}
            </div>
            <div class="row-data">${content}</div> 
          </div>`
}

function toChar(el, index) {
  return String.fromCharCode( CODES.A + index)
}

function getWidthColumn(index, state) {
  return state[index] ? `width:${state[index]}px;` : ''
}

function getHeightRow(index, state) {
  return state[index] ? `style="height: ${state[index]}px;"` : ''
}

function widthFrom(state) {
  return function(col, index) {
    return {
      col, index, width: getWidthColumn(index, state.colState),
    }
  }
}

export function createTable(rowCount = 15, state = {}) {
  const colsCount = CODES.Z - CODES.A + 1
  const rows = []
  const cols = new Array(colsCount)
      .fill('')
      .map(toChar)
      .map(widthFrom(state))
      .map(toColumn)
      .join('')

  rows.push(createRow(cols, null))

  for (let row = 0; row < rowCount; row++) {
    const cells = new Array(colsCount)
        .fill('')
        .map(widthFrom(state))
        .map(createCell(state, row))
        .join('')
    rows.push(createRow(cells, row + 1, state.rowState))
  }
  return rows.join('')
}
