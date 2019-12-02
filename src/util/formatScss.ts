const scssfmt = require('scssfmt');

export function formatScss(rawStr: string): string {
    return scssfmt(rawStr);
}
