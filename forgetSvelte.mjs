import flattened from './src/routes/flattened3.json' assert { type: "json" }
import fs from "fs"

const everythingObj = {}
for (const [key, value] of flattened) {
    everythingObj[key] = value
}

const you_would_never_guess = flattened.map(idk=>handleClick(idk))

function handleClick(weirdArr) {
    const tempTableArr = []
    let maxDepth = -Infinity
    function handle(typeNameSize, saveIdx, depth, savedOffset, carryString) {
        if (saveIdx === tempTableArr.length) {
            tempTableArr.push([])
        }
        let sumLength = 0
        if (everythingObj.hasOwnProperty(typeNameSize[0])) {
            const arrEditLater = [typeNameSize[0]]
            tempTableArr[saveIdx].push(arrEditLater)
            for (const typeNameSize2 of everythingObj[typeNameSize[0]][1]) {
                sumLength+=handle(typeNameSize2, saveIdx + sumLength, depth + 1, typeNameSize2[2] + savedOffset, `${carryString}${typeNameSize[1]}.`)
            }
            arrEditLater.push(sumLength)
        } else {

            let offset_str
            if (typeNameSize.length === 4) {
                offset_str = `${Math.trunc(savedOffset/8)}bytes,${savedOffset%8}bits`
            } else {
                offset_str = `${savedOffset}`
            }

            if (depth > maxDepth) {
                maxDepth = depth
            }
            tempTableArr[saveIdx].push(typeNameSize[0], [`${carryString}${typeNameSize[1]}`, offset_str], depth)
            sumLength = 1
        }
        return sumLength
    }
    handle([weirdArr[0], ""], 0, 0, 0, "")
    for (const arr_ of tempTableArr) {
        const depth = arr_.pop()
        const diff = maxDepth - depth
        arr_.splice(arr_.length - 1, 0, ...((new Array(diff)).fill("")))
    }
    return {tableArr:tempTableArr, current_sizeof:weirdArr[1][0]}
}


const text = you_would_never_guess.map(({tableArr, current_sizeof})=>
`<table>${tableArr.map(rowArr=>`<tr>${Array.from({length: rowArr.length - 1}, (_, i) => (typeof rowArr[i] === "object")
? `<td rowspan="${rowArr[i][1]}"${rowArr[i].length > 2 ? ` colspan="${rowArr[i][2]}"` : ""}>${rowArr[i][0]}</td>`
: (
    (rowArr[i]) ? `<td>${rowArr[i]}</td>` : `<td class="d"></td>`
) ).join("")}<td>${rowArr[rowArr.length-1][0]}</td><td class="n">${rowArr[rowArr.length-1][1]}</td></tr>`).join("")}</table><p>│
└─${current_sizeof}</p>`
).join("")

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>winapi-structs, offsets, sizeof</title><style>*{font-family:'Fira Code',Consolas,monaco,monospace;}table{border-collapse:collapse;}td{border:1em solid black}.d{background-image:linear-gradient(-45deg,#434343 12.5%,#202020 12.5%,#202020 50%,#434343 50%,#434343 62.5%,#202020 62.5%,#202020 100%);background-size:8px 8px;}.n{padding-left:0.5em;font-weight:bold;border:none;}p{white-space:pre;font-weight:bold;margin-top:0px;}</style></head><body>${text}</body></html>`
fs.writeFileSync("./docs/index.html", html)
