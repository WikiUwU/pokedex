<script>
    export let pokemonID;

    async function getPokemonData(id) {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {method: "GET"});

            if (res.ok) {
                const data = await res.json();
                return data;
            }else {
                console.error(res)
            }
    };

    let promise = getPokemonData(pokemonID);

</script>

<style>
    .pokemon-stats {
        display: flex;
        flex-direction: column;
        position: absolute;
        width: 300px;
        top: 0;
        left: 300px;
    }

</style>

{#await promise then pokemonData}
    <ul class="pokemon-stats">
        <li>PokedexID: {pokemonID}</li>
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
{/await}

