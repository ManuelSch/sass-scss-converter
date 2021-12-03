import {traverseAst} from '@/util/traverseAst';
import {addSemicolon} from '@/util/addSemicolon';
import {formatScss} from '@/util/formatScss';
import {sassMixinIncludeHack} from '@/util/sassMixinIncludeHack';
import {sassMixinDefinitionHack} from '@/util/sassMixinDefinitionHack';
import {interpolationHack} from '@/util/interpolationHack';
import {removeTrailingSpacesForEachLine} from "@/util/removeTrailingSpacesForEachLine";

let sast: any;

export async function convertSassToScss(sassStr: string): Promise<string> {
  sast = sast || await import('sast');

  const cleanedUpSassStr = removeTrailingSpacesForEachLine(sassStr);
  const ast = sast.parse(`${cleanedUpSassStr}\n\n`, {syntax: 'sass'});

  traverseAst(ast, sassMixinIncludeHack);
  traverseAst(ast, sassMixinDefinitionHack);
  traverseAst(ast, addSemicolon);
  traverseAst(ast, interpolationHack);

  const stringifiedTree = sast.stringify(ast, {syntax: 'scss'});

  return formatScss(stringifiedTree).trim().replace(/\r/g, '');
}
