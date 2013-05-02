/*
                        |  ~~--.
                        |%=@%%/
                        |o%%%/
                     __ |%%o/
               _,--~~ | |(_/ ._
            ,/'  m%%%%| |o/ /  `\.
           /' m%%o(_)%| |/ /o%%m `\
         /' %%@=%o%%%o|   /(_)o%%% `\
        /  %o%%%%%=@%%|  /%%o%%@=%%  \
       |  (_)%(_)%%o%%| /%%%=@(_)%%%  |
       | %%o%%%%o%%%(_|/%o%%o%%%%o%%% |
       | %%o%(_)%%%%%o%(_)%%%o%%o%o%% |
       |  (_)%%=@%(_)%o%o%%(_)%o(_)%  |
        \ ~%%o%%%%%o%o%=@%%o%%@%%o%~ /
         \. ~o%%(_)%%%o%(_)%%(_)o~ ,/
           \_ ~o%=@%(_)%o%%(_)%~ _/
             `\_~~o%%%o%%%%%~~_/'
                `--..____,,--'				pizza.js - a lightweight javascript charting library.
                							by maxp@emoneyadvisor.com / twitter: @protocollie
*/

(function() {
	// Does your dumb browser even SUPPORT pizza?
	var browserIsLactoseIntolerant = function() {
		var e = document.createElement('canvas');
		return !(e.getContext && e.getContext('2d'));
	};

	// let's be sure of that.
	if (browserIsLactoseIntolerant()) {
		return;
	}

	// Wrap rendering up neatly.
	var pizzaChef = function(crust) {
		var chef = this,
			context = crust.getContext('2d');

		// Gets the dimensions of the crust.
		var getCrustDimensions = function() {
			return {
				width: crust.clientWidth,
				height: crust.clientHeight
			};
		};

		var degreesToRadians = function(degrees) {
			return (degrees * Math.PI) / 180;
		}

		chef.cleanUp = function() {
			var size = getCrustDimensions();
			context.clearRect(0, 0, size.width, size.height);
		};

		// Draw a square!
		chef.drawPieSlice = function(degrees, offsetDegrees, color) {
			var centerX = Math.floor(crust.width / 2),
				centerY = Math.floor(crust.height / 2),
				radius = centerX >= centerY ? centerY : centerX,
				arcSize = degreesToRadians(degrees),
				sliceStart = degreesToRadians(offsetDegrees),
				sliceEnd = arcSize + sliceStart;

			// Store the state of the context
			context.save();

			// Draw the path for the slice
			context.beginPath();
			context.moveTo(centerX, centerY);
			context.arc(centerX, centerY, radius, sliceStart, sliceEnd, false);
			context.closePath;

			// Fill the path
			context.fillStyle = color;
			context.fill();

			// Restore the canvas to its previous state.
			context.restore();
		};
	};

	// First, let us establish what it is that makes a pizza.
	var pizza = function() {
		var order = this,
			crust, chef,
			slices,
			colors = [
				'#b58900',
				'#cb4b16',
				'#dc322f',
				'#d33682',
				'#6c71c4',
				'#268bd2',
				'#2aa198',
				'#859900'
			];

		// Gets the dimensions of the crust.
		var getCrustDimensions = function() {
			return {
				width: crust.clientWidth,
				height: crust.clientHeight
			};
		};

		// We need a crust as the base of our pizza.
		order.crust = function(elementId) {
			crust = document.getElementById(elementId);

			// Is this a real crust?
			if (crust === undefined || crust.tagName.toLowerCase() !== 'canvas') {
				throw 'You have to provide a valid crust in order to create a pizza! Otherwise the toppings will all go on the table. Hint: crusts must be a <canvas> element!';
			}

			// The chef helps us make our pizza, see?
			chef = new pizzaChef(crust);

			// FLUENCY!
			return order;
		};

		// The slices function is how you set the data.
		// It just takes an array of numbers.
		order.slices = function(data) {
			var sum = 0,
				sliceIndex;

			// Empty the degrees array.
			slices = [];

			// Get the sum of all the slices.
			for(sliceIndex = 0; sliceIndex < data.length; sliceIndex++) {
				sum += data[sliceIndex];
			}

			// Convert absolute values into degrees
			for(sliceIndex = 0; sliceIndex < data.length; sliceIndex++) {
				slices.push(data[sliceIndex] / sum * 360);
			}

			// Return the order
			return order;
		};

		// Deliver the pizza to the canvas. i.e. render it.
		order.deliver = function() {
			var sliceIndex, 
				offset = 0,
				colorIndex = 0,
				sliceSize;

			if (slices === undefined || slices.length === 0) {
				throw 'You cannot make a pizza with zero slices!';
			}

			// Clean up our pizza.
			chef.cleanUp();

			// Draw the slices.
			for (sliceIndex = 0; sliceIndex < slices.length; sliceIndex++) {
				if (colorIndex === colors.length) {
					colorIndex = 0;
				}

				// Let's hold on to the size of the slice.
				sliceSize = slices[sliceIndex];

				// Draw it.
				chef.drawPieSlice(sliceSize, offset, colors[colorIndex]);

				// Add its size to the offset
				offset += sliceSize;

				// Increment the color.
				colorIndex++;
			}

			// FLUENCY!
			return order;
		};
	};

	// Finally, export our delicious pizza.
	window.pizza = pizza;

})();