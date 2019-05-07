const { spawn } = require('child_process');

const execShell = async ({ command, cwd, collectResult = false }) =>
    new Promise((resolve, reject) => {
        const shellProcess = spawn(command, {
            cwd,
            stdio: ['inherit', collectResult ? 'pipe' : 'inherit', 'pipe'],
            shell: true
        });
        let result = '';
        let errorDetails = '';

        if (collectResult) {
            shellProcess.stdout.on('data', data => {
                result += data.toString();
            });
        }

        shellProcess.stderr.on('data', data => {
            const error = data.toString();

            errorDetails += error;
        });

        shellProcess.on('close', code => {
            if (code !== 0) {
                console.log(
                    `The command "${command}" failed with code ${code}!`
                );
                reject(new Error(errorDetails));
                return;
            }

            resolve(result);
        });
    });

module.exports = execShell;
