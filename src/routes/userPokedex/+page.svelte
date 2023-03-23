<!-- 
    Aufgaben:
    -Individuelle Pokemonsuche im Pokedex -> zwei Radio-Buttons zur Auswahl

    -Zwei Ansichten: -ein allgemeiner allwissender Pokedex 
                     - ein eigener Pokedex, wo man die einem selber bekannten Pokemons eintragen kann
                            -> die Einträge (oder zumindest die PokemonID der jeweils bekannten Pokemons) irgendwie Sessionübergreifend speichern
                                    -> localStorage ODER ein Backend 'aufsetzen' und darüber auf eine Datenbank (MySQL/SQLite/MongoDB) zugreifen und dort speichern -> nach Node Paackages schauen, 
                                    womit ich fast kein richtiges backend brauche ...oder Laravel als backend aufsetzen 
                    -Möglichkeit Pokemons aus dem eigenen Pokedex zu entfernen (warum man auch immer das tun würde)
            
 -->
<script>
	// import UserPokedexEntry from './UserPokedexEntry.svelte';
	import userPokedex from '../stores.js';
    import { onMount } from 'svelte';

	let promise;
	let input;



	// Send a GET request over to the 'backend' (+server.js API Endpoint) to get data from MySQL database
	// SELECT `pokedex_id` FROM `pokedex`.`test` ORDER BY `pokedex_id` ASC;
	// async function getUserPokedexData() {
	// 	const res = await fetch(
	// 		'/api/mysql-conn?query=SELECT `pokedex_id` FROM `pokedex`.`test` ORDER BY `pokedex_id` ASC'
	// 	);
	// 	const data = await res.json();
	// 	return data[0];
	// }

	// Send a POST request over to the 'backend' (+server.js API Endpoint) to post data to the MySQL database
	async function addNewPokemonToUserPokedex(pokedex_id) {
		if (isNaN(pokedex_id)) {
			alert("The pokemon you want to add doesn't exist");
			return;
		}

		const query = `INSERT INTO \`test\` (\`pokedex_id\`) VALUES`;

		const res = await fetch('/api/mysql-conn', {
			method: 'POST',
			body: JSON.stringify({ query, pokedex_id }),
			headers: {
				'content-type': 'application/json'
			}
		});

		const data = await res.json();
		return data;
	}

	async function addPokemon(nameORid) {
		// Check if the pokemon the user wants to add actually exists by making a call to the Pokedex API and checking the response
		if (Number(nameORid) < 1) {
			alert("Please enter a valid pokemon name or it's ID");
			return;
		}

		if (isNaN(Number(nameORid))) {
			nameORid = nameORid.toLowerCase();
		}

		const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameORid}`, { method: 'GET' });

		if (!res.ok) {
			alert("Please enter a valid pokemon name or it's ID");
			return;
		}

		const pokedexData = await res.json();


		let databaseResponse = await addNewPokemonToUserPokedex(pokedexData.id);

		if (databaseResponse === 'This pokemon is already part of your pokedex') {
			alert(databaseResponse);
		} else {
			const newUserPokedexData = [...$userPokedex, pokedexData]
			newUserPokedexData.sort((a, b) => a.id - b.id);
			userPokedex.set(newUserPokedexData);
			console.log($userPokedex)
			alert(
				`${
					pokedexData.name.charAt(0).toUpperCase() + pokedexData.name.slice(1)
				} was sucessfully added to your pokedex`
			);
		}
	}



    function addToStore(pokedexEntry) {
        const newUserPokedexStoreData = [...$userPokedex, pokedexEntry];
		newUserPokedexStoreData.sort((a, b) => a.id - b.id);
        userPokedex.set(newUserPokedexStoreData);
        console.log($userPokedex)
    }


    onMount(() => {
        if ($userPokedex === '') {
            fetch('/api/mysql-conn?query=SELECT `pokedex_id` FROM `pokedex`.`test` ORDER BY `pokedex_id` ASC')
            .then(res => res.json())
            .then(data => {
                for (let i = 0; i < data[0].length; i++) {
                    fetch(`https://pokeapi.co/api/v2/pokemon/${data[0][i].pokedex_id}`)
                        .then(res => res.json())
                        .then(data => addToStore(data));
                }
            });
        }
    });

</script>





<nav>
	<a href="/">Pokedex</a>
	<a href="/userPokedex">User Pokedex</a>
</nav>

<div class="wrapper">
	<h1>User Pokedex</h1>

	<!-- <button on:click={addItem}>+</button> -->

	<form class="add-new-pokemon">
		<label for="addPokemonInput"
			>Enter the pokemon's name or id you wish to add to your pokedex:</label
		>
		<input type="text" name="addPokemonInput" id="addPokemonInput" bind:value={input} />

		<button on:click|preventDefault={addPokemon(input)} >Add new pokemon to your pokedex</button>
	</form>

	<!--Replaced by saving the entry data of each pokemon in the userPokedex into localStorage, removing the need to fetch the data on every page reload
		
		{#await promise}
		<p>...waiting</p>
	{:then userPokedexData}
		{#each userPokedexData as userPokedexEntry}
			<UserPokedexEntry pokedex_id={userPokedexEntry.pokedex_id} />
		{/each}
	{/await} -->

    <!-- {#each $userPokedex as userPokedexEntry}
        <UserPokedexEntry pokedex_id={userPokedexEntry.pokedex_id} />
    {/each} -->

    {#each $userPokedex as userPokedexEntry}
        <div class="pokemon-entry">

            <h2 class="pokemon-name">{
                userPokedexEntry.name.charAt(0).toUpperCase() + userPokedexEntry.name.slice(1)
            }</h2>

            <img class="pokemon-image" src={userPokedexEntry.sprites.other['official-artwork'].front_default} alt="Image of {userPokedexEntry.name}">

            <ul class="pokemon-stats">
                <li>PokedexID: {userPokedexEntry.id}</li>
                <li>Weight: {Number(userPokedexEntry.weight) / 10} kg</li> 
                <li>Height: {Number(userPokedexEntry.height) * 10} cm</li>
                <li>Base Experience: {userPokedexEntry.base_experience}</li>
                <li>
                    Abilities:
                    <ul>
                        {#each userPokedexEntry.abilities as ability}
                            <li>{ability.ability.name} {#if ability.is_hidden} <span> - Hidden Ability</span>{/if}</li> 
                            
                        {/each}
                    </ul>
                </li>
            </ul>
            
        </div>
    {/each}

</div>







<style>
	* {
		font-family: monospace;
	}

	nav {
		display: flex;
		justify-content: center;
	}

	a {
		padding: 0 1rem;
	}

	.wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		overflow: hidden;
	}

	h1 {
		font-size: 2.5rem;
		text-decoration: underline;
	}

	.add-new-pokemon {
		display: flex;
		flex-direction: column;
	}

	.add-new-pokemon * {
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
        width: 300px;
        top: 0;
        left: 300px;
    }

    .pokemon-image:hover + .pokemon-stats{
        display: flex;
        flex-direction: column;
    }
</style>
