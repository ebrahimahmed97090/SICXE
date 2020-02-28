let fl = document.querySelector('.form-control-file');
let sub = document.querySelector('.ss');
let readFile = document.querySelector('.rd');
let tableContent = document.querySelector('.assmb');
let calculateAddresses = document.querySelector(".cadr");
let newTableRow;
let newTableData;
let programStatement;
let symbtbl = document.querySelector('.tbdysym');
let passOne = document.querySelector('.passon');
let ob = document.querySelector('.ob');
//array contains
//0 Label 1 MemoNic 2 Operand 3 addresses in decimal 4 format number 5 symbol address in decimal 6 flags 7 instruction number 8 displacement
// 9 instruction number in binary 10 instruction number merged with NI flags in format 3 and 4 and in format 1 and 2 it repeated
//11 displacement in HEX  12 displacement in binary 13 xbpe flags in binary 14 merged intruction number in hex 15 xbpe in hex 16 obcode
function readProgram(evt) {
    let PS = [];
    let f = evt.target.files[0];
    if (f) {
        let r = new FileReader();
        r.onload = function (e) {
            let contents = e.target.result;
            let ct = r.result;
            let lines = ct.split('\n');

            lines.forEach((line, index) => {
                PS[index] = line.split('\t');
            });
            PS.forEach((col, index) => {
                col.forEach((cell, ind) => {
                    cell = cell.trim();
                })
            })

        };
        r.readAsText(f);

        return PS;
    } else {
        alert("Failed to load file");
    }
}

function writeProgram(arr) {
    tableContent.innerHTML = '<h4>Program</h4><table class="table-bordered asmtbl"><thead><tr class="thd"><th class="p-1">label</th><th class="p-1">mnemonic</th><th class="p-1">operand</th></tr></thead><tbody class="tbdy"></tbody></table>';
    tbl = document.querySelector('.tbdy');

    for (let i = 0; i < arr.length; i++) {
        newTableRow = document.createElement("TR");
        tbl.appendChild(newTableRow);
        newTableRow.classList.add("rw");

    }
    newTableRow = document.querySelectorAll(".rw");
    for (let i = 0; i < arr.length; i++) {
        for (let k = 0; k < arr[i].length; k++) {
            let newTableData = document.createElement("TD");
            newTableRow[i].appendChild(newTableData);
            newTableData.innerText = arr[i][k];
            newTableData.classList.add('p-1')
            if (k === 0) {
                newTableData.classList.add('label')
            }
            if (k === 1) {
                newTableData.classList.add('memonic')
            }
            if (k === 2) {
                newTableData.classList.add('operand')
            }

        }
    }
    calculateAddresses.removeAttribute("disabled");
    fl.setAttribute("disabled", "");
    readFile.setAttribute("disabled", "");
}

