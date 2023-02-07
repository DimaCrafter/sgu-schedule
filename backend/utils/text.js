exports.matchAll = (input, regex, onMatch) => {
    let match, offset = 0;
    while (match = regex.exec(input.substring(offset))) {
        onMatch(...match);
        offset += match.index + match[0].length;
    }
}
