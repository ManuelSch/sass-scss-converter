import { traverseAst } from '@/util/traverseAst';
import { formatSass } from '@/util/formatSass';
import { removeSemicolon } from '@/util/removeSemicolon';
import { interpolationHack } from '@/util/interpolationHack';

let sast: any;

export async function convertScssToSass(scssStr: string): Promise<string> {
  sast = sast || await import('sast');

  const tree = sast.parse(`${scssStr.trim()}\n\n`, { syntax: 'scss' });

  traverseAst(tree, removeSemicolon);
  traverseAst(tree, interpolationHack);

  const stringifiedTree = sast.stringify(tree, { syntax: 'sass' });

  return formatSass(stringifiedTree).trim().replace(/\r/g, '');
}
