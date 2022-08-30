const WIDTHS = {
    default: 6,
    I: 4,
    f: 5,
    i: 2,
    k: 5,
    l: 3,
    t: 4,
}

const LINES = 14;
const ROW_LENGTH = 18 * WIDTHS.default;

export function book(text : string) : string[] {
    const out = ['']
    let width = 0;
    text.split('').forEach(t => {
        const length = Object.keys(WIDTHS).includes(t) ? WIDTHS[t as 'default'] : WIDTHS.default;
        width += length;
        if(width >= 1560){
            out.push('');
            width = length;
        }
        const index = out.length - 1;
        out[index] += t;
    })
    out.forEach(o => {
        console.log(o);
        console.log(o.length);
    })
    return out;
}