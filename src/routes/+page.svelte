<!-- 
    Aufgaben:
    -Individuelle Pokemonsuche im Pokedex -> zwei Radio-Buttons zur Auswahl

    -Zwei Ansichten: -ein allgemeiner allwissender Pokedex 
                     - ein eigener Pokedex, wo man die einem selber bekannten Pokemons eintragen kann
            
 -->

<script>
	import { validate_each_argument } from "svelte/internal";
    import PokedexEntryList from "./pokedexEntryList.svelte";
    import PokemonSearch from "./pokemonSearch.svelte";

    let queryType = "entryAmount";
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

    .query-type-selection {
        margin-bottom: 1rem;
    }

</style>


<nav>
    <a href="/">Pokedex</a>
    <a href="/userPokedex">User Pokedex</a>
</nav>

<div class="wrapper">

    <h1>Pokedex</h1>

    <div class="query-type-selection">
        <input type="radio" name="queryType" id="entryAmount" value="entryAmount" checked bind:group={queryType}>
        <label for="entryAmount">Show a number of entry's in the pokedex</label>

        <input type="radio" name="queryType" id="pokemonSearch" value="pokemonSearch" bind:group={queryType}>
        <label for="pokemonSearch">Search for a specific pokemon</label>
    </div>

    {#if queryType === "entryAmount"}
        <PokedexEntryList/>
    {:else if queryType === "pokemonSearch"}
        <PokemonSearch/>
    {/if}

</div>