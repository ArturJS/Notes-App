module.exports = {
    'Add note'(browser) {
        const homePage = browser.page.home();
        const testNote = {
            title: 'Test title',
            description: 'Test description'
        };

        homePage
            .navigate()
            .section.addNoteForm.expectFieldsAreEmpty()
            .fillInAndSubmit(testNote)
            .expectFieldsAreEmpty();

        homePage.section.notesList.expectNumberOfNotes(1);

        homePage.section.notesList.section.note.expectText(testNote);

        browser.end();

        ////////////////////////////////////////

        // browser.url(browser.launch_url);

        // browser
        //     .setValue('form.add-note-form input[name="title"]', 'Test title')
        //     .setValue(
        //         'form.add-note-form textarea[name="description"]',
        //         'Test description'
        //     )
        //     .waitForElementVisible(
        //         // waitForElementVisible() is necessary for .click()
        //         'form.add-note-form button[type="submit"]',
        //         1000
        //     )
        //     .click('form.add-note-form button[type="submit"]');

        // browser.expect
        //     .element('form.add-note-form input[name="title"]')
        //     .text.to.equal('');

        // browser.expect
        //     .element('form.add-note-form textarea[name="description"]')
        //     .text.to.equal('');

        // browser
        //     .waitForElementVisible('.notes-list .note', 5000)
        //     .expect.element('.notes-list .note .note-title')
        //     .text.to.equal('Test title');

        // browser.expect
        //     .element('.notes-list .note .note-description')
        //     .text.to.equal('Test description');

        // browser.end();
    }
};
