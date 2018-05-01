import React, { Component } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pure, setStatic } from 'recompose';
import { notesApi, authApi } from '../../common/api';
import { notesActions, notesSelectors } from '../../common/features/notes';
import {
    notesActionsPropType,
    notesListPropType
} from '../../common/prop-types/notes.prop-types';
import withReduxStore from '../../common/hocs/with-redux-store.jsx';
import withRootLayout from '../../common/hocs/with-root-layout.jsx';
import AddNoteForm from './components/add-note-form';
import NotesList from './components/notes-list';
import '../../common/style/index.scss';
import './home.scss';

const mapStateToProps = state => ({
    notes: notesSelectors.getNotes(state)
});

const mapDispatchToProps = dispatch => ({
    notesActions: bindActionCreators(notesActions, dispatch)
});

const getInitialProps = async ({ isServer, req }) => {
    if (!isServer && typeof window !== 'undefined') {
        const notes = _.get(window, '__NEXT_DATA__.props.notes', []);

        return {
            notes
        };
    }

    const apiParams = {
        headers: {
            Cookie: req.headers.cookie || ''
        }
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
        return {
            notes: []
        };
    }
};

@setStatic('getInitialProps', getInitialProps)
@withReduxStore
@withRootLayout
@connect(mapStateToProps, mapDispatchToProps)
@pure
export default class Home extends Component {
    static propTypes = {
        notes: notesListPropType.isRequired,
        notesActions: notesActionsPropType.isRequired
    };

    onMoveNote = (oldIndex, newIndex) => {
        this.changeNoteOrder({
            oldIndex,
            newIndex
        });
    };

    onDropNote = (oldIndex, newIndex) => {
        this.changeNoteOrder({
            oldIndex,
            newIndex,
            commitChanges: true
        });
    };

    changeNoteOrder = ({ oldIndex, newIndex, commitChanges }) => {
        if (_.isUndefined(oldIndex) || _.isUndefined(newIndex)) {
            return;
        }

        const movingNote = this.props.notes[oldIndex];

        this.props.notesActions.changeNoteOrderRequest({
            id: movingNote.id,
            oldIndex,
            newIndex,
            commitChanges
        });
    };

    render() {
        const { notes } = this.props;

        return (
            <div className="home-page">
                <AddNoteForm />
                <NotesList
                    notes={notes || []}
                    onMoveNote={this.onMoveNote}
                    onDropNote={this.onDropNote}
                />
            </div>
        );
    }
}
