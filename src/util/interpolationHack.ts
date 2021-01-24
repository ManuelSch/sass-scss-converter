export function interpolationHack(child: any) {
  if (child.type === 'interpolation') {
    child.children.unshift({
      type: 'space',
      position: {},
      value: '#{',
    });

    child.children.push({
      type: 'space',
      position: {},
      value: '}',
    });
  }
}
