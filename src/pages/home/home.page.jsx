import React from 'react';
import { pure, compose } from 'recompose';
import { notesApi, authApi } from '~/common/api';
import withReduxStore from '~/common/hocs/with-redux-store.jsx';
import { ModalDialog } from '~/common/features/modal';
import AnonymousModeBanner from './components/anonymous-mode-banner';
import AddNoteForm from './components/add-note-form';
import NotesList from './components/notes-list';

const enhance = compose(
    withReduxStore({
        async getInitialReduxState({ req }) {
            const apiParams = {
                headers: {
                    Cookie: req.headers.cookie || ''
                },
                baseURL: req.apiBaseUrl || 'http://localhost:3000/api',
                headers: { 'X-Forwarded-For': req.socket.remoteAddress }
            };

            try {
                const [notes, user] = await Promise.all([
                    notesApi.getAll(apiParams),
                    authApi.getUserData(apiParams)
                ]);

                return {
                    notes,
                    auth: {
                        isLoggedIn: true,
                        isLoginPending: false,
                        isLoginSuccess: null,
                        isLogoutPending: false,
                        isLogoutSuccess: null,
                        authData: {
                            email: user.email
                        }
                    }
                };
            } catch (err) {
                // console.error('SSR Auth failed!');
                // console.error('Error details: ', err);

                return {
                    notes: []
                };
            }
        }
    }),
    pure
);

const Home = () => (
    <div className="home-page">
        <AnonymousModeBanner />
        <AddNoteForm />
        <NotesList />
        <ModalDialog />
    </div>
);

export default enhance(Home);