function calculateaddresses(program) {
    let tableHead = document.querySelector('.thd');
    let startAddress = parseInt("0x" + program[0][2]);
    let newTableHead = document.createElement("TH");
    tableHead.appendChild(newTableHead);
    newTableHead.innerText = "addresses";
//handling addresses cases
    for (let i = 0; i < program.length; i++) {

        let newTableData = document.createElement("TD");
        newTableRow[i].appendChild(newTableData);
        newTableData.classList.add('p-1');

        if (i === 0) {
            program[i].push(startAddress);
            program[i].push("No/Format");
            newTableData.innerText = startAddress.toString(16).padStart(4, "0");
        } else if (i === 1) {
            program[i].push(startAddress);
            newTableData.innerText = startAddress.toString(16).padStart(4, "0");
        } else if (program[i][1] == "BASE") {
            program[i].push("");
            program[i].push("No/Format");
        } else if (program[i - 1][1] == "BASE") {
            if (program[i - 2][2].trim() === "") {
                startAddress += 1;
                program[i].push(startAddress);
                program[i - 2].push(1);
            } else if ((reg[0].indexOf(program[i - 2][2][0]) !== -1 && reg[0].indexOf(program[i - 2][2][2]) !== -1 && program[i - 2][2][1] == ",") || (reg[0].indexOf(program[i - 2][2][0]) !== -1 && program[i - 2][2].length === 1)) {
                startAddress += 2;
                program[i].push(startAddress);
                program[i - 2].push(2);
            } else if (program[i - 2][1][0] === "+") {
                startAddress += 4;
                program[i].push(startAddress);
                program[i - 2].push(4);
            } else if (program[i - 2][1] === "WORD") {
                startAddress += 3;
                program[i].push(startAddress);
                program[i - 2].push("No/Format");
            } else if (program[i - 2][1] === "RESW") {
                startAddress += (3 * parseInt(program[i - 1][2]));
                program[i].push(startAddress);
                program[i - 2].push("No/Format");
            } else if (program[i - 2][1] === "BYTE" && program[i - 2][2][0] === 'X' && program[i - 2][2][1] === '`') {

                startAddress += (Math.floor((program[i - 1][2].length - 3) / 2));
                program[i].push(startAddress);
                program[i - 2].push("No/Format");
            } else if (program[i - 2][1] === "BYTE" && program[i - 2][2][0] === 'C' && program[i - 2][2][1] === '`') {
                startAddress += program[i + 1][2].length - 4;
                program[i].push(startAddress);
                program[i - 2].push("No/Format");
            } else if (program[i - 2][1] === "BYTE" && (program[i - 2][2][0] !== 'C' || program[i - 2][2][0] === 'X')) {
                startAddress += 1;
                program[i].push(startAddress);
                program[i - 2].push("No/Format");
            } else if (program[i - 2][1] === "RESB") {
                startAddress += (parseInt(program[i - 1][2]));
                program[i].push(startAddress);
                program[i - 2].push("No/Format");
            } else {
                startAddress += 3;
                program[i].push(startAddress);
                program[i - 2].push(3);

            }

            newTableData.innerText = program[i][3].toString(16).padStart(4, "0").toUpperCase();

            newTableData.classList.add('address')
            continue;
        } else if (program[i - 1][2].trim() === "") {
            if (program[i - 1][1] === "RSUB") {
                startAddress += 3;
                program[i].push(startAddress);
                program[i - 1].push(3);
            } else {
                startAddress += 1;
                program[i].push(startAddress);
                program[i - 1].push(1);
            }
        } else if ((reg[0].includes(program[i - 1][2][0]) && reg[0].includes(program[i - 1][2][2]) && program[i - 1][2][1] == ",") || (reg[0].includes(program[i - 1][2][0]) && program[i - 1][2].trim().length === 1)) {
            startAddress += 2;
            program[i].push(startAddress);
            program[i - 1].push(2);
        } else if (program[i - 1][1][0] === "+") {
            startAddress += 4;
            program[i].push(startAddress);
            program[i - 1].push(4);
        } else if (program[i - 1][1] === "WORD") {
            startAddress += 3;
            program[i].push(startAddress);
            program[i - 1].push("No/Format");
        } else if (program[i - 1][1] === "RESW") {
            startAddress += (3 * parseInt(program[i - 1][2]));
            program[i].push(startAddress);
            program[i - 1].push("No/Format");
        } else if (program[i - 1][1] === "BYTE" && program[i - 1][2][0] === 'X' && program[i - 1][2][1] === '`') {

            startAddress += (Math.floor((program[i - 1][2].length - 3) / 2));
            program[i].push(startAddress);
            program[i - 1].push("No/Format");
        } else if (program[i - 1][1] === "BYTE" && program[i - 1][2][0] === 'C' && program[i - 1][2][1] === '`') {
            startAddress += program[i - 1][2].length - 4;
            program[i].push(startAddress);
            program[i - 1].push("No/Format");
        } else if (program[i - 1][1] === "BYTE" && (program[i - 1][2][0] !== 'C' || program[i - 1][2][0] === 'X')) {
            startAddress += 1;
            program[i].push(startAddress);
            program[i - 1].push("No/Format");
        } else if (program[i - 1][1] === "RESB") {
            startAddress += (parseInt(program[i - 1][2]));
            program[i].push(startAddress);
            program[i - 1].push("No/Format");
        } else {
            startAddress += 3;
            program[i].push(startAddress);
            program[i - 1].push(3);

        }
        if (i == program.length - 1) {
            program[i].push("No/Format")
        }
        if (i !== 0) {

            newTableData.innerText = program[i][3].toString(16).padStart(4, "0").toUpperCase();

            newTableData.classList.add('address')


        }

    }
}

