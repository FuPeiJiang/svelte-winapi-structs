<svelte:head>
    <title>svelte-winapi-structs</title>
</svelte:head>

<script>

import flattened from './flattened3.json'

const everythingObj = {}
for (const [key, value] of flattened) {
    everythingObj[key] = value
}

const you_would_never_guess = flattened.map(idk=>handleClick(idk))

function maybeBits(arr_of_type_name_offset) {
    const copy_arr_of_type_name_offset = []
    for (const type_name_offset_ of arr_of_type_name_offset) {
        const copy_type_name_offset = type_name_offset_.slice()
        if (copy_type_name_offset.length === 4) {
            copy_type_name_offset[2] = `${Math.trunc(copy_type_name_offset[2]/8)}bytes,${copy_type_name_offset[2]%8}bits`
        }
        copy_arr_of_type_name_offset.push(copy_type_name_offset)
    }
    return copy_arr_of_type_name_offset
}

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

</script>



<div>
    {#each you_would_never_guess as {tableArr, current_sizeof}}
    <table>
        <tbody>
            {#each tableArr as rowArr}
            <tr>
            {#each {length:rowArr.length - 1} as _, i}
            {#if typeof rowArr[i] === "object"}
                <td rowspan={rowArr[i][1]} colspan={rowArr[i].length > 2 && rowArr[i][2]}>{rowArr[i][0]}</td>
            {:else}
                {#if rowArr[i]}
                <td>{rowArr[i]}</td>
                {:else}
                <td class="diagonal"></td>
                {/if}
            {/if}
            {/each}
            <td>{rowArr[rowArr.length-1][0]}</td>
            <td class="number">{rowArr[rowArr.length-1][1]}</td>
            </tr>
            {/each}

        </tbody>
    </table>

    <p>???
??????{current_sizeof}</p>
    {/each}
</div>

<style>
    * {
        font-family: 'Fira Code', Consolas, monaco, monospace;
    }
    table {
        border-collapse: collapse;
    }
    td {
        border: 1em solid black
    }
    .diagonal {
        background-image: linear-gradient(
  -45deg,
  #434343 12.5%,
  #202020 12.5%, #202020 50%,
  #434343 50%, #434343 62.5%,
  #202020 62.5%, #202020 100%
);
    background-size: 8px 8px;
    /* #202020 */
    /* #434343 */
    /* #5645645 */
    }
    .number {
        padding-left: 0.5em;
        font-weight: bold;
        border: none;
    }
    p {
        white-space: pre;
        font-weight: bold;
        margin-top: 0px;
    }
</style>
