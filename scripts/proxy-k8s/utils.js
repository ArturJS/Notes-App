const { execSync } = require('child_process');

module.exports = {
    getTargetHost: () => {
        const getTargetEndpoint = [
            "kubectl describe service ui-service",
            "grep 'Endpoints'"
        ].join(' | ');
        const host = execSync(getTargetEndpoint).toString('utf8').replace(/[^0-9]+/, '').replace(/\n/, '');

        return `http://${host}/`;
    }
};