function addressingModes(program) {
    let base;
    program.forEach((programs, i) => {
            if (programs[1] === "RESW" || programs[1] === "RESB" || programs[1] === "BASE" || programs[1] === "Start" || programs[1] === "END" || programs[4] == 2 || programs[4] == 1) {
                programs.push("N/A")
            }
            if (programs[1] === "WORD") {
                programs.push(parseInt(programs[2]).toString(16).padStart(6, "0").toUpperCase())
            } else if (programs[1] === "BYTE") {
                if (programs[2].search("X`") === 0) {
                    programs.push(programs[2].replace("X`", "").replace("`", "").padStart(2, "0"));

                } else if (programs[2].search("C`") === 0) {
                    programs.push(getstrASCII(programs[2]))
                }
            } else if (programs[1] === "RSUB") {
                programs.push(0)
            }
            if (programs[1] != "END") {
                if (programs[1] == "BASE") {
                    base = program[i][5];
                }
                if ((programs[6].i === 1 && programs[6].n === 0) || (programs[6].i === 0 && programs[6].n === 1)) {
                    if (!isNaN(programs[2].substring(1, programs[2].length))) {
                        programs.push(parseInt(programs[2].substring(1, programs[2].length)))
                    } else {
                        if (programs[6].b === 1) {
                            programs.push(programs[5] - base)
                        } else if (programs[6].p === 1) {
                            programs.push(programs[5] - program[i + 1][3])
                        } else if (programs[6].e === 1) {
                            programs.push(programs[5])
                        }
                    }

                } else if (programs[6].b === 1) {
                    programs.push(programs[5] - base)
                } else if (programs[6].p === 1) {
                    programs.push(programs[5] - program[i + 1][3])
                } else if (programs[6].e === 1) {
                    programs.push(programs[5])
                }
            }
        }
    )
}

function HexAddresses(program) {
    program.forEach(programs => {
        if (programs[5] === "N/S" || programs[4] === "No/Format") {
            programs.push("N/S")
        } else {
            if (programs[4] === 3) {
                programs.push(intToHexStrInFour(programs[8], programs[4]))
            } else if (programs[4] === 4) {
                programs.push(intToHexStrInFour(programs[8], programs[4]))
            }
        }
    })
}

function symbolTable(program) {
    let symbolTable = [[], []];
    passOne = document.querySelector('.passon');
    passOne.innerHTML = '<h4>pass one</h4><table class="table-bordered"><thead><tr class=""><th class="p-1">Symbol</th><th class="p-1">Adress</th></tr></thead><tbody class="tbdysym"></tbody></table>';
    symbtbl = document.querySelector('.tbdysym');
    for (let a = 0; a < program.length; a++) {
        if (program[a][0] !== "" && a !== 0) {
            symbolTable[0].push(program[a][0]);
            symbolTable[1].push(program[a][3]);
            newTableRow = document.createElement("TR");
            symbtbl.appendChild(newTableRow);
            newTableRow.classList.add("rwsym");
            newTableData = document.createElement("TD");
            newTableRow.appendChild(newTableData);
            newTableData.innerText = program[a][0];
            newTableData.classList.add('p-1');
            newTableData.classList.add('sym');
            newTableData = document.createElement("TD");
            newTableRow.appendChild(newTableData);
            newTableData.innerText = program[a][3].toString(16).padStart(4, "0").toUpperCase();
            newTableData.classList.add('p-1');
            newTableData.classList.add('addresses');
        }

    }
    return symbolTable
}

function addInstructions(program) {
    program.forEach((programs) => {
        if (programs[1] == "Start" || programs[1] == "RESW" || programs[1] == "RESB" || programs[1] == "BYTE" || programs[1] == "WORD" || programs[1] == "END" || programs[1] == "BASE") {
            programs.push("N/I")
        } else {
            opcodetable.forEach((op) => {
                if (programs[1].includes('+')) {
                    if (op.memoNic == programs[1].substring(1, programs[1].length)) {
                        programs.push(op.obCode)
                    }
                } else if (op.memoNic == programs[1]) {
                    programs.push(op.obCode)
                }
            });
        }
    })

}


