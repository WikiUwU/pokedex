<script>
    import PokemonEntry from "./PokemonEntry.svelte";

    async function getPokedexData(entryAmount) {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${entryAmount}`, {method: "GET"});

            if (res.ok) {
                const data = await res.json();
                return data;
            }else {
                console.error(res)
            }
    };
    let entryAmount = 25;
    let promise = getPokedexData(25)
    let debounceTimer;

    function handleInput(entryAmount) {
        clearTimeout(debounceTimer);

        entryAmount < 1 ? entryAmount = 25 : entryAmount;

        debounceTimer = setTimeout(()=> {
            promise = getPokedexData(entryAmount)
        }, 500);
    };

</script>



<style>
    .entry-amount-input {
        margin-bottom: 1rem;
    }
</style>



<input class="entry-amount-input" type="number" min="25" bind:value={entryAmount} on:input={handleInput(entryAmount)}>

<div>
    {#await promise}
        <p>...waiting</p>
    {:then pokedexData} 

        {#each pokedexData.results as entry}
            <PokemonEntry pokemonName={entry.name}/>
        {/each}

    {/await}
</div>


