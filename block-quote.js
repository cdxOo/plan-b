function blockquote (callSite, ...args) {

    var base_indent = 0;
    // FIXME: replace might not be the most elegant way to do that
    callSite[0].replace(/^\s*\n(\s*)/, (m, white) => {
        base_indent = white.length;
    });

    // FIXME: theese escapes are so wierd, can we do better?
    var cut = new RegExp(`\\n\\s{${base_indent}}`, 'g');

    return (
        callSite
        .map((str, i) => {

            str = str.replace(cut, '\n');

            if (args[i] === undefined) {
                str += ''    
            }
            else {
                var local_indent = 0;
                // FIXME: replace might not be the most elegant way
                str.replace(/\n?(\s*)$/, (m, white) => {
                    local_indent = white.length;
                });

                var arg = args[i].replace(
                    /\n/g,
                    '\n' + ' '.repeat(local_indent)
                );

                str += arg;
            }

            return str;
        })
        .join('')
        .trim()
    )
}

module.exports = blockquote;