function NIFlags(program) {
    let flgs = [];
    let base;
    program.forEach((e, q) => {
        flgs.push(new flags());
        if (e[1] == "BASE") {
            base = e[5];
        }
        if (e[1] === "Start" || e[1] === "BASE" || e[1] === "END" || e[1] === "BYTE" || program[q][1] === "WORD" || program[q][1] === "RESW" || program[q][1] === "RESB" || e[4] === 2 || e[4] === 1) {
            flgs[q] = {
                n: "N/A",
                i: "N/A",
                x: "N/A",
                b: "N/A",
                p: "N/A",
                e: "N/A"

            }

        } else if (e[1] === "RSUB") {
            flgs[q].n = 1;
            flgs[q].i = 1;
            flgs[q].x = 0;
            flgs[q].b = 0;
            flgs[q].p = 0;
            flgs[q].e = 0;
        } else {
            if (e[2][0] == "#") {
                flgs[q].n = 0;
                flgs[q].i = 1;
            } else if (e[2][0] == "@") {
                flgs[q].n = 1;
                flgs[q].i = 0;
            } else {
                flgs[q].n = 1;
                flgs[q].i = 1;
            }
            if (e[2].search(",X") !== -1) {
                flgs[q].x = 1;
            } else {
                flgs[q].x = 0;
            }
            if (e[2][0] === "#" || (e[2][0] === "@" && !isNaN(e[2].substring(1, e[2].length))) || e[1][0] === "+") {
                flgs[q].b = 0;
                flgs[q].p = 0;
            } else if ((e[5] - e[3]) >= -2048 && (e[5] - e[3]) <= 2047) {
                flgs[q].b = 0;
                flgs[q].p = 1;
            } else if ((e[5] - base) >= 0 && (e[5] - base) <= 4095) {
                flgs[q].b = 1;
                flgs[q].p = 0;
            }
            if (!isNaN(e[2].substring(1, e[2].length))) {
                flgs[q].b = 0;
                flgs[q].p = 0;
            }
            if (program[q][1][0] === "+") {
                flgs[q].e = 1;
            } else {
                flgs[q].e = 0;
            }
        }
        e.push(flgs[q])
    });

    return flgs
}

function intToHexStrInFour(str, format) {
    if (format === 3) {
        if (str < 0) {
            str = (0xFFF + str + 1).toString(16).substr(str.length - 3, str.length).padStart(3, "0").toUpperCase();
        } else {
            str = str.toString(16).padStart(3, "0").toUpperCase().substring(0, 3)
        }
        return str;
    } else if (format === 4) {
        return str.toString(16).padStart(5, "0").toUpperCase();
    }

}

function adrStrHexToBinaryInFour(program) {

    program.forEach(programs => {
        if (programs[11] === "N/S") {
            programs.push("N/S")
        } else {
            programs.push("");


            for (let i = 0; i < programs[11].length; i++) {

                programs[12] += (parseInt(programs[11][i], 16).toString(2).padStart(4, "0")) + " ";

            }

        }
    })
}

function flagsConcat(program) {
    program.forEach((prog, w) => {
        if (prog[6].n != "N/A") {
            prog.push(prog[6].x.toString() + prog[6].b.toString() + prog[6].p.toString() + prog[6].e.toString())
        } else {
            prog.push("No/Flags")
        }
    })
}

function instStrHexToBinary(program) {

    program.forEach(programs => {
        if (programs[7] === "N/I") {
            programs.push("N/I")
        } else {
            programs.push("");
            if (programs[4] === 4 || programs[4] === 3) {
                programs[9] += (parseInt(programs[7][0], 16).toString(2).padStart(4, "0")) + " " + (parseInt(programs[7][1], 16).toString(2).padStart(4, "0")).substring(0, 2) + " ";


            } else if (programs[4] === 2 || programs[4] === 1) {

                programs[9] += (parseInt(programs[7][0], 16).toString(2).padStart(4, "0")) + " " +
                    (parseInt(programs[7][1], 16).toString(2).padStart(4, "0")) + " ";


            }

        }
    })
}

