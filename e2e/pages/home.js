module.exports = {
    url() {
        return this.api.launchUrl + '/';
    },
    sections: {
        addNoteForm: {
            selector: 'form.add-note-form',
            elements: {
                titleField: 'input[name="title"]',
                descriptionField: 'textarea[name="description"]',
                submitButton: 'button[type="submit"]'
            },
            commands: [
                {
                    fillInAndSubmit({ title, description }) {
                        this.waitForElementVisible('@titleField', 5000)
                            .setValue('@titleField', title)
                            .setValue('@descriptionField', description)
                            .waitForElementVisible('@submitButton', 1000)
                            .click('@submitButton');

                        return this;
                    },
                    expectFieldsAreEmpty() {
                        this.waitForElementVisible('@titleField', 5000);
                        this.expect.element('@titleField').text.to.equal('');
                        this.expect
                            .element('@descriptionField')
                            .text.to.equal('');

                        return this;
                    }
                }
            ]
        },
        notesList: {
            selector: '.notes-list',
            elements: {
                note: '.note'
            },
            commands: [
                {
                    expectNumberOfNotes(expectedCount) {
                        this.waitForElementVisible('@note', 5000);
                        this.assert.elementsCount('@note', expectedCount);

                        return this;
                    }
                }
            ],
            sections: {
                note: {
                    selector: '.note',
                    elements: {
                        title: '.note-title',
                        description: '.note-description'
                    },
                    commands: [
                        {
                            expectText({ title, description }) {
                                this.waitForElementVisible('@title', 5000);
                                this.expect
                                    .element('@title')
                                    .text.to.equal(title);
                                this.expect
                                    .element('@description')
                                    .text.to.equal(description);

                                return this;
                            }
                        }
                    ]
                }
            }
        }
    }
};
