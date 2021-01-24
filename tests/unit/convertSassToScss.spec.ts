import { expect } from 'chai';
import { convertSassToScss } from '../../src/util/convertSassToScss';

describe('convertSassToScss.ts', () => {
  it('@import - should add semicolon', async () => {
    const input = '@import "../styles/imports"';
    const expected = '@import "../styles/imports";';

    const result = await convertSassToScss(input);
    expect(result).to.equal(expected);
  });

  it('$variable definition - should add semicolon', async () => {
    const input = '$col-primary: #f39900';
    const expected = '$col-primary: #f39900;';

    const result = await convertSassToScss(input);
    expect(result).to.equal(expected);
  });

  it('$variable usage', async () => {
    const input = `
.item
  color: $col-primary
`;
    const expected = `
.item {
  color: $col-primary;
}
`.trim();
    const result = await convertSassToScss(input);
    expect(result).to.equal(expected);
  });

  it('=mixin() definition', async () => {
    const input = `
=center_horizontal()
  display: none
`;
    const expected = `
@mixin center_horizontal() {
  display: none;
}
`.trim();
    const result = await convertSassToScss(input);
    expect(result).to.equal(expected);
  });

  it('=mixin() usage', async () => {
    const input = `
.container
  +center_horizontal()
`;
    const expected = `
.container {
  @include center_horizontal();
}
`.trim();
    const result = await convertSassToScss(input);
    expect(result).to.equal(expected);
  });

  it('multiple indention levels', async () => {
    const input = `
.container
  border: none
  .item
    color: white
`;
    const expected = `
.container {
  border: none;
  .item {
    color: white;
  }
}
`.trim();
    const result = await convertSassToScss(input);
    expect(result).to.equal(expected);
  });

  it('full example', async () => {
    const input = `
@import "../styles/imports"
$col-primary: #f39900
=center_horizontal()
  display: flex
  justify-content: center
.container
  +center_horizontal()
  border: 1px solid darken($col-background, 10)
  .item
    color: $col-primary
`;
    const expected = `
@import "../styles/imports";
$col-primary: #f39900;
@mixin center_horizontal() {
  display: flex;
  justify-content: center;
}
.container {
  @include center_horizontal();
  border: 1px solid darken($col-background, 10);
  .item {
    color: $col-primary;
  }
}
`.trim();
    const result = await convertSassToScss(input);
    expect(result).to.equal(expected);
  });
});
