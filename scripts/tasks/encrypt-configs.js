const path = require('path');
const { execShell } = require('./utils');

const pathToConfigs = path.resolve(__dirname, '../../helm-chart/templates/');

const getConfigFiles = async () => {
    const result = await execShell({
        command: 'ls | grep configmap.yaml',
        cwd: pathToConfigs,
        collectResult: true
    });

    return result
        .split('\n')
        .map(filename => filename.trim())
        .filter(filename => filename.length > 0);
};

const main = async () => {
    const configFiles = await getConfigFiles();

    console.log(configFiles);

    for (let filename of configFiles) {
        await execShell({
            command: `sops -e -i ${filename}`,
            cwd: pathToConfigs
        });
    }
};

main();
