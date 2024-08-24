/* eslint-disable no-extend-native */

String.prototype.format = function (replaceWith) {
    const input = this.toString();
    if (typeof replaceWith === 'undefined') {
        return input;
    }
    if (!Array.isArray(replaceWith)) {
        replaceWith = [replaceWith];
    }
    return input.replace(/(%s)\d/g, (a) => ((replaceWith as Array<number | string>)[parseInt(a.slice(2)) - 1] ?? "").toString());
};

export { };
