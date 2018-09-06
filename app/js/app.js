(function() {
	/*****************************
	*
	* Application object vaiables
	*
	*****************************/
	var app = {
		is_loading: true,
		spinner: document.querySelector('.loader'),
		container: document.querySelector('.main'),
		cardTemplate: document.querySelector('.card'),
		cards: {},
		location: {
					lng: 0.0,
					lat: 0.0
				},
		maps: {},
		map_index: 0,
		map_prefix: "map"
	};

	/**********************
	*
	* Event Listeners
	*
	***********************/
	document.getElementById('butRefresh').addEventListener('click', function(){
		// refresh users location
		app.updateLocation();
	});

	document.getElementById('butAdd').addEventListener('click', function(){
		// add button behavior is currently undefined
		app.addLocation();
	})


	/***************************
	*
	* app methods
	*
	****************************/

	app.getMapId = function(){
		map_name = app.map_prefix + app.map_index;
		app.map_index++
		console.log(map_name)
		return map_name
	}

	app.spin = function() {
		app.container.setAttribute('hidden', '');
		app.spinner.removeAttribute('hidden');
		app.is_loading = true;
	}

	app.updateLocation = function() {
		console.log("refreshing...")
		app.getLocation();
		app.spin();
		app.container.innerHTML = '';
		for (var i in app.cards) {
			app.container.appendChild(app.cards[i]);
		}
		app.container.removeAttribute('hidden');

	    if (app.is_loading) {
	      app.spinner.setAttribute('hidden', '');
	      app.container.removeAttribute('hidden');
	      app.isLoading = false;
	    }
	};

	app.addLocation = function() {
		console.log("adding...")
		app.getLocation();
		card = app.cardTemplate.cloneNode(true);
		card.classList.remove('cardTemplate');
		card.removeAttribute('hidden');
		card_id = app.getMapId();
		card.setAttribute('id', card_id)
		map = app.makeMap(card);
		app.cards[card.id] = card;
		app.updateLocation();
		app.saveData();
	};

	app.makeMap = function(card){
        map = new google.maps.Map(card, {
          center: app.location,
          zoom: 14 });

        marker = new google.maps.Marker({position: app.location, map: map});
        return map
	};

	app.getLocation = function() {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(addPosition);
	    } else {
	        app.container.innerHTML = "Geolocation is not supported by this browser.";
	    }
	    function addPosition(position) {
	    	app.location.lat = position.coords.latitude;
	    	app.location.lng = position.coords.longitude;
	    };

	};

	app.saveData = function() {
		console.log("saving...");
    	var appIndex = JSON.stringify(app.map_index);
    	localStorage.appIndex = appIndex;
	};

	app.load = function(){
		console.log("loading...");
		app.map_index = localStorage.appIndex;
	}
	app.registerServiceWorker = function() {
		if ('serviceWorker' in navigator) {
		    navigator.serviceWorker
		             .register('./service-worker.js')
		             .then(function() { console.log('Service Worker Registered'); });
	  	} else {
	  		console.log("Service workers are not supported on this machine")
	  	}
	};

	app.getLocation();
	app.registerServiceWorker();

	if (localStorage.appCards) {
		app.load();
		app.updateLocation();
	} else {
		app.addLocation();
	}

})();