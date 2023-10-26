const fs = require('fs');

const content = fs.readFileSync('main.mx', {
  encoding: 'utf8',
});

class Parser {
  src = '';
  tokens = [];
  char = '';
  idx = 0;

  constructor(content) {
    this.src = content.replaceAll('\n');
    this.char = content[0];
  }

  ahead() {
    this.idx += 1;
    this.char = this.src[this.idx];
  }

  parse() {
    while (this.idx < this.src.length) {
      if (this.char === ' ') {
        this.ahead();
        continue;
      }
      if (this.char === '#') {
        let depth = 0;
        let value = '';
        while (this.char === '#' && this.idx < this.src.length) {
          depth += 1;
          this.ahead();
        }
        while (this.char === ' ' && this.idx < this.src.length) {
          this.ahead();
        }
        while (
          this.char !== ' ' &&
          this.char?.indexOf('\r') === -1 &&
          this.idx < this.src.length
        ) {
          value += this.char;
          this.ahead();
        }
        this.tokens.push({
          depth,
          value,
        });
      }
      this.ahead();
    }

    return this.tokens;
  }

  generate() {
    let depths = {
      1: 'h1',
      2: 'h2',
      3: 'h3',
      4: 'h4',
      5: 'h5',
    };
    let maxDepth = 5;

    return this.tokens.map((t) => {
      let tag = depths[t.depth > maxDepth ? maxDepth : t.depth];
      let madeTag = `<${tag}>${t.value}</${tag}>`;
      return madeTag;
    });
  }
}

const parser = new Parser(content);
console.log(parser.parse());
console.log(parser.generate());
