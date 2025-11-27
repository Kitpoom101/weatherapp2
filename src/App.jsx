import { useEffect, useState } from 'react'
import './App.css'
import {weather} from './weather.js'
import brokenClouds from './assets/broken-clouds.png';
import clearSky from './assets/clear-sky.png';
import fewClouds from './assets/few-clouds.png';
import scatteredClouds from './assets/scattered-clouds.png';
import showerRain from './assets/shower-rain.png';
import rain from './assets/rain.png';
import thunderstorm from './assets/thunderstorm.png';
import snow from './assets/snow.png';
import mist from './assets/mist.png';

function App() {
  const [city, setCity] = useState("");
  const [find, setFind] = useState(false);
  const [time, setTime] = useState("");
  const [clouds, setClouds] = useState("");
  const [date, setDate] = useState(new Date());
  const [temp, setTemp] = useState("");
  const [humid, setHumid] = useState("");
  const [wind, setWind] = useState("");
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const allIcon = {
    "01": clearSky,
    "02": fewClouds,
    "03": scatteredClouds,
    "04": brokenClouds,
    "09": showerRain,
    "10": rain,
    "11": thunderstorm,
    "13": snow,
    "50": mist,
  }
  const iconName = {
    "01": "Clear Sky",
    "02": "Few Clouds",
    "03": "Scattered Clouds",
    "04": "Broken Clouds",
    "09": "Shower Rain",
    "10": "Rain",
    "11": "Thunderstorm",
    "13": "Snow",
    "50": "Mist",
  };
  let data;

  function handleCityChange(e) {
    const value = e.target.value;
    setCity(value);
    if(value === ""){
      setFind(false);
    };
  }

  async function handleGetWeather(){
    if(city === "") return ;
    setLoading(true);
    setError(""); // reset error
    setFind(true);
    try {
      const res = await weather(city.toLowerCase());
      console.log(res);
      if(!res.ok){
        throw new Error("Failed to fetch data");
      }
      data = await res.json();
      setClouds(data.weather[0].icon.slice(0,2));
      setTime(data.timezone/3600);
      setTemp(data.main.temp);
      setHumid(data.main.humidity);
      setWind(data.wind.speed);
      setCityName(data.name);
    }catch(err){
      setError(err.message || "Something went wrong");
      setTimeout(() => setError(""), 3000); // hide after 3 sec
      setFind(false);
    }finally{
      setLoading(false);
    }
    
    console.log(data);
    console.log(temp);
    console.log(clouds);
    console.log(time);
  }

  
  function handleKeyDown(e) {
    if (e.key === "Enter" && city !== "") {
      handleGetWeather(); // trigger button click
    }
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalID);
    }
  },[]);

  function formatTime(){
    const hr = date.getUTCHours();
    const min = date.getMinutes();
    return `${padZero((hr+time)%24)}:${padZero(min)}`
  }

  function padZero(number){
    return (number < 10 ? "0":"") + number;
  }

  return (
    <>
    <div className='main' >
      {/* title container */}
      <div className={`titleContainer transition-all duration-500 ${find ? "top-7" : "top-43/100"}`}>
        {/* title */}
        <h1 className='title text-glow'>WEATHER APP V.0</h1>
        {/* search */}
        <div className="search justify-center flex gap-3">
          <input type="text" className='w-8/12' id="city" autoComplete="off" value={city} 
          onChange={e => {
            handleCityChange(e);
          }}
          onKeyDown={handleKeyDown} placeholder="Try Thailand"/>
          <button className='findBtn' onClick={handleGetWeather}>Find</button>
        </div>
      </div>

      {(loading || error) && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-50 text-center">
          {loading && <p className="text-blue-500 text-3xl font-bold animate-pulse">Loading…</p>}
          {error && <p className="text-red-500 text-3xl font-bold">{error}</p>}
        </div>
      )}

      {/* weather area */}
      <div className="weatherArea " 
      style={{opacity : find === false ? "0":"50" , top : find == false ? "75%" : "31.25%"}}>
        <div className="cityTime">
          {cityName} : {formatTime()}
        </div>
        <div className="weatherReport grid grid-cols-4 grid-rows-3 gap-4">
          {/* clouds */}
          <div className="cloud justify-around flex flex-col items-center col-span-2 row-span-3 rounded-2xl">
            <div className='overflow-hidden w-1/2 h-55/100 -mb-30 -mt-10'>
              <img 
                src={allIcon[clouds]} 
                alt="weather icon"
                className='w-fit h-full justify-self-center '
              />
            </div>
            <p className='justify-self-center font-bold text-2xl'>{iconName[clouds]}</p>
          </div>
          {/* temp */}
          <div className="temp col-span-2 col-start-3 items-center grid grid-cols-3 grid-rows-1 bg-yellow-200 rounded-2xl">
            <img 
              src={temp > 20 ? `src/assets/temperature-hot.png` : 'src/assets/temperature-cold.png'} 
              alt="temp icon"
              className='h-full w-full object-contain col-span-1 -translate-x-6 '
            />
            <p className={`h-full col-span-2 flex items-center justify-center text-4xl font-bold tracking-widest   ${temp > 20 ? "text-red-500" : "text-blue-300"}`}>{temp} °C</p>
          </div>
          {/* humidity */}
          <div className="humidity col-span-2 col-start-3 items-center grid grid-cols-3 grid-rows-1 bg-rose-200 rounded-2xl">
            <img 
              src="src/assets/humidity.png"
              alt="temp icon"
              className='h-3/4 w-full object-contain col-span-1 '
            />
            <p className='h-full col-span-2 flex items-center justify-center text-4xl font-bold tracking-widest text-pink-400'>{humid}</p>
          </div>
          {/* wind */}
          <div className="wind col-span-2 col-start-3 items-center grid grid-cols-3 grid-rows-1 bg-teal-200 rounded-2xl">
            <img 
              src="src/assets/wind.png"
              alt="temp icon"
              className='h-3/4 w-full object-contain col-span-1 '
            />
            <p className='h-full col-span-2 flex items-center justify-center text-4xl font-bold tracking-widest text-emerald-600'>{wind}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
