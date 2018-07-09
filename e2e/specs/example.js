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
    'Add note': browser => {
        browser.url(browser.launch_url);

        browser
            .setValue('form.add-note-form input[name="title"]', 'Test title')
            .setValue(
                'form.add-note-form textarea[name="description"]',
                'Test description'
            )
            .waitForElementVisible(
                // waitForElementVisible() is necessary for .click()
                'form.add-note-form button[type="submit"]',
                1000
            )
            .click('form.add-note-form button[type="submit"]');

        browser.expect
            .element('form.add-note-form input[name="title"]')
            .text.to.equal('');

        browser.expect
            .element('form.add-note-form textarea[name="description"]')
            .text.to.equal('');

        browser
            .waitForElementVisible('.notes-list .note', 5000)
            .expect.element('.notes-list .note .note-title')
            .text.to.equal('Test title');

        browser.expect
            .element('.notes-list .note .note-description')
            .text.to.equal('Test description');

        browser.saveScreenshot(screenshotPath(browser)).end();
    }
};
