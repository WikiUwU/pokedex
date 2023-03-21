<script>
    import PokemonEntryStats from "./PokemonEntryStats.svelte";

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

    .pokemon-entry {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border: 2px solid black;
        margin-bottom: 2rem;
        position: relative;
    }
    
    .pokemon-image {
        width: 300px;
        height: 300px;
    }

    .show-pokemon-stats {
        display: none;
    }

    .pokemon-image:hover + .show-pokemon-stats {
        display: block;
    }

</style>



<input class="entry-amount-input" type="number" min="25" bind:value={entryAmount} on:input={handleInput(entryAmount)}>

<div>
    {#await promise}
        <p>...waiting</p>
    {:then pokedexData} 

        {#each pokedexData.results as entry, i}
            <div class="pokemon-entry">
                <h2 class="pokemon-name">{
                    entry.name.charAt(0).toUpperCase() + entry.name.slice(1)
                }</h2>

                <img class="pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{i + 1}.png" alt={entry.name}>

                <div class="show-pokemon-stats">
                    <PokemonEntryStats pokedex_id={i+1}/>
                </div>

            </div>
        {/each}

    {/await}
</div>


