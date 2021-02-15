export const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

/*
ATOMS

[
    sixt, 
    eigt, eigdot, 
    quart, quarty, quardot, quardoubldot, 
    half, half_six, half_eig, half_eigdot, halfdot, halfquarty, halfdoubldot, halftridot
    whole
]

(all empty)
4 BARS
1 BAR
1 BEAT
1 SIXT

(all SIXTS)
4 BARS
1 BAR
1 BEAT
1 SIXT

(all EIGTS)
4 BARS
1 BAR
1 BEAT
1 EIGT

(all QUARTS)
4 BARS
1 BAR
1 QUART

(all HALFS)
4 BARS
1 BAR
1 HALF

(all WHOLES)
4 BARS
1 WHOLE
*/

/*
ISOTOPES

(alternating SIXTS & SIXRESTS)
1 BAR (rotate A, B)
1 BEAT (rotate A, B)

(alternating EIGTS & EIGRESTS)
1 BAR (rotate A, B)
1 BEAT (rotate A, B)

(alternating QUARTS & QUARESTS)
1 BAR (rotate A, B)

(alternating HALFS & HALFREST)
1 BAR (rotate A, B)

(2 SIXTS & 2 SIXRESTS)
1 BAR (rotate A, B)
1 BEAT (rotate)

(alternating EIGTS & EIGRESTS)
1 BAR
1 BAR (rotate)
1 BEAT
1 BEAT (rotate)

(alternating QUARTS & QUARESTS)
1 BAR
1 BAR (rotate)

(alternating HALFS & HALFREST)
1 BAR
1 BAR (rotate)
*/

/*
BEAT PATTERNS

(----) (A)
(****) (Ainv)

BREAK

(*-*-) (B)
(-*-*) (Binv)

BREAK

(**--) (C)
(--**) (Cinv)

(-**-) (Crot)
(*--*) (Drotinv)

BREAK

(*---) (E)
(-***) (Einv)

(---*) (Eflip)
(***-) (Eflipinv)

(-*--) (F)
(--*-) (Fflip)
(*-**) (Finv)
(**-*) (Fflipinv)
*/

const validateStr = (str) => {
    const isValid = true

    str.split('').forEach(char => {
        if (char !== '*' && char !== '-') {
            isValid = false
        }
    });

    return isValid
}

const REST = '-'
const HIT = '*'
const EMPTY_4 = '----'

export class Beat {

    constructor(arg) {
        if (!arg) {
            this.root = `${REST}${REST}${REST}${REST}`
            return
        }

        if (typeof arg === 'string') {
            if (!validateStr(arg)) {
                throw new Error('Beat class constructor received invalid arg')
            }

            this.root = arg
        } else if (typeof arg === 'object' && arg.root && typeof arg.root === 'string') {
            this.root = arg.root
        } else {
            throw new Error('Beat class constructor received invalid arg')
        }
    }


    invert() {
        const inverted = []

        this.root.split('').forEach(char => {
            if (char === `${REST}`) {
                inverted.push(`${HIT}`)
            } else {
                inverted.push(`${REST}`)
            }
        })
        this.root = inverted.join('')

        return this
    }

    rotate() {
        const rotated = []

        this.root.split('').forEach((char, idx) => {
            if (idx === this.root.length - 1) {
                rotated[0] = char
            } else {
                rotated[idx + 1] = char
            }
        })

        this.root = rotated.join('')

        return this
    }

    flip() {
        const flipped = []

        this.root.split('').forEach((char, idx) => {
            if (idx < Math.ceil(this.root.length / 2.)) {
                // console.log('MUSIC', 'Beat', char, idx, this.root.length - 1 - idx)
                flipped[idx] = this.root[this.root.length - 1 - idx]
                flipped[this.root.length - 1 - idx] = char
            }
        })

        this.root = flipped.join('')

        return this
    }

    append(arg) {
        if (typeof arg === 'string') {
            if (!validateStr(arg)) {
                throw new Error('Beat class append method received invalid arg')
            }

            this.root = this.root.concat(arg)
        } else if (typeof arg === 'object' && arg.root && typeof arg.root === 'string') {
            this.root = this.root.concat(arg.root)
        } else {
            throw new Error('Beat class append method received invalid arg')
        }

        return this
    }

    clone() {
        return new Beat(this.root)
    }

    double() {
        this.root = this.root.concat(this.root)

        return this
    }

    head() {
        if (this.root.length === 1) {
            return this.root
        } else {
            const halfIdx = Math.floor(this.root.length / 2.)
            return new Beat(this.root.slice(0, halfIdx))
        }
    }

    tail() {
        if (this.root.length === 1) {
            return this.root
        } else {
            const halfIdx = Math.ceil(this.root.length / 2.)
            return new Beat(this.root.slice(halfIdx))
        }
    }

    hitCount() {
        return this.root.split('').reduce((accum, val) => {
            if (val === `${HIT}`) {
                return accum + 1
            }
            return accum
        })
    }

