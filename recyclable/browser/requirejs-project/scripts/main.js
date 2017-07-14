/* global requirejs */
requirejs.config({
  // By default load any module IDs from scripts/app
  baseUrl: 'scripts/app'
})

// Start the main app logic.
requirejs(['lib/isnode', 'lib/trycatch', 'app'])
