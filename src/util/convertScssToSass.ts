import { traverseAst } from '@/util/traverseAst';
import { formatSass } from '@/util/formatSass';
import { removeSemicolon } from '@/util/removeSemicolon';

let sast: any;

export async function convertScssToSass(scssStr: string): Promise<string> {
  sast = sast || await import('sast');

  const tree = sast.parse(`${scssStr.trim()}\n\n`, { syntax: 'scss' });
  traverseAst(tree, removeSemicolon);

  const stringifiedTree = sast.stringify(tree, { syntax: 'sass' });

  return formatSass(stringifiedTree).trim().replace(/\r/g, '');
}