    restCount() {
        return this.root.split('').reduce((accum, val) => {
            if (val === `${REST}`) {
                return accum + 1
            }
            return accum
        })
    }

    peekFirst() {
        return this.root[0]
    }

    peekLast() {
        return this.root[this.root.length - 1]
    }

    absoluteConsecutiveHitCount() {
        if (this.root === `${REST}${REST}${REST}${REST}`) {
            return 0
        }

        const clone = this.clone()
        while (!(clone.peekFirst() === `${HIT}` && clone.peekLast() === `${REST}`)) {
            clone.rotate()
        }

        //const hitCount = clone.hitCount()
        const root = clone.root
        let returnStop = false
        let returnVal = 0
        root.split('').forEach((char, idx) => {
            console.log({ char, idx })
            if (!returnStop && char === `${REST}`) {
                returnVal = idx
                returnStop = true
                console.log({ char, idx })
            }
        })

        console.log({ returnVal, returnStop, root })

        return returnVal
    }

    symBreak() {
        switch (this.hitCount()) {
            case 0:
                this.root = '*-*-'
                return this
            case 1:
                return this
            case 2:

        }
    }

    symJoin() {

    }
}

export const generateBeat = (count = 4) => {
    const zero = new Beat()

    const firstRand = getRandomInt(3)
    if (firstRand > 0) {
        zero.invert()
    }

    return zero
}

/*
('----').symbreak() === ('*-*-')
('*---').symjoin() === ('**--')

(----) (A)
(*-*-) (B)
(**-) (C)
(*---) (D)

export const generateBeat = (key = 'A') => {
    const beatPatternsMap = {
        A: {
            root: '----' => ['-*-*'],
            inv: '****' => ['*-*-'],
        },
        B: {
            ['****'] => root: '*-*-' => ['**--', '*--*'],
            ['----'] => rot: '-*-*' => ['--**', '-**-'],
        },
        C: {
            ['*-*-'] => root: '**--' => ['*---', '***-'],
            ['*-*-'] => -rot: '*--*' => ['*-**', '**-*'],
            ['-*-*'] => rot: '-**-' => ['-*--', '--*-'],
            ['-*-*'] => rotrot: '--**' => ['-***', '---*'],
        },
        D: {
            ['**--'] => root: '*---',
            ['**--'] => -invrot: '***-',
            ['-**-'] => rot: '-*--',
            ['-**-'] => rotrot: '--*-',
            ['--**'] => -rot: '---*',
            ['--**'] => inv: '-***',
            ['*--*'] => invrot: '*-**',
            ['*--*'] => invrotrot: '**-*'
        }
    }
    return beatPatternsMap[key]
}

['****'] => ['>>**', '*>>*', '**>>'] => ['>>>*', ''*>>>'] => ['>>>>']
['*-*-', '-*-*'] => []
['**--', '--**'] => ['>>--', '-->>']
['*--*'] => ['>-->']
['-**-'] => ['->>-']
['***-'] => ['>>*-', '*>>-'] => ['>>>-']
['-***'] => ['->>*', '-*>>'] => ['->>>']
['*-**'] => ['*->>']
['**-*'] => ['>>-*']

*/

/*
BAR PATTERNS
 
(AAAA)
(AAAA)
*/
export const generateMeasure = (input) => {

}

/*
TEST SUITE
*/
let zero = new Beat('----')
let test = new Beat('----')

const testAssert = (expr, testStr) => {
    console.assert(expr.root === testStr, { expected: testStr, actual: expr.root, errorMsg: 'Test failed' })
    test = zero.clone()
}

testAssert(test, '----')
testAssert(test.invert(), '****')
testAssert(test.rotate(), '----')
testAssert(test.flip(), '----')

zero = new Beat('*-*-')
test = new Beat('*-*-')

testAssert(test, '*-*-')
testAssert(test.invert(), '-*-*')
testAssert(test.rotate(), '-*-*')
testAssert(test.flip(), '-*-*')

zero = new Beat('**--')
test = new Beat('**--')

testAssert(test, '**--')
testAssert(test.invert(), '--**')
testAssert(test.rotate(), '-**-')
testAssert(test.rotate().invert(), '*--*')
testAssert(test.rotate().rotate(), '--**')

zero = new Beat('*---')
test = new Beat('*---')

testAssert(test, '*---')
testAssert(test.flip(), '---*')
testAssert(test.rotate(), '-*--')
testAssert(test.rotate().flip(), '--*-')
testAssert(test.invert(), '-***')
testAssert(test.flip().invert(), '***-')
testAssert(test.rotate().invert(), '*-**')
testAssert(test.rotate().flip(), '--*-')

zero = new Beat('**--')
test = new Beat('**--')

testAssert(test.append('****'), '**--****')
testAssert(test.double(), '**--**--')

testAssert(test.head(), '**')
testAssert(test.tail(), '--')

zero = new Beat('**--')
test = new Beat('**--')

//testAssert(test.absoluteConsecutiveHitCount(), 1)
//testAssert(test.absoluteConsecutiveHitCount(), 2)