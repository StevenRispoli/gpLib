//get random integer between min and max, both inclusive
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//get random number between min and max, both inclusive
function getRandomArbitrary(min, max, decPoints){
	var n = (decPoints === 0 ? 0 : decPoints || 20)
	return parseFloat((Math.random() * (max - min) + min).toFixed(n))
}

//modFunction is to do anything for each random value gotton
function getRandomArrayValues(n, array, modFunction){
	//choose n random indices between 0 and max
	function setRandomIndices(n){
		var temp = [],
			max  = array.length-1;
			
		while(max >= 0) temp.push(max--)
		
		//From http://stackoverflow.com/questions/962802/is-it-correct-to-use-javascript-array-sort-method-for-shuffling#answer-962890
		var shuffled = (function shuffle(array) {
		    var tmp, current, top = array.length;

		    if(top) while(--top) {
		        current        = Math.floor(Math.random() * (top + 1))
		        tmp            = array[current]
		        array[current] = array[top]
		        array[top]     = tmp
		    }

		    return array;
		})(temp)

		return shuffled.slice(0, n)
	}

	//get values for indices chosen by setRandomIndices
	function getRandomIndexValues(indices, array, modFunction){
		var temp   = [],
		    isFunc = (modFunction instanceof Function) ? true : false;
		for(var i = 0, j = indices.length; i < j; i++){
			var v = array[indices[i]]
			temp.push(v)
			if(isFunc) modFunction(v)
		}
		return temp
	}
	return getRandomIndexValues(setRandomIndices(n), array, modFunction)
}

//sortObj orders an array of objects based on one property
//defaults to ascending sort, will sort in descending if order is true
function sortObj(prop, array, order){
	order = order || false
	prop  = prop.toString()
	array.sort(function(a, b){
		if(a[prop] > b[prop])      return order ? -1 :  1
		else if(a[prop] < b[prop]) return order ?  1 : -1
		return 0
	})
}

//Intersection of multiple arrays. Takes an array of arrays as a parameter
function intersection(set){
	if(!set instanceof Array) throw new Error('intersection must be passed an array, not ' + typeof set)
	var shortestArray = (function(){
		var temp;
		for(var i = 0, j = set.length; i < j; i++){
			if(!temp || temp.length > set[i].length)
				temp = set[i]
		}
		return temp
	})()
	//Iterates through the shortest array and searches for matches in all other arrays
	//v = current value, res = combined result of previous reduce iterations
	var result = shortestArray.reduce(function(res, v) {
		if (res.indexOf(v) === -1 && set.every(function(a) {
			return a.indexOf(v) !== -1;
		})) res.push(v);
		return res;
	}, [])
	return result
}

//Get all possible combinations using one value from each array
//Takes an array of arrays as a parameter
function getShallowArrayCombos(array){
	var res = [],
		l   = array.length-1;

	function getCombos(l, a, template){
		var a        = a || 0,
		    template = template || [];
		for(var i = 0, j = array[a].length; i < j; i++){
			if(a !== l){
				var nextTemp = template.slice(0)
				nextTemp = nextTemp.concat(array[a][i])
				getCombos(l, a+1, nextTemp)
			} else{
				var combo = template.slice(0)
				combo.push(array[a][i])
				res.push(combo)
			}
		}
	}
	getCombos(l)
	return res
}

function HttpBenchmark(){
	this.count   = 0
	this.start   = 0
	this.elapsed = 0
	this.reset   = true
}

//takes time in ms
HttpBenchmark.prototype.counter = function(time){
	this.count++
	if(this.reset){
		this.reset = false
		setTimeout(function(){
			this.reset = true
			console.log('Request count: ' + this.count)
		}, time)
	}
}

//takes number of requests
HttpBenchmark.prototype.timer = function(n){
	if(this.count === 0 || this.count % n === 0){
		this.count++
		this.start = process.hrtime()
	} else if(++this.count % n === 0){
		this.elapsed = process.hrtime(this.start)[1]/1000000
		console.log(process.hrtime(this.start)[0] + ' s, ' + this.elapsed.toFixed(3) + ' ms -' + this.count)
	}
}

module.exports = {
	getRandomIntInclusive      : getRandomIntInclusive,
	getRandomArbitrary         : getRandomArbitrary,
	getRandomArrayValues       : getRandomArrayValues,
	sortObj                    : sortObj,
	intersection			   : intersection,
	getShallowArrayCombos      : getShallowArrayCombos,
	HttpBenchmark              : HttpBenchmark
}
