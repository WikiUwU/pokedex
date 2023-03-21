<script>
    export let pokedex_id

    let promise;

    async function getpokemonData(pokedex_id) {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokedex_id}`, {method: "GET"});

            if (res.ok) {
                const data = await res.json();
                return data;
            }else {
                console.error(res)
            }
    };

    promise = getpokemonData(pokedex_id);
</script>

<style>
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
        width: 300px;
        top: 0;
        left: 300px;
    }

    .pokemon-image:hover + .pokemon-stats{
        display: flex;
        flex-direction: column;
    }
</style>


{#await promise}
    ...waiting for Data
{:then pokemonData} 
    <div class="pokemon-entry">

        <h2 class="pokemon-name">{
            pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)
        }</h2>

        <img class="pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pokedex_id}.png" alt="Image of {pokemonData.name}">

        <ul class="pokemon-stats">
            <li>PokedexID: {pokedex_id}</li>
            <li>Weight: {Number(pokemonData.weight) / 10} kg</li> 
            <li>Height: {Number(pokemonData.height) * 10} cm</li>
            <li>Base Experience: {pokemonData.base_experience}</li>
            <li>
                Abilities:
                <ul>
                    {#each pokemonData.abilities as ability}
                        <li>{ability.ability.name} {#if ability.is_hidden} <span> - Hidden Ability</span>{/if}</li> 
                        
                    {/each}
                </ul>
            </li>
        </ul>
        
    </div>
{/await}