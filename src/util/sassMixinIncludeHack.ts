// + to @include hack:
export function sassMixinIncludeHack(child: any) {
  if (child.type === 'include' && child.children) {
    const [firstChild, ...otherChildren] = child.children;
    if (firstChild.value === '+') {
      firstChild.type = 'atkeyword';
      delete firstChild.value;
      firstChild.children = [
        {
          type: 'ident',
          value: 'include',
        },
      ];

      // eslint-disable-next-line no-param-reassign
      child.children = [
        firstChild,
        {
          type: 'space',
          value: ' ',
        },
        ...otherChildren,
      ];
    }
  }
}
