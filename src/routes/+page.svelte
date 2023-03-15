<script>
	import { loop_guard } from "svelte/internal";

    async function getPokedexData(query) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon${query}`, {method: "GET"});
        const data = await res.json();

        if (res.ok) {
            return data.results;
        }else {
            throw new Error(data)
        }
    }
    let promise = getPokedexData("?limit=25");
    let queryType = "entryAmount";
    let input;

    function handleInput(query) {

        if (isNaN(parseInt(query))) {
            promise = getPokedexData(`/${query}`); 
        }else {
            const resultAmount = parseInt(query)
            promise = getPokedexData(`?limit=${resultAmount < 1 ? 25 : resultAmount}`);
        }

    }
</script>



<style>

    .wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-family: monospace;
        overflow: hidden;
    }

    h1 {
        font-size: 2.5rem;
        text-decoration: underline;
    }

    .result-amount-selection {
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

    .pokemon-stats {
        display: none;
        position: absolute;
        width: 100px;
        top: 0;
        left: 300px;
    }

    .pokemon-image:hover + .pokemon-stats{
        display: flex;
        flex-direction: column;
    }

    

</style>



<div class="wrapper">


    <h1>Pokedex App</h1>

    <div>
        <input type="radio" name="inputType" id="entryAmount" value="entryAmount" checked>
        <label for="">Enter amount of pokemon entry's to show</label>
        <input type="radio" name="inputType" id="pokemonSearch" value="pokemonSearch">
        <label for="">Search for a specific pokemon (name or id)</label>
    </div>

    {#if queryType === "entryAmount"}
        <input class="result-amount-selection" type="number" min="25" bind:value={input} on:input={handleInput(input)}> 
    {:else if queryType === "pokemonSearch"}
        <input class="result-amount-selection" type="text" bind:value={input} on:input={handleInput(input)}> 
    {/if}

    


    <div class="pokemon-list">
        {#await promise}
            <p>...waiting</p>
        {:then pokedexEntrys}

            {#each pokedexEntrys as entry, i}
                <div class="pokemon-entry">
                    <h2 class="pokemon-name">{
                        entry.name.charAt(0).toUpperCase() + entry.name.slice(1)
                    }</h2>

                    <img class="pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{i + 1}.png" alt={entry.name}>

                    <ul class="pokemon-stats">
                        <li>Weight: xx</li>
                        <li>Height: yy</li>
                    </ul>
                    
                </div>
            {/each}

        {/await}
    </div>


</div>


