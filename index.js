module.exports = httpCondition

function httpCondition (patterns, values) {
  return toFunction(patterns.map(conditionToStatement.bind(null, values)), values)
}

function toFunction (conditions, values) {
  return new Function('values', [ // eslint-disable-line no-new-func
    'return function getRouteHandler (req) {',
    `  ${conditions.join('\n  ')}`,
    '}'
  ].join('\n'))(values)
}

function conditionToStatement (values, condition, i) {
  if (values && !Array.isArray(values)) throw new Error('The second argument must be an array')
  const booleanExpression = require('boolean-expression')
  if (!condition) return `return ${i}`
  const statement = booleanExpression(condition).toString(mapToken)
  if (!statement) throw new Error('Condition is empty')
  return `if (${statement}) return ${values ? `values[${i}]` : i}`
}

function mapToken (token) {
  const match = /^([a-zA-Z-]*)([$^*])?:(.*)$/.exec(token)
  if (match) return toCondition(match[1], match[2], match[3])
  throw new Error(
    `The token '${token}' does not contain a valid type.\n` +
    `Please use one of 'accept', 'url', 'accept-language', 'user-agent', 'url'`
  )
}

function toCondition (type, op, value) {
  if (type === 'accept') return selector(value, op, 'req.headers.accept')
  if (type === 'url') return selector(value, op, 'req.url')
  if (type === 'user-agent') return selector(value, op, 'req.headers["user-agent"]')
  if (type === 'accept-language') return selector(value, op, 'req.headers["accept-language"]')
}

function selector (_value, op, replacement) {
  const value = JSON.stringify(_value)
  if (op === '*') return `${replacement} && ${replacement}.indexOf(${value}) !== -1`
  if (op === '^') return `${replacement} && ${replacement}.startsWith(${value})`
  if (op === '$') return `${replacement} && ${replacement}.endsWith(${value})`
  return `${replacement} === ${value}`
}
