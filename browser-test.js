function test(a, b, res) {
    function parse(string) {
        return string.split(/\s+/).join('\n');
    }

    a = parse(a);
    b = parse(b);
    let r = diff(a, b).map(line => `${line.a || ' '} ${line.status == '*' ? '>' : line.status}${line.b ? ' ' + line.b : ''}`).join('\n');

    let passed = r == res;

    let colA = 5, colB = 5, colR = 7;

    a = a.split(/\n/).map(line => { if (line.length > colA) colA = line.length; return line }).map(line => line + ' '.repeat(colA - line.length));
    b = b.split(/\n/).map(line => { if (line.length > colB) colB = line.length; return line }).map(line => line + ' '.repeat(colB - line.length));
    r = r.split(/\n/).map(line => { if (line.length > colR) colR = line.length; return line }).map(line => line + ' '.repeat(colR - line.length));
    res = res.split(/\n/);

    const div = '     ';
    let log = [[
        'textA' + ' '.repeat(colA - 5),
        'textB' + ' '.repeat(colB - 5),
        'result' + ' '.repeat(colR - 6),
        passed ? '' : 'expected'
    ].join(div)];

    while (a.length || b.length || r.length || res.length) {
        let shiftedRes = res.shift();
        log.push([
            a.shift() || ' '.repeat(colA),
            b.shift() || ' '.repeat(colB),
            r.shift() || ' '.repeat(colR),
            passed ? '' : shiftedRes
        ].join(div));
    }

    const color = `color: ${passed ? 'green' : 'red'}`;
    console.log(`%c${passed ? 'Passed' : 'Failed'}\n` + log.shift(), `font-weight: bold; ${color}`);
    console.log('%c' + log.join('\n'), color);
}

// test 1
textA = 'a e b g c d m f';
textB = '1 b g 2 z y d f 3';
res = `a > 1
e -
b = b
g = g
  + 2
c > z
  + y
d = d
m -
f = f
  + 3`;

test(textA, textB, res);

// test 2
test('a b c', 'c b a', `a > c
b = b
c > a`);

// test 3
test('a b', 'c d e', `a > c
b > d
  + e`);

// test 4
test('Some Simple Text File', 'Another Text File With Additional Lines', `Some > Another
Simple -
Text = Text
File = File
  + With
  + Additional
  + Lines`);

// test 5
test('a b c', '1 2 3 b', `a > 1
  + 2
  + 3
b = b
c -`);

// test 6
test('a b', 'b a', '  + b\na = a\nb -')