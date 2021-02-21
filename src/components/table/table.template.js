const CODES = {
  A: 65,
  Z: 90,
}

function createCell(_, col) {
  return `<div class="cell" data-col="${col}" contenteditable></div>`
}

function toColumn(col, index) {
  return `
    <div class ="column" data-type="resizeble" data-col="${index}">
      ${col}
      <div class="col-resize" data-resize="col"></div>
    </div>
  `
}

function createRow(content, index) {
  const resizeItem =
    index ? '<div class="row-resize" data-resize="row"></div>' : ''

  return `<div class="row" data-type="resizeble">
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

export function createTable(rowCount = 15) {
  const colsCount = CODES.Z - CODES.A + 1
  const rows = []
  const cols = new Array(colsCount)
      .fill('')
      .map(toChar)
      .map(toColumn)
      .join('')

  const emptyCols = new Array(colsCount)
      .fill('')
      .map(createCell)
      .join('')

  rows.push(createRow(cols, null))

  for (let i = 0; i < rowCount; i++) {
    rows.push(createRow(emptyCols, i + 1))
  }
  return rows.join('')
}