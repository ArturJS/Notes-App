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
    },
    'Add note validation'(browser) {
        const homePage = browser.page.home();
        const testNote = {
            title: '',
            description: ''
        };

        homePage
            .navigate()
            .section.addNoteForm.expectFieldsAreEmpty()
            .assert.elementNotPresent('@titleError')
            .assert.elementNotPresent('@descriptionError')
            .fillInAndSubmit(testNote);

        homePage.section.addNoteForm
            .waitForElementVisible('@titleError', 1000)
            .expect.element('@titleError')
            .text.to.equal('Please enter title');

        homePage.section.addNoteForm
            .waitForElementVisible('@descriptionError', 1000)
            .expect.element('@descriptionError')
            .text.to.equal('Please enter description');
    }
};
