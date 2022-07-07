"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOptkey = getOptkey;
exports.getOptid = getOptid;
exports.getOptUniqueId = getOptUniqueId;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOptkey(_vm) {
  return _vm.optId || '_XID';
}

function getOptid(_vm, option) {
  var optid = option[getOptkey(_vm)];
  return optid ? encodeURIComponent(optid) : '';
}

function getOptUniqueId() {
  return _xeUtils.default.uniqueId('opt_');
}