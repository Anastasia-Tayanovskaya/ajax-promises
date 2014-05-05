(function(){

	var TECHTALKS_REQUEST_URL = 'http://54.72.3.96:3000/techtalks',
		ATTENDEES_REQUEST_URL = 'http://54.72.3.96:3000/attendees/';
	
	var newRecord = {
		date: "4\/21\/2014",
		title: "AJAX",
		lector: [
		  "alena_karaba"
		],
		location: "K1\/3",
		description: "Some description",
		level: "D1-D5",
		notes: "",
		attendees: [
		  "alena_karaba"
		],
		tags: [
		  "ajax",
		  "xmlhttprequest",
		  "promises"
		]
	};
	
	var recordId, techtalks;
	
	function addNewRecord () {
		return new Promise(function(resolve, reject){
			var request = new XMLHttpRequest();
			
			request.onload = function(){
				if (request.status === 200){
					resolve(request.response);
				}
				else {
					reject(Error(request.statusText));
				}
			}
			
			request.open('POST', TECHTALKS_REQUEST_URL);
			request.setRequestHeader('Content-Type', 'application/json');
			request.onerror = function() {
				reject(Error('Network Error'));
			};

			request.send(JSON.stringify(newRecord));
		})
	}
	
	function getRecordById(recordId) {
		return new Promise(function(resolve, reject){
			var request = new XMLHttpRequest();
			
			request.onload = function(){
				if (request.status === 200){
					resolve(request.response);
				}
				else {
					reject(Error(request.statusText));
				}
			}
			
			request.open('GET', TECHTALKS_REQUEST_URL + '/' + recordId);
			request.onerror = function() {
				reject(Error('Network Error'));
			};

			request.send();
		})
	}
	
	function updateRecord (recordId, updatedRecord) {
		return new Promise(function(resolve, reject){
			var request = new XMLHttpRequest();
			
			request.onload = function(){
				if (request.status === 200){
					resolve(request.response);
				}
				else {
					reject(Error(request.statusText));
				}
			}
			
			request.open('PUT', TECHTALKS_REQUEST_URL + '/' + recordId);			
			request.setRequestHeader('Content-Type', 'application/json');
			request.onerror = function() {
				reject(Error('Network Error'));
			};

			request.send(JSON.stringify(updatedRecord));
		})
	}
	
	function deleteRecord (recordId){
		return new Promise(function(resolve, reject){
			var request = new XMLHttpRequest();
			
			request.onload = function(){
				if (request.status === 200){
					resolve(request.response);
				}
				else {
					reject(Error(request.statusText));
				}
			}
			
			request.open('DELETE', TECHTALKS_REQUEST_URL + '/' + recordId);	
			request.onerror = function() {
				reject(Error('Network Error'));
			};

			request.send();
		})
	}
	
	function getTechtalks() {
	
		return new Promise(function(resolve, reject) {
			var request = new XMLHttpRequest();
			
			request.onload = function(){
				if (request.status === 200){
					resolve(request.response);
				}
				else {
					reject(Error(request.statusText));
				}
			}
			
			request.open('GET', TECHTALKS_REQUEST_URL);											

			request.onerror = function() {
				reject(Error('Network Error'));
			};

			request.send();
		});
	}
	
	function getLectorInfo (lectorName) {
		return new Promise(function(resolve, reject){
			var request = new XMLHttpRequest();
			
			request.onload = function(){
				if (request.status === 200){
					resolve(request.response);
				}
				else {
					reject(Error(request.statusText));
				}
			}
			
			request.open('GET',  ATTENDEES_REQUEST_URL + lectorName);	
			request.onerror = function() {
				reject(Error('Network Error'));
			};

			request.send();
		})
	}
	
	addNewRecord()
		.then(function(response) {
			console.log('Success!', response);
		
			recordId = JSON.parse(response)._id;		
			return getRecordById(recordId);
		}, function(error) {
			console.error('Failed!', error);
		})
		.then(function(response){
			console.log('Success2!', response);
			var techtalk = JSON.parse(response);
			techtalk.description = 'Some new description';
			delete techtalk._id;
			return updateRecord(recordId, techtalk);
		}, function(reject){
			console.log('Failed2!', error);
		})
		.then(function(response){
			console.log('Success3!', response);
			return deleteRecord(recordId);
		}, function(error){
			console.log('Faild3!', error);
		})
		.then(function(response){
			console.log('Success4!', response);
		}, function(error){
			console.log('Faild4!', error);
		});
		
	getTechtalks()
		.then(function(response){
			console.log ('Success: techtalks json was loaded');
			
			var techtalksList = JSON.parse(response),
				lectorList = [],
				techtalkLectorList;
			
			for (var i = 0, len = techtalksList.length; i < len; i++) {
			
				techtalkLectorList = techtalksList[i].lector;
				if (techtalkLectorList) {
					if (techtalkLectorList instanceof Array) {				
						for (var j = 0, lectorsAmount = techtalkLectorList.length; j < lectorsAmount; j++) {
							if (lectorList.indexOf(techtalkLectorList[j]) < 0) {
								lectorList.push(techtalkLectorList[j]);
							}
						}
					}
					else {
						if (lectorList.indexOf(techtalkLectorList) < 0) {
							lectorList.push(techtalkLectorList);
						}
					}
				}
			}
			return {
				lectors: lectorList,
				techtalks: techtalksList
			}
		}, function (error) {
			console.log('Failed', error);
			var errorElement = document.createElement('p');
			errorElement.innerHTML = 'Failed: Techtalks list wasn\'t loaded';
			document.body.insertBefore('', document.lectorsList);
		})
		.then(function(response){
			
			var lectors = response.lectors;
			
			techtalks = response.techtalks;
			
			return Promise.all(lectors.map(getLectorInfo));
		})
		.then(function(response){
			var htmlList = document.getElementById('lectorsList'),
				lectorsInfo = [],
				itemListArray = [],
				itemELement;
				
			response.forEach(function(lector){
				if (lector) {
					lectorsInfo.push(JSON.parse(lector));
				}
			});
			
			techtalks.forEach(function(techtalk){			
				var techtalkLectors = techtalk.lector,
					findLector = function(lectorName) {
						var lector = lectorsInfo.filter(function(lector){
							return lector.name === lectorName;
						})
						return lector;
					},
					getFieldValue = function(lectors, fieldName) {
						var list = [];
						if (lectors[0] && lectors[0].length > 0) {
							lectors.forEach(function(lector){
								if (lector[0][fieldName] instanceof Array) {
									lector[0][fieldName].forEach(function(item){
										list.push(item);
									})
								}
								else {
									list.push(lector[0][fieldName]);
								}
							});
						}
						return list;
					},					
					lectorList = [];
				
				if (techtalkLectors){
					for (var i = 0, len = techtalkLectors.length; i < len; i++){
						lectorList.push(findLector(techtalkLectors[i]));
					}
									
					techtalk.lector_full_name = getFieldValue(lectorList, 'full_name');
					techtalk.lector_email = getFieldValue(lectorList, 'email');
				}
				itemElement = document.createElement('li');
				itemElement.innerHTML = JSON.stringify(techtalk);

				itemListArray.push(itemElement);
			});

			itemListArray.forEach(function(item){
				htmlList.appendChild(item);
			});
		});
	
})();