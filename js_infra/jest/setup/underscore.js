import _ from "underscore";
import underscoreString from "underscore.string";

_.mixin(underscoreString.exports());

global._ = _;
