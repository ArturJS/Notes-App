import PropTypes from 'prop-types';
import { filesListPropType } from './files.prop-types';

export const notePropType = PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    files: filesListPropType
});

export const notesListPropType = PropTypes.arrayOf(notePropType);

export const notesActionsPropType = PropTypes.shape({
    addNoteRequest: PropTypes.func.isRequired,
    addNoteSuccess: PropTypes.func.isRequired,
    addNoteFailure: PropTypes.func.isRequired,
    updateNoteRequest: PropTypes.func.isRequired,
    updateNoteSuccess: PropTypes.func.isRequired,
    updateNoteFailure: PropTypes.func.isRequired,
    deleteNoteRequest: PropTypes.func.isRequired,
    deleteNoteSuccess: PropTypes.func.isRequired,
    deleteNoteFailure: PropTypes.func.isRequired,
    getAllNotesRequest: PropTypes.func.isRequired,
    getAllNotesSuccess: PropTypes.func.isRequired,
    getAllNotesFailure: PropTypes.func.isRequired,
    changeNoteOrderRequest: PropTypes.func.isRequired,
    changeNoteOrderSuccess: PropTypes.func.isRequired,
    changeNoteOrderFailure: PropTypes.func.isRequired,
    clearNotes: PropTypes.func.isRequired
});
