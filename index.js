const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weathercontainer");
const grantAccess=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfo=document.querySelector(".user-info-container");

let currentTab=userTab;

//write the API Key

const API_KEY="07bd16f6272bad4f8c3ad0397689be16";
currentTab.classList.add("current-tab");

//pending thing
getFromSession();


function getFromSession(){
    //check if coordinates are already present
    const localcoord=sessionStorage.getItem("user-coordinates");
    if(!localcoord){
        //if not found local
        grantAccess.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localcoord);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //grant cont
    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");

    //api call
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);  
    } 
    catch (error) {
          loadingScreen.classList.remove("acitve");
    }
}

function renderWeatherInfo(weatherInfo){

    const cityName=document.querySelector("[data-cityname]");
    const countryIcon=document.querySelector("[data-countryicon]");
    const desc=document.querySelector("[data-weatherdesc]");
    const weatherIcon=document.querySelector("[weathericon]");
    const temperature=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
    
    //fetch values from weatherinfo object
    cityName.innerText=weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=weatherInfo?.clouds?.all;

}

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfo.classList.remove("active");
            grantAccess.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //now on your weather app need to be visible
            searchForm.classList.remove("active");
            userInfo.classList.remove("active");
            //used to display the weather
            getFromSession();
        }
    }
}

userTab.addEventListener('click',()=>{
    //passed clicked tab
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    //passed clicked tab
    switchTab(searchTab);
})

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Support Not There for location");
    }

};

function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const grantbtn=document.querySelector("[data-grantAccess]");
grantbtn.addEventListener("click",getlocation);

let searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName===""){
        return ;
    }
    else
        fetchSearchWeather(cityName);
})


async function fetchSearchWeather(city){
     loadingScreen.classList.add("active");
     userInfo.classList.remove("active");
     grantAccess.classList.remove("active");

     try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data= await response.json();

        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
        
     } catch (error) {
        
     }
}