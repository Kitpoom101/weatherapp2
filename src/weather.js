//temp backend
// pass as string
export async function weather(city) {
	// get api key from https://openweathermap.org/api
	const apiKey = "35e0ef593c4bdf74512ba74976f5768d";
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
	const res = await fetch(url);
	return res;
}

