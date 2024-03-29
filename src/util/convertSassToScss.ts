import { traverseAst } from '@/util/traverseAst';
import { addSemicolon } from '@/util/addSemicolon';
import { formatScss } from '@/util/formatScss';
import { sassMixinIncludeHack } from '@/util/sassMixinIncludeHack';
import { sassMixinDefinitionHack } from '@/util/sassMixinDefinitionHack';
import { interpolationHack } from '@/util/interpolationHack';
import { removeTrailingSpacesForEachLine } from '@/util/removeTrailingSpacesForEachLine';
import { placeholderHack } from '@/util/placeholderHack';
import { cssVariableHack } from '@/util/cssVariableHack';
import { importQuotesHack } from '@/util/importQuotesHack';
import {
  operatorInArgumentsHack,
  operatorInArgumentsHackPostFormat,
} from '@/util/operatorInArgumentsHack';

let sast: any;

export async function convertSassToScss(sassStr: string): Promise<string> {
  sast = sast || await import('sast');

  const cleanedUpSassStr = removeTrailingSpacesForEachLine(sassStr);
  const ast = sast.parse(`${cleanedUpSassStr}\n\n`, { syntax: 'sass' });

  // eslint-disable-next-line no-param-reassign
  traverseAst(ast, (node) => delete node.position);

  traverseAst(ast, sassMixinIncludeHack);
  traverseAst(ast, sassMixinDefinitionHack);
  traverseAst(ast, addSemicolon);
  traverseAst(ast, interpolationHack);
  traverseAst(ast, placeholderHack);
  traverseAst(ast, cssVariableHack);
  traverseAst(ast, importQuotesHack);
  traverseAst(ast, operatorInArgumentsHack);

  const stringifiedTree = sast.stringify(ast, { syntax: 'scss' });
  let formattedScss = formatScss(stringifiedTree).trim().replace(/\r/g, '');

  formattedScss = operatorInArgumentsHackPostFormat(formattedScss);

  return formattedScss;
}
