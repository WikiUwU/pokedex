<script>
	import { loop_guard } from "svelte/internal";
    let resultAmount = 25;
    let promise = getPokedexData(resultAmount);

    async function getPokedexData(amount = 1) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${amount}`, {method: "GET"});
        const data = await res.json();

        if (res.ok) {
            return data.results;
        }else {
            throw new Error(data)
        }
    }

    function handleInput(amount) {
        promise = getPokedexData(amount);
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

    <p>Please enter the amount of entry's to display or search for a specific pokemon:</p>
    <input class="result-amount-selection" type="number" min="25" bind:value={resultAmount} on:input={handleInput(resultAmount < 1 ? resultAmount = 1 : resultAmount)}> 


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


