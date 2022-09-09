// Setting up a polyfill for `ResizeObserver` that's sometimes used during tests.
global.ResizeObserver = require("resize-observer-polyfill");
