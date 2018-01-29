import { h, Component } from 'preact';
import { findDOMNode } from 'preact-compat';
import PropTypes from 'prop-types';
import DragLayer from 'react-dnd/lib/DragLayer';
import _ from 'lodash';

import FilesList from '../file-list';
import './note-drag-preview.scss';

const linkRegexp = /(http[^\s]+)/g;
const collect = monitor => {
    const draggingItem = monitor.getItem();
    const currentOffset = monitor.getSourceClientOffset();

    return {
        draggingItem,
        currentOffset,
        isDragging: monitor.isDragging()
    };
};
const getItemStyles = (parentElement, currentOffset) => {
    if (!currentOffset) {
        return {
            display: 'none'
        };
    }

    // http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
    const x = currentOffset.x - parentElement.offsetLeft;
    const y = currentOffset.y - parentElement.offsetTop + window.scrollY;
    const transform = `translate(${x}px, ${y}px)`;

    return {
        pointerEvents: 'none',
        transform,
        WebkitTransform: transform
    };
};

@DragLayer(collect)
export default class NoteDragPreview extends Component {
    static propTypes = {
        notes: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                files: PropTypes.array
            }).isRequired
        ).isRequired,
        draggingItem: PropTypes.shape({
            id: PropTypes.string.isRequired,
            index: PropTypes.number.isRequired
        })
    };

    wrapUrlLinks = text =>
        _.escape(text).replace(
            linkRegexp,
            '<a href="$1" class="note-link" target="_blank" rel="nofollow noopener">$1</a>'
        );

    getParentElement = () => findDOMNode(this).parentNode;

    render() {
        const { draggingItem, currentOffset } = this.props;

        if (!draggingItem) {
            return null;
        }

        const { note } = draggingItem;
        const parentElement = this.getParentElement();

        return (
            <div
                className="note note-drag-preview"
                style={getItemStyles(parentElement, currentOffset)}>
                <div>
                    <i
                        className={'icon icon-left icon-pencil'}
                        onClick={this.onEdit}
                    />
                    <i
                        className={'icon icon-right icon-bin'}
                        onClick={this.onRemove}
                    />
                </div>
                <div className={'note-title'}>{note.title}</div>
                <div
                    className={'note-description'}
                    dangerouslySetInnerHTML={{
                        __html: this.wrapUrlLinks(note.description)
                    }}
                />
                <FilesList files={note.files} />
            </div>
        );
    }
}
