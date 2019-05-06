const { spawn } = require('child_process');

const execShell = async ({ command, cwd }) =>
    new Promise((resolve, reject) => {
        spawn(command, {
            cwd,
            stdio: 'inherit',
            shell: true
        }).on('close', code => {
            if (code !== 0) {
                console.log(
                    `The command "${command}" failed with code ${code}!`
                );
                reject();
                return;
            }

            resolve();
        });
    });

module.exports = execShell;
