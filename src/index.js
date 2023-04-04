import './css/styles.css';
import {fetchCountries} from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

Notify.init({
    showOnlyTheLastOne: true
});

input.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(event) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';

    let name = event.target.value.trim();

    fetchCountries(name).then(response => {
        if(response.length === 1) {
            response.map(a => {
                countriesMarkup(a);
            });
        } else if (response.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.');
            countryList.innerHTML = '';
            countryInfo.innerHTML = '';
        } else {
            response.forEach(element => {                  
                fetchCountryList(element);                  
                });            
        }
    }).catch(() => {
        if(!name.ok) {
            Notify.failure('Oops, there is no country with that name');
        }
    });
}


function fetchCountryList(countryObject) {
    const countryListMarkup = `<li><img src="${countryObject.flags.svg}" height="30px"></img>
    <p>${countryObject.name.official}</p></li>`;

    countryList.insertAdjacentHTML('afterbegin', countryListMarkup); 
}


function countriesMarkup(countryObject) {
    const languages = Object.values(countryObject.languages).join(', ');
    const markup = `<div class="country-heading-wrap"><img src=${countryObject.flags.svg} height="50px"></img>
    <h2>${countryObject.name.official}</h2></div>
    <p>Capital: <span>${countryObject.capital}</span></p>
    <p>Population: <span>${countryObject.population}</span></p>
    <p>Languages: <span>${languages}</span></p>`;

    countryInfo.insertAdjacentHTML('beforeend', markup);
}