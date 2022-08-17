import * as fs from 'fs';

export function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const mkdir = (path: string) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
}

export const writeFile = (path: string, content: string) => {
    fs.writeFile(path, content, err => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
    })
}