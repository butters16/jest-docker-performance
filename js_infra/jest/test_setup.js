import Enzyme from "enzyme";
import expect from "expect";
import Adapter from "enzyme-adapter-react-16";
import "regenerator-runtime/runtime";
import enzymeMatchers from "enzyme-matchers";
import "console-error-throws-error";
import "core-js/stable";

Enzyme.configure({ adapter: new Adapter() });

/* eslint-disable import/no-commonjs */

global.d3 = require("d3");
global.jQuery = require("jquery");

/* eslint-enable import/no-commonjs */


// from jest-enzyme: https://github.com/FormidableLabs/enzyme-matchers/blob/v6.0.2/packages/jest-enzyme/src/index.js#L24
// add methods!
const matchers = {};

Object.keys(enzymeMatchers).forEach(matcherKey => {
  const matcher = {
    [matcherKey](wrapper, ...args) {
      const result = enzymeMatchers[matcherKey].call(this, wrapper, ...args);

      let message = this.isNot ? result.negatedMessage : result.message;

      if (result.contextualInformation.expected) {
        message += `\n${this.utils.RECEIVED_COLOR(
            result.contextualInformation.expected
            )}`;
      }

      if (result.contextualInformation.actual) {
        message += `\n${this.utils.EXPECTED_COLOR(
            result.contextualInformation.actual
            )}`;
      }

      return {
        ...result,
        message: () => message,
      };
    },
  }[matcherKey];

  matchers[matcherKey] = matcher;
});

expect.extend(matchers);
