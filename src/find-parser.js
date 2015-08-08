// LICENSE : MIT
"use strict";
import {getPackageJSON} from "./package-util"
import ObjectAssign from "object-assign"
export const ParserTypes = {
    // https://github.com/babel/babel/tree/master/packages/babylon aka. using by Babel
    "Babylon": "Babylon",
    "Esprima": "Esprima",
    "Unknown": "Unknown"
};

function isBabylon(dependecies) {
    if (!dependecies) {
        return false;
    }
    var keys = Object.keys(dependecies);
    var matchName = /^babel|^babylon/i;
    return keys.some(function (key) {
        return matchName.test(key);
    });
}

export function findParserType() {
    var pkg = getPackageJSON(module.paths);
    if (!pkg) {
        return ParserTypes.Unknown;
    }
    var dependencies = ObjectAssign({}, pkg["dependencies"], pkg["devDependencies"]);
    var isBabel = isBabylon(dependencies);
    if (isBabel) {
        return ParserTypes.Babylon;
    }
    return ParserTypes.Unknown;
}