function fullInstBinary(program) {

    program.forEach(programs => {
        if (programs[7] === "N/I") {
            programs.push("N/I")
        } else {
            programs.push("");
            if (programs[4] === 4 || programs[4] === 3) {
                programs[10] += (parseInt(programs[7][0], 16).toString(2).padStart(4, "0")) + " " + (parseInt(programs[7][1], 16).toString(2).padStart(4, "0")).substring(0, 2) + " " + programs[6].n.toString() + programs[6].i.toString();


            } else if (programs[4] === 2 || programs[4] === 1) {

                programs[10] += (parseInt(programs[7][0], 16).toString(2).padStart(4, "0")) + " " +
                    (parseInt(programs[7][1], 16).toString(2).padStart(4, "0")) + " ";


            }

        }
    })
}

function addSymbolAddress(program) {
    let sym = symbolTable(program);
    console.log(sym);
    program.forEach(programs => {

        if (programs[1] === "Start" || programs[1] === "RESW" || programs[1] === "RESB" || programs[1] === "BYTE" || programs[1] === "WORD" || programs[4] === 2 || programs[4] === 1 || programs[1] === "END") {
            programs.push("N/S")
        } else if (!isNaN(programs[2].substring(1, programs[2].length))) {
            programs.push(parseInt(programs[2].substring(1, programs[2].length)));
        } else {
            sym[0].forEach((z, index) => {
                let x = "";
                if (programs[2].includes("#") || programs[2].includes("@")) {
                    x = programs[2].substring(1, programs[2].length)
                } else if (programs[2].includes(",X")) {
                    x = programs[2].substring(0, programs[2].trim().length - 2);
                    console.log(x)
                } else {
                    x = programs[2]
                }

                if (x.trim() === z) {
                    programs.push(sym[1][index]);
                }
            });


        }
    });

}


function fromSeparatedBinaryToHex(program) {
    program.forEach(prog => {
        if (prog[10] === "N/I") {
            prog.push("N/I");


        } else {
            prog.push(prog[10].replace(/ /g, ''));
            prog[14] = parseInt(prog[14], 2).toString(16).padStart(2, "0").toUpperCase();
        }
        if (prog[13] === "No/Flags") {
            prog.push("No/Flags")
        } else {
            prog.push(prog[13].replace(/ /g, ''));
            prog[15] = parseInt(prog[15], 2).toString(16).padStart(1, "0").toUpperCase();
        }
    })
}

function obCode(program) {
    program.forEach(pro => {
        if (pro[1] === "WORD") {
            pro.push(parseInt(pro[2]).toString(16).padStart(6, "0").toUpperCase())
        } else if (pro[1] === "BYTE") {
            if (pro[2].search("X`") === 0) {
                pro.push(pro[2].replace("X`", "").replace("`", "").padStart(2, "0"));

            } else if (pro[2].search("C`") === 0) {
                pro.push(getstrASCII(pro[2]))
            }
        } else if (pro[1] === "RESW" || pro[1] === "RESB" || pro[1] === "Start" || pro[1] === "END") {
            pro.push("N/O")
        } else if (pro[1] === "BASE") {
            pro.push("BASE")
        } else if (pro[1] == "RSUB") {
            pro.push(pro[14] + pro[15] + "000");
        } else if (pro[4] === 3 || pro[4] === 4) {
            pro.push(pro[14] + pro[15] + pro[11]);
        } else if (pro[4] === 1) {
            pro.push(pro[7]);
        } else if (pro[4] === 2) {
            if (pro[2].trim().length === 1) {
                pro.push(pro[7] + reg[1][reg[0].indexOf(pro[2].trim())] + "0")
            } else if (pro[2].trim().length === 3) {
                pro.push(pro[7] + reg[1][reg[0].indexOf(pro[2][0].trim())] + reg[1][reg[0].indexOf(pro[2][2].trim())])
            }
        }
    })
}

function getstrASCII(gtsq) {
    let ASCIISTR = "";
    gtsq = gtsq.replace("C`", "").replace("`", "").trim();
    gtsq = gtsq.split("");
    for (let i = 0; i < gtsq.length; i++) {
        ASCIISTR += parseInt(ASCII[gtsq[i]]).toString(16).toUpperCase();
    }
    return ASCIISTR.padStart(6, "0")
}

