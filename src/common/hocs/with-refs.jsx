import { withHandlers } from 'recompose';

const withRefs = withHandlers(() => {
    // approach with refs taken from https://stackoverflow.com/a/45748180
    const refs = {};

    return {
        setRef: () => (key, value) => {
            refs[key] = value;
        },
        getRef: () => key => refs[key]
    };
});

export default withRefs;
