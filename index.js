function Fraction(numerator, denominator = 1) {
    this.numerator = numerator;
    this.denominator = denominator;

    const gcd = function(a, b) {
        if (!b) return a;
        return gcd(b, a % b);
    };

    const divisor = gcd(this.numerator, this.denominator);
    this.numerator /= divisor;
    this.denominator /= divisor;
}

Fraction.prototype.add = function(other) {
    const numerator = this.numerator * other.denominator + other.numerator * this.denominator;
    const denominator = this.denominator * other.denominator;
    return new Fraction(numerator, denominator);
};

Fraction.prototype.subtract = function(other) {
    const numerator = this.numerator * other.denominator - other.numerator * this.denominator;
    const denominator = this.denominator * other.denominator;
    return new Fraction(numerator, denominator);
};

Fraction.prototype.multiply = function(other) {
    const numerator = this.numerator * other.numerator;
    const denominator = this.denominator * other.denominator;
    return new Fraction(numerator, denominator);
};

Fraction.prototype.divide = function(other) {
    const numerator = this.numerator * other.denominator;
    const denominator = this.denominator * other.numerator;
    return new Fraction(numerator, denominator);
};

Fraction.prototype.toString = function() {
    if (this.denominator === 1) {
        return `${this.numerator}`;
    }
    return `${this.numerator}/${this.denominator}`;
};

function print(M, msg) {
    console.log("======" + msg + "=========");
    for (let k = 0; k < M.length; ++k) {
        if (Array.isArray(M[k])) {
            console.log(M[k].map(el => el.toString()).join(" "));
        } else {
            console.log(M[k].toString());
        }
    }
    console.log("==========================");
}

function diagonalize(M) {
    const m = M.length;
    const n = M[0].length;
    for (let k = 0; k < Math.min(m, n); ++k) {
        const i_max = findPivot(M, k);
        if (M[i_max][k].numerator === 0) {
            throw "Matriks singular";
        }
        swap_rows(M, k, i_max);
        print(M, `Tukar baris ${k + 1} dengan baris ${i_max + 1}`);

        for (let i = k + 1; i < m; ++i) {
            const c = M[i][k].divide(M[k][k]);
            // console.log(`Menghilangkan elemen di baris ${i + 1}, kolom ${k + 1}: Baris ${i + 1} = Baris ${i + 1} - (${c.toString()}) * Baris ${k + 1}`);
            for (let j = k + 1; j < n; ++j) {
                M[i][j] = M[i][j].subtract(M[k][j].multiply(c));
            }
            M[i][k] = new Fraction(0);
            print(M, `Baris ${i + 1} setelah eliminasi menggunakan baris ${k + 1}`);
        }
    }
}

function findPivot(M, k) {
    let i_max = k;
    for (let i = k + 1; i < M.length; ++i) {
        if (Math.abs(M[i][k].numerator) > Math.abs(M[i_max][k].numerator)) {
            i_max = i;
        }
    }
    return i_max;
}

function swap_rows(M, i_max, k) {
    if (i_max !== k) {
        const temp = M[i_max];
        M[i_max] = M[k];
        M[k] = temp;
    }
}

function makeM(A, b) {
    for (let i = 0; i < A.length; ++i) {
        A[i].push(b[i]);
    }
}

function substitute(M) {
    const m = M.length;
    for (let i = m - 1; i >= 0; --i) {
        const x = M[i][M[i].length - 1].divide(M[i][i]);
        console.log(`Substitusi: Baris ${i + 1} = Baris ${i + 1} / (${M[i][i].toString()})`);
        for (let j = i - 1; j >= 0; --j) {
            M[j][M[j].length - 1] = M[j][M[j].length - 1].subtract(x.multiply(M[j][i]));
            M[j][i] = new Fraction(0);
            print(M, `Baris ${j + 1} diperbarui selama substitusi menggunakan baris ${i + 1}`);
        }
        M[i][M[i].length - 1] = x;
        M[i][i] = new Fraction(1);
        print(M, `Baris ${i + 1} setelah substitusi`);
    }
}


function extractX(M) {
    const x = [];
    const m = M.length;
    const n = M[0].length;
    for (let i = 0; i < m; ++i) {
        x.push(M[i][n - 1]);
    }
    return x;
}

function solve(A, b) {
    makeM(A, b);
    print(A, "Matriks Augmented [A|b]");
    diagonalize(A);
    substitute(A);
    const x = extractX(A);
    return x;
}

const A = [
    [new Fraction(2), new Fraction(3), new Fraction(1)],
    [new Fraction(0), new Fraction(6), new Fraction(3)],
    [new Fraction(1), new Fraction(1), new Fraction(7)], 
    [new Fraction(0), new Fraction(1), new Fraction(5)]
];


const b = [new Fraction(4), new Fraction(9), new Fraction(5), new Fraction(6)];

print(A, "Matriks A");
print(b, "Vektor b");

const x = solve(A, b);

print(x, "Solusi x");
