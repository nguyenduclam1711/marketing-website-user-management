const path = require('path')
const localesFolder = path.resolve(__dirname, "locales");
const util = require('util');
const fs = require('fs');

const fsReaddir = util.promisify(fs.readdir);
const fsReadFile = util.promisify(fs.readFile);
const fsLstat = util.promisify(fs.lstat);

async function searchFilesInDirectoryAsync(dir, filter, ext) {
    const enContent = JSON.parse(fs.readFileSync(`${localesFolder}/en.json`, { encoding: 'utf-8' }))
    const keys = Object.keys(enContent)
    const files = await fsReaddir(dir).catch(err => {
        throw new Error(err.message);
    });
    const foundFiles = await getFilesInDirectoryAsync(dir, ext);

    console.log('keys', keys.length);
    const res = await Promise.all(
        await keys.splice(0, 10).filter(async key => {
            return await new Promise(async (resolve, reject) => {
                let foundWord = false
                for await (file of foundFiles) {
                    const fileContent = await fsReadFile(file);
                    const regex = new RegExp(`[__|\\+translate]\\([\\"|\\']` + key + `[\\"|\\']\\)`);
                    if (regex.test(fileContent)) {
                        foundWord = true
                    }
                };
                if (!foundWord) {
                    console.log(`Key not found: `, key);
                    return resolve(key)
                }
            })
        })
    )
    console.log('res', res.length);
}

async function getFilesInDirectoryAsync(dir, ext) {
    let files = [];
    const filesFromDirectory = await fsReaddir(dir).catch(err => {
        throw new Error(err.message);
    });

    for (let file of filesFromDirectory) {
        const filePath = path.join(dir, file);
        const stat = await fsLstat(filePath);

        if (stat.isDirectory()) {
            const nestedFiles = await getFilesInDirectoryAsync(filePath, ext);
            files = files.concat(nestedFiles);
        } else {
            if (path.extname(file) === ext) {
                files.push(filePath);
            }
        }
    };

    return files;
}
(async () => {
    searchFilesInDirectoryAsync('./views', 'career', '.pug')
})()