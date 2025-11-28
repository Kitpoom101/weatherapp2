//temp backend
// pass as string
export async function weather(city) {
	// get api key from https://openweathermap.org/api
	const apiKey = "";
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
	const res = await fetch(url);
	return res;
}

