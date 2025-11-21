const API_KEY = "3a3f94ac2d7e1c0741c6d139ce13bfd2";

const app = document.getElementById("app");
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const loader = document.getElementById("loader");
const message = document.getElementById("message");
const card = document.getElementById("card");
const forecastEl = document.getElementById("forecast");
const canvas = document.getElementById("weatherCanvas");
const ctx = canvas.getContext("2d");

const els = {
  temp: document.getElementById("temperature"),
  condition: document.getElementById("condition"),
  location: document.getElementById("location"),
  feels: document.getElementById("feels"),
  humidity: document.getElementById("humidity"),
  wind: document.getElementById("wind"),
  pressure: document.getElementById("pressure"),
  icon: document.getElementById("weatherIcon")
};

function resizeCanvas(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();


let particles = [];
let animId = null;
let particleMode = null;

function startParticles(mode){
  stopParticles();
  particleMode = mode;
  particles = [];
  const count = mode === 'rain' ? Math.round(window.innerWidth / 6) : Math.round(window.innerWidth / 30);
  for(let i=0;i<count;i++){
    particles.push(createParticle(mode));
  }
  animId = requestAnimationFrame(particleLoop);
}

function stopParticles(){
  particleMode = null;
  particles = [];
  if(animId) cancelAnimationFrame(animId);
  animId = null;
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function createParticle(mode){
  if(mode === 'rain'){
    return {
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      len: 12 + Math.random()*18,
      speed: 8 + Math.random()*6,
      width: 1 + Math.random()*1.5,
      opacity: 0.2 + Math.random()*0.5
    };
  } else {
    return {
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: 1 + Math.random()*3.5,
      speed: 0.4 + Math.random()*1.2,
      swing: Math.random()*1.5,
      opacity: 0.5 + Math.random()*0.5
    };
  }
}

function particleLoop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(particleMode === 'rain'){
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineCap = 'round';
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.globalAlpha = p.opacity;
      ctx.lineWidth = p.width;
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.len*0.2, p.y + p.len);
      ctx.stroke();
      p.x += -2 + Math.random()*2;
      p.y += p.speed;
      if(p.y > canvas.height + 50){
        p.y = -20;
        p.x = Math.random()*canvas.width;
      }
    });
  } else if(particleMode === 'snow'){
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      p.x += Math.sin(p.y * 0.01) * p.swing;
      p.y += p.speed;
      if(p.y > canvas.height + 10){
        p.y = -10;
        p.x = Math.random()*canvas.width;
      }
    });
  }
  animId = requestAnimationFrame(particleLoop);
}


function showLoader(on = true){
  loader.classList.toggle('hidden', !on);
}
function showMessage(text, time = 4000){
  if(!text) return;
  message.textContent = text;
  message.classList.remove('hidden');
  clearTimeout(message._t);
  message._t = setTimeout(()=> message.classList.add('hidden'), time);
}

function themeFor(main){
  const map = {
    Clear: { c:'bg-clear', p:null },
    Clouds: { c:'bg-clouds', p:null },
    Rain: { c:'bg-rain', p:'rain' },
    Drizzle: { c:'bg-rain', p:'rain' },
    Thunderstorm: { c:'bg-thunder', p:'rain' },
    Snow: { c:'bg-snow', p:'snow' },
    Mist: { c:'bg-clouds', p:null },
    Fog: { c:'bg-clouds', p:null },
    Haze: { c:'bg-clouds', p:null }
  };
  return map[main] || { c:'bg-default', p:null };
}

function iconUrl(code){ return `https://openweathermap.org/img/wn/${code}@4x.png`; }

function renderCurrent(data){
  const w = data.weather[0];
  els.icon.src = iconUrl(w.icon);
  els.icon.alt = w.description || '';
  els.temp.textContent = Math.round(data.main.temp) + '°C';
  els.condition.textContent = w.description;
  els.location.textContent = `${data.name}, ${data.sys.country}`;
  els.feels.textContent = Math.round(data.main.feels_like) + '°C';
  document.getElementById('humidity').textContent = data.main.humidity + '%';
  document.getElementById('wind').textContent = (data.wind.speed).toFixed(1) + ' m/s';
  document.getElementById('pressure').textContent = data.main.pressure + ' hPa';

  card.classList.remove('hidden');
}


function renderForecast(daily){
  forecastEl.innerHTML = '';
  if(!daily || !daily.length) { forecastEl.classList.add('hidden'); return; }
  daily.slice(1,6).forEach(day=>{
    const dt = new Date(day.dt*1000);
    const name = dt.toLocaleDateString(undefined,{ weekday:'short' });
    const icon = day.weather[0].icon;
    const desc = day.weather[0].description;
    const max = Math.round(day.temp.max);
    const min = Math.round(day.temp.min);

    const el = document.createElement('div');
    el.className = 'day';
    el.innerHTML = `<small>${name}</small>
      <img src="${iconUrl(icon)}" alt="${desc}" />
      <div style="font-weight:800">${max}°</div>
      <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:6px;text-transform:capitalize">${desc}</div>`;
    forecastEl.appendChild(el);
  });
  forecastEl.classList.remove('hidden');
}


async function fetchWeather(city){
  if(!city) return showMessage('Please enter a city or ZIP.');
  showLoader(true);
  card.classList.add('hidden');
  forecastEl.classList.add('hidden');
  stopParticles(); 

  try{
    const q = encodeURIComponent(city.trim());
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${API_KEY}&units=metric`;
    const res = await fetch(currentUrl);
    if(!res.ok){
      if(res.status === 404){ showMessage('City not found.'); }
      else if(res.status === 401){ showMessage('Invalid API key.'); }
      else showMessage('Failed to fetch weather.');
      showLoader(false);
      return;
    }
    const current = await res.json();
    renderCurrent(current);


    const {lat, lon} = current.coord;
    const oneUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric`;
    try{
      const ores = await fetch(oneUrl);
      if(ores.ok){
        const one = await ores.json();
        renderForecast(one.daily || []);
      } else {
        renderForecast([]);
      }
    }catch(e){
      renderForecast([]);
    }

    const wmain = current.weather[0].main;
    const theme = themeFor(wmain);

    app.classList.remove('bg-clear','bg-clouds','bg-rain','bg-snow','bg-thunder','bg-default');
    app.classList.add(theme.c);


    if(theme.p === 'rain') startParticles('rain');
    else if(theme.p === 'snow') startParticles('snow');
    else stopParticles();

    try{ localStorage.setItem('rw_lastcity', city); } catch(e){}

  }catch(err){
    showMessage('Network error. Check your connection.');
  }finally{
    showLoader(false);
  }
}

window.addEventListener('load', ()=>{
  const last = localStorage.getItem('rw_lastcity');
  if(last){
    cityInput.value = last;
    fetchWeather(last);
  } else {

  }
});

searchForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const city = cityInput.value.trim();
  fetchWeather(city);
});