function HTME(program) {
    let HTE = [["H", program[0][0].substr(0, 6).padEnd(6, '*'), program[0][2].padStart(7, "0"), (program[program.length - 1][3] - program[0][3]).toString(16).padStart(6, "0").toUpperCase()], ["E", program[0][2].padStart(7, "0").toUpperCase()]];
    let T = [];
    let M = [];
    let q = 0;
    let z = 1;
    for (let i = 0; i < program.length - 1; i++) {
        if (program[i][16] === "BASE") {
            q++;
            continue;
        }
        T.push(program[i][16]);

        if (program[i][16] === "N/O" || program[i + 1][16] === "N/O" || T.toString().replace(/,/g, "").length > 55) {

            T.splice(0, 0, "T", program[i - q][3].toString(16).padStart(6, "0").toUpperCase(), (program[i + 1][3] - program[i - q][3]).toString(16).padStart(2, "0").toUpperCase());
            if (T.length === 4 && T.includes("N/O")) {
                T = [];
                q = 0;
                continue;
            } else {
                HTE.splice(z, 0, T);
                T = [];
                q = 0;
                z++;
                continue;
            }
        }

        q++;
    }
    program.forEach((p, index) => {
        if (p[1][0] === "+" && p[2][0] !== "#") {
            M = ['M', (p[3] + 1).toString(16).padStart(6, "0"), p[11].length.toString().padStart(2,"0")];
            HTE.splice(z, 0, M);
            z++;
        }
    });
    return HTE;
}

function printPassTwo(program) {
    for (let i = 0; i < program.length; i++)
        if (program[i][11] === "N/I") {
            if (program[i][13] !== "N/O") {
                $(`<div class="wds"><h5>${i} ${program[i][1]} ${program[i][2]}</h5>
    <table class="table table-bordered">
        <thead>
        <tr>
            <th scope="col" class="text-center">OP Code</th>
            <th scope="col" class="text-center">X</th>
            <th scope="col" class="text-center">Address</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td colspan="3" class="text-center">${program[i][13]}</td>
        </tr>
        </tbody>
</div>`).appendTo(".passtw");
            }
        } else {
            $(`<div class="wds"><h5>${i} ${program[i][1]} ${program[i][2]}</h5>
    <table class="table table-bordered">
        <thead>
        <tr>
            <th scope="col" class="text-center">OP Code</th>
            <th scope="col" class="text-center">X</th>
            <th scope="col" class="text-center">Address</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="text-center">${program[i][11]}</td>
            <td class="text-center">${program[i][5]}</td>
            <td class="text-center">${program[i][7]}</td>
        </tr>
        <tr>
            <td class="text-center">${program[i][9]}</td>
            <td class="text-center">${program[i][5]}</td>
            <td class="text-center">${program[i][8]}</td>
        </tr>
        <tr>
            <td class="text-center">${program[i][11]}</td>
            <td colspan="2" class="text-center">${program[i][10]}</td>
        </tr>
        <tr>
            <td colspan="3" class="text-center">${program[i][13]}</td>
        </tr>
        </tbody>
</div>`).appendTo(".passtw");
        }
}

fl.addEventListener('change', e => {

    programStatement = readProgram(e);
    readFile.removeAttribute("disabled");
});

sub.addEventListener('submit', e => {
    e.preventDefault();
    writeProgram(programStatement);

});

calculateAddresses.addEventListener('click', e => {
    calculateaddresses(programStatement);
    ob.removeAttribute("disabled");
    calculateAddresses.setAttribute("disabled", "");
    readFile.setAttribute("disabled", "");
    addSymbolAddress(programStatement);
    NIFlags(programStatement);
    addInstructions(programStatement);
    addressingModes(programStatement);
    instStrHexToBinary(programStatement);
    fullInstBinary(programStatement);
    HexAddresses(programStatement);
    adrStrHexToBinaryInFour(programStatement);
    flagsConcat(programStatement);
    fromSeparatedBinaryToHex(programStatement);
    obCode(programStatement);
    console.log(HTME(programStatement));

    console.log(programStatement);
});

ob.addEventListener('click', e => {


    $(".ob").attr("disabled", "");

    $(".hte").removeAttr("disabled");


});

$(".hte").click(() => {
    /*let hte = HTE(programStatement);
    $(".assmb").append(`<div class="row"><div class="col-12"><div class="htect"></div></div></div>`)
    for (let i = 0; i < hte.length; i++) {
        hte[i].forEach(e => {
            $(".htect").append(`<p class="d-inline-block">${e},</p>`)

        });
        $(".htect").append(`<br>`)

    }
    $(".hte").attr("disabled", "")*/
});