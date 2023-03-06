<svelte:head>
    <title>svelte-winapi-structs</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@500&display=swap" rel="stylesheet">
</svelte:head>

<script>

import flattened from './flattened1.json'
let currentArr = []

function handleClick(arr_of_type_name_offset) {
    currentArr = arr_of_type_name_offset
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}

</script>

{#each currentArr as element}
<p>{element[0]} {element[1]} {element[2]}</p>
{/each}

{#each flattened as weirdArr}
<button on:click={()=>handleClick(weirdArr[1])}>{weirdArr[0]}</button>
{/each}

<style>
    * {
        font-family: 'Fira Code', monospace;
    }
</style>
