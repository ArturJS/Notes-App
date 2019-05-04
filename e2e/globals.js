const video = require('nightwatch-video-recorder');

module.exports = {
    beforeEach: function(browser, done) {
        video.start(browser, done);
    },
    afterEach: function(browser, done) {
        video.stop(browser, done);
    }
};
