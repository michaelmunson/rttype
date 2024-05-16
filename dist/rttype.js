"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RtType = void 0;
var RtType;
(function (RtType) {
    let Core;
    (function (Core) {
        let Basic;
        (function (Basic) {
            Basic.types = ["string", "number", "bigint", "boolean", "symbol", "undefined", "object", "function"];
            function isBaseType(data) {
                return [...Basic.types].includes(data);
            }
            Basic.isBaseType = isBaseType;
        })(Basic = Core.Basic || (Core.Basic = {}));
    })(Core = RtType.Core || (RtType.Core = {}));
})(RtType || (exports.RtType = RtType = {}));
