const Fraction = require('fraction.js');

class CustomFraction {
    constructor(numerator, denominator = 1) {
        this.fraction = new Fraction(numerator, denominator);
    }

    add(other) {
        return new CustomFraction(this.fraction.add(other.fraction));
    }


    subtract(other) {
        return new CustomFraction(this.fraction.sub(other.fraction));
    }

    multiply(other) {
        return new CustomFraction(this.fraction.mul(other.fraction));
    }

    divide(other) {
        return new CustomFraction(this.fraction.div(other.fraction));
    }

    toString() {
        return this.fraction.toString();
    }
}

function print(M, msg) {
    console.log("======" + msg + "=========");
    M.forEach(row => {
        if (Array.isArray(row)) {
            console.log(row.map(el => el.toString()).join(" "));
        } else {
            console.log(row.toString());
        }
    });
    console.log("==========================");
}

function findPivot(M, k) {
    let i_max = k;
    for (let i = k + 1; i < M.length; ++i) {
        if (Math.abs(M[i][k].fraction.numerator) > Math.abs(M[i_max][k].fraction.numerator)) {
            i_max = i;
        }
    }
    return i_max;
}

function swapRows(M, i_max, k) {
    if (i_max !== k) {
        [M[i_max], M[k]] = [M[k], M[i_max]];
    }
}

function makeM(A, b) {
    for (let i = 0; i < A.length; ++i) {
        A[i].push(b[i]);
    }
}

function diagonalize(M) {
    const m = M.length;
    const n = M[0].length;
    for (let k = 0; k < Math.min(m, n); ++k) {
        const i_max = findPivot(M, k);
        if (M[i_max][k].fraction.numerator === 0) {
            throw "Matrix is singular";
        }
        swapRows(M, i_max, k);
        print(M, `Swapped row ${k + 1} with row ${i_max + 1}`);

        for (let i = k + 1; i < m; ++i) {
            const c = M[i][k].divide(M[k][k]);
            for (let j = k + 1; j < n; ++j) {
                M[i][j] = M[i][j].subtract(M[k][j].multiply(c));
            }
            M[i][k] = new CustomFraction(0);
            print(M, `Row ${i + 1} after elimination using row ${k + 1}`);
        }
    }
}

function substitute(M) {
    const m = M.length;
    for (let i = m - 1; i >= 0; --i) {
        const x = M[i][m].divide(M[i][i]);
        console.log(`Substitution: Row ${i + 1} = Row ${i + 1} / (${M[i][i].toString()})`);
        for (let j = i - 1; j >= 0; --j) {
            M[j][m] = M[j][m].subtract(x.multiply(M[j][i]));
            M[j][i] = new CustomFraction(0);
            print(M, `Row ${j + 1} updated during back substitution using row ${i + 1}`);
        }
        M[i][m] = x;
        M[i][i] = new CustomFraction(1);
        print(M, `Row ${i + 1} after back substitution`);
    }
}

function extractX(M) {
    return M.map(row => row[row.length - 1]);
}

function solve(A, b) {
    makeM(A, b);
    print(A, "Augmented Matrix [A|b]");
    diagonalize(A);
    substitute(A);
    return extractX(A);
}

// Example usage:
const A = [
    [new CustomFraction(2), new CustomFraction(5), new CustomFraction(3)],
    [new CustomFraction(1), new CustomFraction(2), new CustomFraction(3)],
    [new CustomFraction(1), new CustomFraction(0), new CustomFraction(3)]
];

const b = [new CustomFraction(6), new CustomFraction(1), new CustomFraction(-6)];

print(A, "Matrix A");
print(b, "Vector b");

const x = solve(A, b);

print(x, "Solution x");
