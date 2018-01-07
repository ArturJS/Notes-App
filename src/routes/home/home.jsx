import { h, Component } from 'preact';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import _ from 'lodash';
import AddNoteForm from './components/add-note-form';
import Note from './components/note';

import style from './home.scss';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class Home extends Component {
    state = {
        layouts: {
            lg: _.times(3, i => ({
                i: i.toString(),
                x: i,
                y: Math.floor(i / 2),
                w: 1,
                h: 1
            }))
        },
        notes: _.times(3, i => ({
            id: i.toString(),
            title: i,
            description: i
        }))
    };

    onAddNote = note => {
        this.setState(({ notes }) => {
            const lastIndex = notes.length;

            return {
                notes: [
                    ...notes,
                    {
                        id: lastIndex.toString(),
                        ...note
                    }
                ],
                layouts: {
                    lg: _.times(lastIndex, i => ({
                        i: i.toString(),
                        x: i,
                        y: Math.floor(i / 2),
                        w: 1,
                        h: 1
                    }))
                }
            };
        });
    };

    onEditNote = () => {};

    render() {
        const { notes, layouts } = this.state;

        return (
            <div className={style.home}>
                <AddNoteForm onAddNote={this.onAddNote} />
                <ResponsiveReactGridLayout
                    layouts={layouts}
                    breakpoints={{
                        lg: 1200,
                        md: 996,
                        sm: 768,
                        xs: 480,
                        xxs: 0
                    }}
                    cols={{ lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 }}
                    compactType={'horizontal'}
                    draggableCancel={'[data-non-draggable]'}>
                    {notes.map(note => (
                        <div key={note.id}>
                            <Note note={note} />
                        </div>
                    ))}
                </ResponsiveReactGridLayout>
            </div>
        );
    }
}
