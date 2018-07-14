exports.assertion = function(selector, count, message = null) {
    if (Array.isArray(selector)) {
        // combine page object CSS selectors
        selector = selector.map(s => s.selector).join(' ');
    }

    this.message =
        message || 'Testing if element <' + selector + '> has count: ' + count;

    this.expected = count;

    this.pass = value => value === this.expected;
    this.value = result => result.value;

    this.command = callback => {
        // Remember! The first argument of `execute` must be not an arrow function!

        return this.api.execute(
            function(selector) {
                return document.querySelectorAll(selector).length;
            },
            [selector],
            result => callback.call(this, result)
        );
    };
};
