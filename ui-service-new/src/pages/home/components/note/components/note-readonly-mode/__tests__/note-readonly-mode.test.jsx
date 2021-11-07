jest.mock('~/common/features/modal', () => ({
    modalProvider: {
        showConfirm: jest.fn()
    }
}));
jest.mock('../../../../file-list', () => props => (
    <div className="file-list">{JSON.stringify(props, null, '  ')}</div>
));

/* eslint-disable import/first */
import { mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import { modalProvider } from '~/common/features/modal';
import NoteReadonlyMode from '../note-readonly-mode';
/* eslint-enable import/first */

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

describe('<NoteReadonlyMode />', () => {
    it('renders correctly', () => {
        const note = {
            id: 1,
            title: 'Note test title',
            description: 'Note test description',
            files: [
                {
                    id: 12,
                    downloadPath: '/test/download/path',
                    filename: 'file name'
                }
            ],
            trackId: '1',
            meta: {
                transactionId: 1
            }
        };
        const tree = renderer
            .create(
                <NoteReadonlyMode
                    note={note}
                    onRemove={() => {}}
                    onEdit={() => {}}
                />
            )
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it("wraps url's in description correctly", () => {
        const note = {
            id: 1,
            title: 'Note test title',
            description: 'http://google.com and https://ya.ru/',
            files: [],
            trackId: '1'
        };
        const wrapper = mount(
            <NoteReadonlyMode
                note={note}
                onRemove={() => {}}
                onEdit={() => {}}
            />
        );

        expect(wrapper.find('.note-description').html()).toBe(
            [
                '<div class="note-description">',
                '<a ',
                'href="http://google.com" ',
                'class="note-link" ',
                'target="_blank" ',
                'rel="nofollow noopener">http://google.com</a>',
                ' and ',
                '<a ',
                'href="https://ya.ru/" ',
                'class="note-link" ',
                'target="_blank" ',
                'rel="nofollow noopener">https://ya.ru/</a>',
                '</div>'
            ].join('')
        );
    });

    describe('test isLoading state', () => {
        it('should have `isLoading` class when note has `meta.transactionId`', () => {
            const note = {
                id: 1,
                title: 'Note test title',
                description: 'Note test description',
                files: [
                    {
                        id: 12,
                        downloadPath: '/test/download/path',
                        filename: 'file name'
                    }
                ],
                trackId: '1',
                meta: {
                    transactionId: 1
                }
            };
            const wrapper = mount(
                <NoteReadonlyMode
                    note={note}
                    onRemove={() => {}}
                    onEdit={() => {}}
                />
            );

            expect(wrapper.render().hasClass('isLoading')).toBe(true);
        });

        it('should NOT have `isLoading` class when note do NOT have `meta.transactionId`', () => {
            const note = {
                id: 1,
                title: 'Note test title',
                description: 'Note test description',
                files: [
                    {
                        id: 12,
                        downloadPath: '/test/download/path',
                        filename: 'file name'
                    }
                ],
                trackId: '1'
            };
            const wrapper = mount(
                <NoteReadonlyMode
                    note={note}
                    onRemove={() => {}}
                    onEdit={() => {}}
                />
            );

            expect(wrapper.render().hasClass('isLoading')).toBe(false);
        });
    });

    describe('`onEdit` prop', () => {
        describe('it should be called after ', () => {
            it('clicked by .icon-left', () => {
                const note = {
                    id: 1,
                    title: 'Note test title',
                    description: 'Note test description',
                    files: [
                        {
                            id: 12,
                            downloadPath: '/test/download/path',
                            filename: 'file name'
                        }
                    ],
                    trackId: '1'
                };
                const onEdit = jest.fn();
                const wrapper = mount(
                    <NoteReadonlyMode
                        note={note}
                        onRemove={() => {}}
                        onEdit={onEdit}
                    />
                );

                wrapper.find('.icon-left').simulate('click');

                expect(onEdit).toHaveBeenCalledWith();
            });

            it('keyPressed by .icon-left', () => {
                const note = {
                    id: 1,
                    title: 'Note test title',
                    description: 'Note test description',
                    files: [
                        {
                            id: 12,
                            downloadPath: '/test/download/path',
                            filename: 'file name'
                        }
                    ],
                    trackId: '1'
                };
                const onEdit = jest.fn();
                const wrapper = mount(
                    <NoteReadonlyMode
                        note={note}
                        onRemove={() => {}}
                        onEdit={onEdit}
                    />
                );

                wrapper.find('.icon-left').simulate('keyPress');

                expect(onEdit).toHaveBeenCalledWith();
            });
        });

        describe('it should NOT be called (if isLoading) after ', () => {
            it('clicked by .icon-left', () => {
                const note = {
                    id: 1,
                    title: 'Note test title',
                    description: 'Note test description',
                    files: [
                        {
                            id: 12,
                            downloadPath: '/test/download/path',
                            filename: 'file name'
                        }
                    ],
                    trackId: '1',
                    meta: {
                        transactionId: 1
                    }
                };
                const onEdit = jest.fn();
                const wrapper = mount(
                    <NoteReadonlyMode
                        note={note}
                        onRemove={() => {}}
                        onEdit={onEdit}
                    />
                );

                wrapper.find('.icon-left').simulate('click');

                expect(onEdit).not.toHaveBeenCalledWith();
            });

            it('keyPressed by .icon-left', () => {
                const note = {
                    id: 1,
                    title: 'Note test title',
                    description: 'Note test description',
                    files: [
                        {
                            id: 12,
                            downloadPath: '/test/download/path',
                            filename: 'file name'
                        }
                    ],
                    trackId: '1',
                    meta: {
                        transactionId: 1
                    }
                };
                const onEdit = jest.fn();
                const wrapper = mount(
                    <NoteReadonlyMode
                        note={note}
                        onRemove={() => {}}
                        onEdit={onEdit}
                    />
                );

                wrapper.find('.icon-left').simulate('keyPress');

                expect(onEdit).not.toHaveBeenCalledWith();
            });
        });
    });

    describe('`onRemove` prop', () => {
        describe('it should be called after ', () => {
            it('clicked by .icon-right and modalProvider.showConfirm(...) confirms action', async () => {
                const note = {
                    id: 132,
                    title: 'Note test title',
                    description: 'Note test description',
                    files: [
                        {
                            id: 12,
                            downloadPath: '/test/download/path',
                            filename: 'file name'
                        }
                    ],
                    trackId: '1'
                };
                const onRemove = jest.fn();

                modalProvider.showConfirm.mockImplementation(() => ({
                    result: Promise.resolve(true)
                }));

                const wrapper = mount(
                    <NoteReadonlyMode
                        note={note}
                        onRemove={onRemove}
                        onEdit={() => {}}
                    />
                );

                wrapper.find('.icon-right').simulate('click');

                await flushPromises();

                expect(onRemove).toHaveBeenCalledWith(note.id);
            });

            it('keyPressed by .icon-right and modalProvider.showConfirm(...) confirms action', async () => {
                const note = {
                    id: 132,
                    title: 'Note test title',
                    description: 'Note test description',
                    files: [
                        {
                            id: 12,
                            downloadPath: '/test/download/path',
                            filename: 'file name'
                        }
                    ],
                    trackId: '1'
                };
                const onRemove = jest.fn();

                modalProvider.showConfirm.mockImplementation(() => ({
                    result: Promise.resolve(true)
                }));

                const wrapper = mount(
                    <NoteReadonlyMode
                        note={note}
                        onRemove={onRemove}
                        onEdit={() => {}}
                    />
                );

                wrapper.find('.icon-right').simulate('keyPress');

                await flushPromises();

                expect(onRemove).toHaveBeenCalledWith(note.id);
            });
        });

        describe('it should NOT be called after ', () => {
            describe('when isLoading and after ', () => {
                it('clicked by .icon-right and modalProvider.showConfirm(...) confirms action', async () => {
                    const note = {
                        id: 132,
                        title: 'Note test title',
                        description: 'Note test description',
                        files: [
                            {
                                id: 12,
                                downloadPath: '/test/download/path',
                                filename: 'file name'
                            }
                        ],
                        trackId: '1',
                        meta: {
                            transactionId: 1
                        }
                    };
                    const onRemove = jest.fn();

                    modalProvider.showConfirm.mockImplementation(() => ({
                        result: Promise.resolve(true)
                    }));

                    const wrapper = mount(
                        <NoteReadonlyMode
                            note={note}
                            onRemove={onRemove}
                            onEdit={() => {}}
                        />
                    );

                    wrapper.find('.icon-right').simulate('click');

                    await flushPromises();

                    expect(onRemove).not.toHaveBeenCalledWith(note.id);
                });

                it('keyPressed by .icon-right and modalProvider.showConfirm(...) confirms action', async () => {
                    const note = {
                        id: 132,
                        title: 'Note test title',
                        description: 'Note test description',
                        files: [
                            {
                                id: 12,
                                downloadPath: '/test/download/path',
                                filename: 'file name'
                            }
                        ],
                        trackId: '1',
                        meta: {
                            transactionId: 1
                        }
                    };
                    const onRemove = jest.fn();

                    modalProvider.showConfirm.mockImplementation(() => ({
                        result: Promise.resolve(true)
                    }));

                    const wrapper = mount(
                        <NoteReadonlyMode
                            note={note}
                            onRemove={onRemove}
                            onEdit={() => {}}
                        />
                    );

                    wrapper.find('.icon-right').simulate('keyPress');

                    await flushPromises();

                    expect(onRemove).not.toHaveBeenCalledWith(note.id);
                });
            });

            describe('when NOT isLoading and after ', () => {
                it('clicked by .icon-right and modalProvider.showConfirm(...) NOT confirms action', async () => {
                    const note = {
                        id: 132,
                        title: 'Note test title',
                        description: 'Note test description',
                        files: [
                            {
                                id: 12,
                                downloadPath: '/test/download/path',
                                filename: 'file name'
                            }
                        ],
                        trackId: '1'
                    };
                    const onRemove = jest.fn();

                    modalProvider.showConfirm.mockImplementation(() => ({
                        result: Promise.resolve(false)
                    }));

                    const wrapper = mount(
                        <NoteReadonlyMode
                            note={note}
                            onRemove={onRemove}
                            onEdit={() => {}}
                        />
                    );

                    wrapper.find('.icon-right').simulate('click');

                    await flushPromises();

                    expect(onRemove).not.toHaveBeenCalled();
                });

                it('keyPressed by .icon-right and modalProvider.showConfirm(...) NOT confirms action', async () => {
                    const note = {
                        id: 132,
                        title: 'Note test title',
                        description: 'Note test description',
                        files: [
                            {
                                id: 12,
                                downloadPath: '/test/download/path',
                                filename: 'file name'
                            }
                        ],
                        trackId: '1'
                    };
                    const onRemove = jest.fn();

                    modalProvider.showConfirm.mockImplementation(() => ({
                        result: Promise.resolve(false)
                    }));

                    const wrapper = mount(
                        <NoteReadonlyMode
                            note={note}
                            onRemove={onRemove}
                            onEdit={() => {}}
                        />
                    );

                    wrapper.find('.icon-right').simulate('keyPress');

                    await flushPromises();

                    expect(onRemove).not.toHaveBeenCalled();
                });
            });
        });
    });
});
