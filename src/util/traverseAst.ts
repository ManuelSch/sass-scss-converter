// let level = 0;

export function traverseAst(root: any, forEveryNode: (child: any) => void) {
  // console.log(`.${'  '.repeat(level)}`,root);
  // level++;
  forEveryNode(root);
  if (root && root.children && root.children.length > 0) {
    root.children.forEach((child: any) => traverseAst(child, forEveryNode));
  }
  // level--;
}
