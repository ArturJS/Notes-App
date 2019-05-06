const { spawn } = require('child_process');
const path = require('path');
const { version } = require('../../package.json');

const { log } = console;

const execShell = async ({ command, cwd }) =>
    new Promise((resolve, reject) => {
        spawn(command, {
            cwd,
            stdio: 'inherit',
            shell: true
        }).on('close', code => {
            if (code !== 0) {
                log(`The command "${command}" failed with code ${code}!`);
                reject();
                return;
            }

            resolve();
        });
    });

const buildDockerImages = async ({ pathsToDockerfiles, version }) => {
    for (let dockerfilePath of pathsToDockerfiles) {
        const serviceName = dockerfilePath.split('/').slice(-1)[0];

        await execShell({
            command: `docker build -t notes-app_${serviceName}:${version} .`,
            cwd: dockerfilePath
        });
    }
};

const tagDockerImages = async ({ pathsToDockerfiles, version }) => {
    for (let dockerfilePath of pathsToDockerfiles) {
        const serviceName = dockerfilePath.split('/').slice(-1)[0];
        const imageName = `notes-app_${serviceName}:${version}`;

        await execShell({
            command: `docker tag ${imageName} arturjs/${imageName}`,
            cwd: dockerfilePath
        });
    }
};

const pushDockerImages = async ({ pathsToDockerfiles, version }) => {
    for (let dockerfilePath of pathsToDockerfiles) {
        const serviceName = dockerfilePath.split('/').slice(-1)[0];
        const imageName = `notes-app_${serviceName}:${version}`;

        await execShell({
            command: `docker push arturjs/${imageName}`,
            cwd: dockerfilePath
        });
    }
};

const main = async () => {
    const pathsToDockerfiles = [
        path.resolve(__dirname, '../../', 'ui-service'),
        path.resolve(__dirname, '../../', 'api-service')
    ];

    log(`Preparing ${version} version for publishing to docker-hub...`);

    log('');
    log('1/3. Build docker images.');
    await buildDockerImages({
        pathsToDockerfiles,
        version
    });

    log('');
    log('2/3. Tag docker images.');
    await tagDockerImages({
        pathsToDockerfiles,
        version
    });

    log('');
    log('3/3. Push docker images.');
    await pushDockerImages({
        pathsToDockerfiles,
        version
    });
};

main();
