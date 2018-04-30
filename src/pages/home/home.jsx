import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pure, setStatic } from 'recompose';
import { notesApi } from '../../common/api';
import { notesActions, notesSelectors } from '../../common/features/notes';
import withReduxStore from '../../common/hocs/with-redux-store';
import withRootLayout from '../../common/hocs/with-root-layout';
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

@setStatic('getInitialProps', async ({ isServer, req, session }) => {
    if (!isServer && typeof window !== 'undefined') {
        return _.get(window, '__NEXT_DATA__.props.initialProps.notes');
    }

    try {
        setTimeout(() => {
            console.log('req.headers.cookie', req.headers.cookie);
        }, 500);

        const notes = await notesApi.getAll({
            headers: {
                Cookie: req.headers.cookie
            }
        });

        return {
            notes
        };
    } catch (err) {
        return [];
    }
})
@withReduxStore
@withRootLayout
@connect(mapStateToProps, mapDispatchToProps)
@pure
export default class Home extends Component {
    static propTypes = {
        notes: PropTypes.arrayOf(
            // todo: move into common propTypes
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                files: PropTypes.array,
                prev: PropTypes.string,
                next: PropTypes.string
            }).isRequired
        ).isRequired,
        notesActions: PropTypes.object.isRequired
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

    render() {
        const { notes } = this.props;

        return (
            <div className="home-page">
                <AddNoteForm notes={notes} />
                <NotesList
                    notes={notes}
                    onMoveNote={this.onMoveNote}
                    onDropNote={this.onDropNote}
                />
            </div>
        );
    }
}
