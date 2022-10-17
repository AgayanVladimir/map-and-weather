// объявление переменных 
const input = document.querySelector('input.cityName');
const button = document.querySelector('button');
const cityName = document.querySelector('h2.cityName');
const degrees = document.querySelector('.degrees');
const condition = document.querySelector('.condition');
const weatherDay = document.querySelectorAll('.weatherTime__item_time');
const weatherIcons = document.querySelectorAll('.weatherTime__item_icon');
const dayDegrees = document.querySelectorAll('.weatherTime__item_degrees');
const todayText = document.querySelector('.today');
// Получение названия месяца
const MONTH_LIB = {
	1: 'January',
	2: 'February',
	3: 'March',
	4: 'April',
	5: 'May',
	6: 'June',
	7: 'July',
	8: 'August',
	9: 'September',
	10: 'October',
	11: 'November',
	12: 'December',
}
// получение API погоды
function getWeatherAPI() {
	const WeatherURL = `http://api.openweathermap.org/data/2.5/forecast?q=${input.value}&appid=df0b3fb60da59f11e72cc87c38471258`;
	fetch(WeatherURL)
		.then((resp) => { return resp.json() })
		.then((data) => {
			let month = 0;

			for (i = 0; i < weatherDay.length; i++) {
				// 8 - количество эллементов в массиве выделенных для одного дня
				weatherIcons[i].src = `https://openweathermap.org/img/wn/${data.list[(i + 1) * 8].weather[0].icon}@2x.png`;
				dayDegrees[i].innerHTML = Math.round((data.list[(i + 1) * 8].main.temp - 273)) + '&deg;'; // перевод градусов из Кельвина в Цельсия
			}

			for (i = 2; i < weatherDay.length; i++) {
				month = data.list[i * 8].dt_txt.slice(5, 7);
				weatherDay[i].textContent = `${data.list[(i + 1) * 8].dt_txt.slice(8, 10)} ${MONTH_LIB[month]}`
			}
			// создание внешнего вида блока погоды
			function createApperanceWeatherBlock() {
				cityName.textContent = data.city.name;
				degrees.innerHTML = Math.round((data.list[0].main.temp - 273)) + '&deg;'; // перевод градусов из Кельвина в Цельсия
				condition.textContent = data.list[0].weather[0].description;
				todayText.style.display = 'block';
				todayText.textContent = 'Today'
				weatherDay[0].textContent = 'Tomorrow';
				weatherDay[1].textContent = 'After tomorrow';
			};
			createApperanceWeatherBlock();

		})
		.catch(() => {
			alert('Название города введено неверно!')

		})
}

// событие на кнопку ('Прогноз погоды')
button.addEventListener('click', getWeatherAPI);


// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.

// получение геолокации пользователя
let lat = 0;
let lon = 0;

navigator.geolocation.getCurrentPosition((locationData) => {

	lat = locationData.coords.latitude;
	lon = locationData.coords.longitude;


});

// добавление карты
ymaps.ready(init);
function init() {
	const myMap = new ymaps.Map("map", {
		center: [lat, lon],
		zoom: 10
	}, {
		searchControlProvider: 'yandex#search'
	}),



		// Создаем геообъект с типом геометрии "Точка".
		myGeoObject = new ymaps.GeoObject({
			// Описание геометрии.
			geometry: {
				type: "Point",
				coordinates: [lat, lon]
			},
			// Свойства.
			properties: {
				// Контент метки.
				iconContent: 'Ваше местонахождение!',
				hintContent: 'Можно перетаскивать'
			}
		}, {
			// Опции.
			// Иконка метки будет растягиваться под размер ее содержимого.
			preset: 'islands#blackStretchyIcon',
			// Метку можно перемещать.
			draggable: true
		})
	// событие на открытую карту
	myMap.events.add('click', function (e) {
		if (!myMap.balloon.isOpen()) {
			var coords = e.get('coords');
			const coordsWeather = `http://api.openweathermap.org/data/2.5/forecast?lat=${coords[0].toPrecision(6)}&lon=${coords[1].toPrecision(6)}&appid=df0b3fb60da59f11e72cc87c38471258`;
			fetch(coordsWeather)
				.then((resp) => { return resp.json() })
				.then((data) => {
					let month = 0;

					for (i = 0; i < weatherDay.length; i++) {

						weatherIcons[i].src = `https://openweathermap.org/img/wn/${data.list[(i + 1) * 8].weather[0].icon}@2x.png`;
						dayDegrees[i].innerHTML = Math.round((data.list[(i + 1) * 8].main.temp - 273)) + '&deg;'; //перевод градусов из Кельвина в Цельсия
					}

					for (i = 2; i < weatherDay.length; i++) {
						month = data.list[i * 8].dt_txt.slice(5, 7);


						weatherDay[i].textContent = `${data.list[(i + 1) * 8].dt_txt.slice(8, 10)} ${MONTH_LIB[month]}`;
					}
					// создание внешнего вида блока погоды
					function createApperanceWeatherBlock() {
						cityName.textContent = data.city.name;
						degrees.innerHTML = Math.round((data.list[0].main.temp - 273)) + '&deg;'; // перевод градусов из Кельвина в Цельсия
						condition.textContent = data.list[0].weather[0].description;
						todayText.style.display = 'block';
						todayText.textContent = 'Today'
						weatherDay[0].textContent = 'Tomorrow';
						weatherDay[1].textContent = 'After tomorrow';
					};
					createApperanceWeatherBlock();
				})

		}
		else {
			myMap.balloon.close();
		}
	});

	// добавление объекта на карту
	myMap.geoObjects
		.add(myGeoObject)






}






