import reactMixin from "react-mixin";
import fluxMixin from "flummox/mixin";

export var flux = function(...args) {
  return function(cls) {
    var mix = fluxMixin(...args);
    return reactMixin.onClass(cls, mix)
  }
};
