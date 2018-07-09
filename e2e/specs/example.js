const path = require('path');

const screenshotPath = browser => {
    const dateTime = new Date()
        .toISOString()
        .split('.')[0]
        .replace(/:/g, '-');
    const fileName = `${browser.currentTest.module}-${dateTime}.png`;

    return path.resolve(
        path.join(
            browser.globals.test_settings.screenshots.path || '',
            fileName
        )
    );
};

module.exports = {
    'sample test': browser => {
        browser
            .url(browser.launch_url)
            .pause(1000)
            .saveScreenshot(screenshotPath(browser));

        browser
            .setValue('form.add-note-form input[name="title"]', 'Note title')
            .setValue(
                'form.add-note-form textarea[name="description"]',
                'Note description'
            )
            .click('form.add-note-form button[type="submit"]');

        browser.expect
            .element('form.add-note-form input[name="title"]')
            .text.to.equal('');

        // browser.expect
        //     .element('form.add-note-form textarea[name="description"]')
        //     .text.to.equal('');
        // .waitForElementVisible('.notes-list .note', 5000)
        // .expect.element('.notes-list .note .note-title')
        // .text.to.equal('Note title');

        // .expect.element('notes-list .note .note-description')
        // .text.to.equal('Note description')
        browser.saveScreenshot(screenshotPath(browser)).end();
    }
};
