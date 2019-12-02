import { traverseAst } from '@/util/traverseAst';
import { formatSass } from '@/util/formatSass';
import { removeSemicolon } from '@/util/removeSemicolon';

let sast: any;

export async function convertScssToSass(scssStr: string): Promise<string> {
    sast = sast || await import('sast');

    const tree = sast.parse(scssStr, { syntax: 'scss' });

    traverseAst(tree, removeSemicolon);
    console.log(tree);

    const stringifiedTree = sast.stringify(tree, { syntax: 'sass' });

    return formatSass(stringifiedTree);
}
