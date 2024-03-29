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
                    Cookie: req.headers.cookie || '',
                    'X-Forwarded-For':
                        req.headers['X-Forwarded-For'] ||
                        req.socket.remoteAddress
                },
                baseURL: req.apiBaseUrl || 'http://localhost:3000/api'
            };
            const user = await authApi.getUserData(apiParams);

            if (!user) {
                return {
                    notes: []
                };
            }

            try {
                const notes = await notesApi.getAll(apiParams);

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
