import { getWeather } from "./weather";
import "./styles.css";


document.querySelector('#search-btn').addEventListener('click', () => {
    getWeather(document.querySelector('#search').value);
});