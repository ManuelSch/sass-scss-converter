import {traverseAst} from '@/util/traverseAst';
import {removeSemicolon} from '@/util/removeSemicolon';
import {interpolationHack} from '@/util/interpolationHack';
import {formatScss} from '@/util/formatScss';
import {removeTrailingSpacesForEachLine} from "@/util/removeTrailingSpacesForEachLine";

let sast: any;

export async function convertScssToSass(scssStr: string): Promise<string> {
  sast = sast || await import('sast');

  const tree = sast.parse(`${formatScss(scssStr.trim())}\n\n`, {syntax: 'scss'});

  traverseAst(tree, (node) => delete node.position);

  traverseAst(tree, removeSemicolon);
  traverseAst(tree, interpolationHack);
  traverseAst(tree, node => node.type = node.type === 'block' ? '_block' : node.type);

  const stringifiedTree = removeTrailingSpacesForEachLine(sast.stringify(tree).trim());
  return stringifiedTree;
}
