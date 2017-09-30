# http-condition

Support conditions for http requests based on a simple dsl.
This is an attempt on simplifying some configurations/middlewares in a node server.

```js
const httpCondition = require('http-condition')

const languages = ['de', 'fr', 'en']
const patterns = languages.map((l) => `url^:/${l}`)
const getLanguage = httpCondition(patterns, languages)

function (req, res, next) {
  const language = getLanguage(req)
  // language is one of 'de', 'fr', 'en' or undefined if it doesn't match
}
```

Currently supported directives:
- 'accept' (only does string matching, no parsing & priorization)
- 'url'
- 'user-agent'
- 'accept-language' (only does string matching, no parsing & priorization)

Selectors:  
pattern: {{directive}}{{operator}}:{{value}}
- url*:url-that-contains-this
- url^:/url-that-starts-with-this
- url$:url-that-ends-with-this
- url:/url-that-exactly-matches

```js
const _ = require('lodash')
const httpCondition = require('http-condition')

// Allows more complex expressions. Check https://npm.im/boolean-expression
const languages = [
    ['url^:/de OR accept-language:de', {content: 'German content'}],
    ['url^:/en OR accept-language:en', {content: 'English content'}]
]

const getLanguage = httpCondition(_.map(languages, 0), _.map(languages, 1))

function (req, res, next) {
  const language = getLanguage(req)
  // language is one of
  //   {content: 'German content'}
  //   or
  //   {content: 'English content'}
}
```
