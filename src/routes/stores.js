import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = '';
let initialValue = defaultValue;

if (browser) {
    if (window.localStorage.getItem('userPokedex') !== null && window.localStorage.getItem('userPokedex') !== 'undefined') {
        initialValue = JSON.parse(window.localStorage.getItem('userPokedex'));
    }
}

const userPokedex = writable(initialValue);

userPokedex.subscribe(value => {
    if (browser && value !== undefined && value !== '') {
            window.localStorage.removeItem('userPokedex');
            window.localStorage.setItem('userPokedex', JSON.stringify(value))
        }
    }
)
 
export default userPokedex;