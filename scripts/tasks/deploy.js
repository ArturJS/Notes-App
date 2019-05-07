const path = require('path');
const { execShell } = require('./utils');

const main = async () => {
    const cwd = path.resolve(__dirname, '../..');

    console.log('Dectypting configurations...');

    try {
        await execShell({
            command: [
                'cd notes-app-chart/templates',
                'sops -d -i ui-service-ui-service--env-configmap.yaml',
                'sops -d -i api-service-api-service--env-configmap.yaml'
            ].join(' && '),
            cwd
        });
    } catch (err) {
        const isUnexpectedError = !err.message.includes(
            'sops metadata not found'
        );

        if (isUnexpectedError) {
            throw err;
        }
    }

    console.log('Deploying...');
    const releaseName = await execShell({
        command:
            "helm ls | (grep notes-app-chart || echo 'notes-app-release') | awk '{print $1}'",
        cwd,
        collectResult: true
    });

    await execShell({
        command: `helm upgrade --install ${releaseName.trim()} ./notes-app-chart`,
        cwd
    });
    console.log('Done!');
};

main().catch(err => {
    console.log('Deploy failed! Error: ', err);
});
