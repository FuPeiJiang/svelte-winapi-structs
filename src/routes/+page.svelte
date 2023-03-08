<svelte:head>
    <title>svelte-winapi-structs</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@500&display=swap" rel="stylesheet">
</svelte:head>

<script>

import flattened from './flattened2.json'
let currentStruct = ""
let currentArr = []
let expandedArr = []

const everythingObj = {}
for (const [key, value] of flattened) {
    everythingObj[key] = value
}

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
    currentStruct = weirdArr[0]
    const arr_of_type_name_offset = weirdArr[1]
    const tempArr = []
    function handleArr(arr_of_type_name_offset, savedOffset) {
        for (const type_name_offset_ of arr_of_type_name_offset) {
            const type = type_name_offset_[0]
            const offset = type_name_offset_[2]
            if (everythingObj.hasOwnProperty(type)) {
                handleArr(everythingObj[type], savedOffset + offset)
            } else {
                const copy_type_name_offset = type_name_offset_.slice()
                if (copy_type_name_offset.length === 4) {
                    copy_type_name_offset[2] += 8*savedOffset
                } else {
                    copy_type_name_offset[2] += savedOffset
                }
                tempArr.push(copy_type_name_offset)
            }
        }
    }
    handleArr(arr_of_type_name_offset, 0)
    currentArr = maybeBits(arr_of_type_name_offset)
    expandedArr = maybeBits(tempArr)
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}

</script>

<h4>{currentStruct}</h4>
<div style="display: flex; flex-direction: row;">
    <div>
        {#each currentArr as element}
        <p>{element[0]} {element[1]} {element[2]}</p>
        {/each}
    </div>
    <div>
        {#each expandedArr as element}
        <p>{element[0]} {element[1]} {element[2]}</p>
        {/each}
    </div>
</div>

<div>
    {#each flattened as weirdArr}
    <button on:click={()=>handleClick(weirdArr)}>{weirdArr[0]}</button>
    {/each}
</div>

<style>
    * {
        font-family: 'Fira Code', monospace;
    }
</style>
