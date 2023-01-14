import { expect } from 'chai';
import { convertScssToSass } from '@/util/convertScssToSass';

describe('convertScssToSass.ts', () => {
  it('@import - should remove semicolon', async () => {
    const input = '@import "../styles/imports";';
    const expected = '@import "../styles/imports"';

    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });

  it('$variable definition - should remove semicolon', async () => {
    const input = '$col-primary: #f39900;';
    const expected = '$col-primary: #f39900';

    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });

  it('$variable usage', async () => {
    const input = `
.item {
  color: $col-primary;
}
`;
    const expected = `
.item
  color: $col-primary
`.trim();
    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });

  it('=mixin() definition', async () => {
    const input = `
@mixin center_horizontal() {
  display: none;
}
`;
    const expected = `
@mixin center_horizontal()
  display: none
`.trim();
    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });

  it('=mixin() usage', async () => {
    const input = `
.container {
  @include center_horizontal();
}
`;
    const expected = `
.container
  @include center_horizontal()
`.trim();
    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });

  it('interpolation usage', async () => {
    const input = `
@mixin corner-icon($name) {
  .icon-#{$name} {
    background-image: url("/icons/#{$name}.svg");
  }
}
`;
    const expected = `
@mixin corner-icon($name)
  .icon-#{$name}
    background-image: url("/icons/#{$name}.svg")
`.trim();
    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });

  it('multiple indention levels', async () => {
    const input = `
.container {
  border: none;
  .item {
    color: white;
  }
}
`;
    const expected = `
.container
  border: none
  .item
    color: white
`.trim();
    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });

  it('messed-up input formatting #1', async () => {
    const input = `
.aaaa {
    .bbbb {
    background:blue
  }
.cccc {
}
    background: white;
}
`;
    const expected = `
.aaaa
  .bbbb
    background: blue
  .cccc
  background: white
`.trim();
    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });

  it('messed-up input formatting #2', async () => {
    const input = `
.aaaa {
    .bbbb {
    background:blue
  }

.cccc {
}
    background: white;
}
`;
    const expected = `
.aaaa
  .bbbb
    background: blue

  .cccc
  background: white
`.trim();
    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });

  it('if, else-if', async () => {
    const input = `
@mixin centered($horizontal: true, $vertical: true) {
  @if ($horizontal and $vertical) {
    top: 0;
  } @else if ($horizontal) {
    left: 0;
  }
  @else if ($vertical) {
    top: 0;
  }
}
`.replace('}', '}\n');
    const expected = `
@mixin centered($horizontal: true, $vertical: true)
  @if ($horizontal and $vertical)
    top: 0
  @else if ($horizontal)
    left: 0
  @else if ($vertical)
    top: 0
`.trim();
    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });

  it('if, else-if #2', async () => {
    const input = `
@mixin centered($horizontal: true, $vertical: true) {
  position: absolute;
  @if ($horizontal and $vertical) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  } @else if ($horizontal) {
    left: 50%;
    transform: translate(-50%, 0);
  } @else if ($vertical) {
    top: 50%;
    transform: translate(0, -50%);
  }
}
`.replace('}', '}\n');
    const expected = `
@mixin centered($horizontal: true, $vertical: true)
  position: absolute
  @if ($horizontal and $vertical)
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
  @else if ($horizontal)
    left: 50%
    transform: translate(-50%, 0)
  @else if ($vertical)
    top: 50%
    transform: translate(0, -50%)
`.trim();
    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });

  it('placeholders', async () => {
    const input = `
%placeholder {
  color: red;
}
.my-thing {
  @extend %placeholder;
}
`;
    const expected = `
%placeholder
  color: red
.my-thing
  @extend %placeholder
`.trim();
    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });

  it('full example', async () => {
    const input = `
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
`;
    const expected = `
@import "../styles/imports"
$col-primary: #f39900
@mixin center_horizontal()
  display: flex
  justify-content: center

.container
  @include center_horizontal()
  border: 1px solid darken($col-background, 10)

  .item
    color: $col-primary
`.trim();
    const result = await convertScssToSass(input);
    expect(result).to.equal(expected);
  });
});
