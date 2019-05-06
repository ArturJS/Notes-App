const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { prompt } = require('inquirer');
const chalk = require('chalk');
const { version } = require('../../package.json');

const VERSION_TYPES = {
    PATCH: 'patch',
    MINOR: 'minor',
    MAJOR: 'major'
};

const getNextVersionNumber = (version, bumpVersionType) => {
    const { PATCH, MINOR, MAJOR } = VERSION_TYPES;
    const [major, minor, patch] = version.split('.').map(value => +value);

    switch (bumpVersionType) {
        case PATCH:
            return `${major}.${minor}.${patch + 1}`;
        case MINOR:
            return `${major}.${minor + 1}.${0}`;
        case MAJOR:
            return `${major + 1}.${0}.${0}`;
    }
};

const toFromProjectRootPaths = relativePaths =>
    relativePaths.map(filePath => path.resolve(__dirname, '../../', filePath));

const getFilesWithVersions = () => {
    const foldersWithPackageJsons = ['./', './ui-service/', './api-service/'];
    const relativePathsToPackageJsons = foldersWithPackageJsons.reduce(
        (acc, value) => [
            ...acc,
            `${value}package.json`,
            `${value}package-lock.json`
        ],
        []
    );

    return toFromProjectRootPaths(relativePathsToPackageJsons);
};

const replaceInFiles = async ({ files, from, to, encoding = 'utf8' }) => {
    const readFile = promisify(fs.readFile);
    const writeFile = promisify(fs.writeFile);

    for (let filePath of files) {
        const originalContent = await readFile(filePath, encoding);
        const replacedContent = originalContent.replace(from, to);

        await writeFile(filePath, replacedContent, encoding);
    }
};

const main = async () => {
    const { PATCH, MINOR, MAJOR } = VERSION_TYPES;
    const { versionType } = await prompt([
        {
            type: 'list',
            name: 'versionType',
            message: 'What version number do you want to bump?',
            choices: [PATCH, MINOR, MAJOR]
        }
    ]);
    const nextVersionNumber = getNextVersionNumber(version, versionType);
    const { yesOrNo } = await prompt([
        {
            type: 'list',
            name: 'yesOrNo',
            message: `The next version number will be ${chalk.green(
                nextVersionNumber
            )}. Is it ok?`,
            choices: ['yes', 'no']
        }
    ]);

    if (yesOrNo === 'no') {
        console.log('Cancelling bump version operation.');

        return;
    }

    await replaceInFiles({
        files: getFilesWithVersions(),
        from: /"version": "[^"]+"/,
        to: `"version": "${nextVersionNumber}"`
    });

    console.log(
        'Success! package.json and package-lock.json has been updated!'
    );
};

main();
