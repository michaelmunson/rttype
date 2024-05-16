"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
class Type {
    constructor(type) {
        this.type = type;
    }
}
exports.Type = Type;
(function (Type) {
    class Union extends Type {
        constructor(type) {
            super(type);
            this.__UNION__ = true;
        }
    }
    Type.Union = Union;
    class Optional extends Type {
        constructor(type) {
            super(type);
            this.__OPTIONAL__ = true;
        }
    }
    Type.Optional = Optional;
    class Integer extends Type {
        constructor(config) {
            super("number");
            this.__INTEGER__ = true;
            this.__config__ = config;
        }
    }
    Type.Integer = Integer;
    class Float extends Type {
        constructor(config) {
            super("number");
            this.__FLOAT__ = true;
            this.__config__ = config;
        }
    }
    Type.Float = Float;
    class Pattern extends Type {
        constructor(pattern) {
            super("string");
            this.__PATTERN__ = true;
            this.__pattern__ = pattern;
        }
    }
    Type.Pattern = Pattern;
    /**@wishlist
    export class Proto<T extends RtType.Core.Prototype<any>, V> extends Type<T> {
        private readonly __proto__ = true;
        constructor(type: T, subType:V) {
            super(type)
        }
    }
    */
})(Type || (exports.Type = Type = {}));
