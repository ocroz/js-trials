const isNode = function () { try { return this === global } catch (e) { return false } }
const isBrowser = function () { try { return this === window } catch (e) { return false } }

module.exports = { isNode, isBrowser }
