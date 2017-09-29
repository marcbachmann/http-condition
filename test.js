const assert = require('assert')
const httpCondition = require('./')

const languages = ['de', 'fr', 'en']
const patterns = languages.map((l) => `url^:/${l}`)
const getLanguage = httpCondition(patterns, languages)

assert.equal(getLanguage({url: '/de/foo/bar'}), 'de')
assert.equal(getLanguage({url: '/en/foo/bar'}), 'en')
assert.equal(getLanguage({url: '/test/foo/bar'}), undefined)

// Boolean Expression
const useragents = ['user-agent*:mobile OR user-agent:tablet-app', 'user-agent:desktop']
const useragentsContent = [{isMobile: true}, {isDesktop: true}]
const getTargetDevice = httpCondition(useragents, useragentsContent)

function ua (val) { return {headers: {'user-agent': val}} }

assert.equal(getTargetDevice(ua('mobile')).isMobile, true)
assert.equal(getTargetDevice(ua('some other and mobile')).isMobile, true)
assert.equal(getTargetDevice(ua('mobile-app')).isMobile, true)
assert.equal(getTargetDevice(ua('tablet-app')).isMobile, true)
assert.equal(getTargetDevice(ua('desktop')).isMobile, undefined)
assert.equal(getTargetDevice(ua('desktop')).isDesktop, true)
