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
    }
};
