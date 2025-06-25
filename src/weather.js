export async function getWeather() {
    const API_KEY = 'VFWHDE4WL6YS6DRWURUV84S3A';
    const location = 'kuala lumpur';
    const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?key=${API_KEY}`;
    
    const response = await fetch(link, {mode: 'cors'});
    const data = await response.json();
    console.log(data);
}