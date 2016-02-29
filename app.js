// Get the food and quantity inputs and assign them to variables
var newFoodInput = document.getElementById('new-food');
var qtyInput = document.getElementById('new-quantity');
// Assign the add button
var addButton = document.getElementsByTagName('button')[0];
// Assign the analyze button
var analyzeButton = document.getElementsByTagName('button')[1];
// Assign a parent element for the table we are going to create
var foodTable = document.getElementById('food-table');

// An array of food objects containing nutritional info
var recipeArray = [];

// Get nutrion data from the Nutronix API with the user input in the query string
function addFood() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {
      createRow(xhr);
    }
  };
  xhr.open('GET', 'https://api.nutritionix.com/v1_1/search/'+newFoodInput.value+
    '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_carbohydrate' +
    '%2Cnf_total_fat%2Cnf_calories%2Cnf_protein%2Cnf_sugars%2Cnf_dietary_fiber'+
    '&appId=a5f3fad2&appKey=852bc683dfc97b299e0b1e1d6f9be7f5');
  xhr.send();
}

// Create a function constructor to define our object data structure
function Ingredient(food, cups, calories, carbs, protein, fat, sugar, fiber) {
  this.food = food;
  this.cups = cups;
  this.calories = calories;
  this.carbs = carbs;
  this.protein = protein;
  this.fat = fat;
  this.sugar = sugar;
  this.fiber = fiber;
}

// A function that builds up a table row by creating and appending data cell elements 
var createRow = function (xhr) {
  var foodObject = {};
  var data = JSON.parse(xhr.responseText);

  // Create a row element that will have nutrition data as columns elements
  var recipeItem = document.createElement('tr');

  // Assign the first hit from the API GET request to a variable
  var foodName = data.hits[0].fields.item_name.split(' ')[0];

  // Create and assign table cell elements for the nutrition API data 
  var foodDataCell = document.createElement('td');
  var foodText = document.createElement('p');
  var foodInput = document.createElement('input');
  
  // Cups is user supplied and not returned from the API
  var numberOfCups = parseInt(qtyInput.value);

  // Create and assign table cell elements
  var cupsDataCell = document.createElement('td');
  var cupsText = document.createElement('p');
  var cupsInput = document.createElement('input');

  var numberOfCalories = data.hits[0].fields.nf_calories * qtyInput.value;
  var caloriesDataCell = document.createElement('td');
  var caloriesText = document.createElement('p');

  var numberOfCarbs = data.hits[0].fields.nf_total_carbohydrate * qtyInput.value;
  var carbsDataCell = document.createElement('td');
  var carbsText = document.createElement('p');
  
  var numberOfProtein = data.hits[0].fields.nf_protein * qtyInput.value;
  var proteinDataCell = document.createElement('td');
  var proteinText = document.createElement('p');

  var numberOfFat = data.hits[0].fields.nf_total_fat * qtyInput.value;
  var fatDataCell = document.createElement('td');
  var fatText = document.createElement('p');

  var numberOfSugar = data.hits[0].fields.nf_sugars * qtyInput.value;
  var sugarDataCell= document.createElement('td');
  var sugarText = document.createElement('p');

  var numberOfFiber = data.hits[0].fields.nf_dietary_fiber * qtyInput.value;
  var fiberDataCell = document.createElement('td');
  var fiberText = document.createElement('p');

  var editDataCell = document.createElement('td');
  var editButton = document.createElement('button');

  var deleteDataCell = document.createElement('td');
  var deleteButton = document.createElement('button');
  
  // Remove trailing commas from the first word in the API returned food name string
  foodName = foodName.replace(/,/g, '');

  // Remove pluralizations of food names to improve grammar on displayed messages
  if (foodName.lastIndexOf('s') === foodName.length - 1) {
    foodName = foodName.slice(0, -1);
  }
  // Insert text into the p elements, assign class names and append the nodes
  foodText.className = 'food';
  foodText.innerHTML = foodName;
  foodInput.type = 'text';
  foodInput.className = 'foodInput';
  foodDataCell.appendChild(foodText);
  foodDataCell.appendChild(foodInput);
  recipeItem.appendChild(foodDataCell);
  
  cupsText.className = 'quantity';
  cupsText.innerHTML = Math.round(numberOfCups);
  cupsInput.type = 'text';
  cupsDataCell.appendChild(cupsText);
  cupsDataCell.appendChild(cupsInput);
  recipeItem.appendChild(cupsDataCell);

  caloriesText.className = 'calories';
  caloriesText.innerHTML = Math.round(numberOfCalories);
  caloriesDataCell.appendChild(caloriesText);
  recipeItem.appendChild(caloriesDataCell);

  carbsText.className = 'carbs';
  carbsText.innerHTML = Math.round(numberOfCarbs);
  carbsDataCell.appendChild(carbsText);
  recipeItem.appendChild(carbsDataCell);

  proteinText.className = 'protein';
  proteinText.innerHTML = Math.round(numberOfProtein);
  proteinDataCell.appendChild(proteinText);
  recipeItem.appendChild(proteinDataCell);

  fatText.className = 'fat';
  fatText.innerHTML = Math.round(numberOfFat);
  fatDataCell.appendChild(fatText);
  recipeItem.appendChild(fatDataCell);

  sugarText.className = 'sugar';
  sugarText.innerHTML = Math.round(numberOfSugar);
  sugarDataCell.appendChild(sugarText);
  recipeItem.appendChild(sugarDataCell);

  fiberText.className = 'fiber';
  fiberText.innerHTML = Math.round(numberOfFiber);
  fiberDataCell.appendChild(fiberText);
  recipeItem.appendChild(fiberDataCell);

  editButton.className = 'edit';
  editButton.innerHTML = 'Edit';
  editDataCell.appendChild(editButton);
  recipeItem.appendChild(editDataCell);

  deleteButton.className = 'delete';
  deleteButton.innerHTML = 'Delete';
  deleteDataCell.appendChild(deleteButton);
  recipeItem.appendChild(deleteDataCell);

  foodTable.appendChild(recipeItem);
  
  // Bind event listeners to the buttons on the food item row
  bindRecipeEvents(recipeItem);
  
  // Create an object with the nutrient keys and values to push into our array of recipe ingredients
  var theIngredient = new Ingredient(foodName, numberOfCups, numberOfCalories, 
    numberOfCarbs, numberOfProtein, numberOfFat, numberOfSugar, numberOfFiber);

  addQuantity(theIngredient);

  newFoodInput.value = '';
  qtyInput.value = '';
}

addButton.addEventListener('click', function() {
  if (newFoodInput.value !== '' && qtyInput.value !== '') {
    addFood();
  }
});

// Create an edit function that selects the parent node of the button
var editRecipe = function() {
  var editCell = this.parentNode;
  var recipeItem = editCell.parentNode;
  var editInput = recipeItem.querySelectorAll('input[type=text]')[0];
  var editQuantity = recipeItem.querySelectorAll('input[type=text]')[1];
  var textElement = recipeItem.querySelector('p.food');

  var quantityElement = recipeItem.querySelector('p.quantity');
  var previousQuantity = quantityElement.innerHTML;

  var caloriesElement = recipeItem.querySelector('p.calories');
  var previousCalories = caloriesElement.innerHTML;

  var carbsElement = recipeItem.querySelector('p.carbs');
  var previousCarbs = carbsElement.innerHTML;

  var proteinElement = recipeItem.querySelector('p.protein');
  var previousProtein = proteinElement.innerHTML;

  var fatElement = recipeItem.querySelector('p.fat');
  var previousFat = fatElement.innerHTML;

  var sugarElement = recipeItem.querySelector('p.sugar');
  var previousSugar = sugarElement.innerHTML;

  var fiberElement = recipeItem.querySelector('p.fiber');
  var previousFiber = fiberElement.innerHTML;

  var containsClass = recipeItem.classList.contains('editMode');
  var editButton = recipeItem.querySelector('button.edit');

  var newText;
  var newQuantity;
  var newCalories;
  var newCarbs;
  var newProtein;
  var newFat;
  var newSugar;
  var newFiber; 

/* Swaps the p value with the input value if you click edit
 * clicking edit again to switch out of editmode swaps edit input value with p value
 */
  if (containsClass) {

    textElement.innerHTML = editInput.value;
    newText = textElement.innerHTML;

    quantityElement.innerHTML = editQuantity.value;
    newQuantity = Math.round(quantityElement.innerHTML - previousQuantity);

    // Recalculate and display the values with the new quantity
    caloriesElement.innerHTML = Math.round((caloriesElement.innerHTML/previousQuantity) * quantityElement.innerHTML);
    newCalories = Math.round(caloriesElement.innerHTML - previousCalories);

    carbsElement.innerHTML = Math.round((carbsElement.innerHTML/previousQuantity) * quantityElement.innerHTML);
    newCarbs = Math.round(carbsElement.innerHTML - previousCarbs);

    proteinElement.innerHTML = Math.round((proteinElement.innerHTML/previousQuantity) * quantityElement.innerHTML); 
    newProtein = Math.round(proteinElement.innerHTML - previousProtein);

    fatElement.innerHTML = Math.round((fatElement.innerHTML/previousQuantity) * quantityElement.innerHTML);
    newFat = Math.round(fatElement.innerHTML - previousFat); 

    sugarElement.innerHTML = Math.round((sugarElement.innerHTML/previousQuantity) * quantityElement.innerHTML);
    newSugar = Math.round(sugarElement.innerHTML - previousSugar);

    fiberElement.innerHTML = Math.round((fiberElement.innerHTML/previousQuantity) * quantityElement.innerHTML);
    newFiber = Math.round(fiberElement.innerHTML - previousFiber);

    editButton.innerHTML = 'Edit';

    // Create a new object that contains the amount that was just added
    theIngredient = new Ingredient(newText, newQuantity, newCalories, newCarbs, newProtein, 
      newFat, newSugar, newFiber);

    // Recalculate and display the sum totals
    addQuantity(theIngredient);

  } else {

    editInput.value = textElement.innerHTML;
    editQuantity.value = quantityElement.innerHTML;
    editButton.innerHTML = 'Save';
    
  }
  recipeItem.classList.toggle('editMode');

}

// The bindRecipeEvents function assigns click event handlers to the edit and delete functions
var bindRecipeEvents = function(recipeItem) {
  var editButton = recipeItem.querySelector('button.edit');
  var deleteButton = recipeItem.querySelector('button.delete');
  editButton.addEventListener('click', editRecipe);
  deleteButton.addEventListener('click', deleteRecipe);
}

// Loop through each table row calling the bind function
for (var i = 0; i < foodTable.children.length; i++) {
  bindRecipeEvents(foodTable.children[i]);
}

/* Create delete function to select the parent row node of the button, assign to a variable 
 * then move up to the next parent and then removes the child to delete the row
 */
var deleteRecipe = function() {
  var buttonCell = this.parentNode;
  var buttonRow = buttonCell.parentNode;
  var foodName = buttonRow.querySelector('p.food').innerHTML;
  var tbody = buttonRow.parentNode;
  tbody.removeChild(buttonRow);

  recipeArray = recipeArray.filter(function(el) {
    return el.food !== foodName;
  });

  addQuantity();
}

// Create an add function that sums the colums and displays them on the bottom row
var addQuantity = function(foodObject) {
  var title = 'Total';
  var quantity = 0;
  var cals = 0;
  var carbs = 0;
  var protein = 0;
  var fat = 0;
  var sugar = 0;
  var fiber = 0;

  if (foodObject) {
    recipeArray.push(foodObject);
  }

  quantity = Math.round(total(recipeArray.map(function(item) {
    return item.cups;
  })));

  cals = Math.round(total(recipeArray.map(function(item) {
    return item.calories;
  })));

  carbs = Math.round(total(recipeArray.map(function(item) {
    return item.carbs;
  })));

  protein = Math.round(total(recipeArray.map(function(item) {
    return item.protein;
  })));

  fat = Math.round(total(recipeArray.map(function(item) {
    return item.fat;
  })));

  sugar = Math.round(total(recipeArray.map(function(item) {
    return item.sugar;
  })));

  fiber = Math.round(total(recipeArray.map(function(item) {
    return item.fiber;
  })));

  var displayRow = function(str, id) {
    var outputDiv = document.getElementById(id);
    outputDiv.innerHTML = str;
  }

  // Add the totals to the footer table row
  displayRow(quantity, 'totalQuantity');
  displayRow(cals, 'totalCalories');
  displayRow(carbs, 'totalCarbs');
  displayRow(protein, 'totalProtein');
  displayRow(fat, 'totalFat');
  displayRow(sugar, 'totalSugar');
  displayRow(fiber, 'totalFiber');

}

analyzeButton.addEventListener('click', function() {
  var nutriArray = recipeArray.map(healthAnalysis);
  displayMessage(nutriArray);
  colorChanger();
});


var total = function(array) {
  function plus(a, b) { 
    return a + b; 
  }

  return array.reduce(plus, 0);
}

var mapper = function(array, prop) {
  return array[prop];
}

var displayMessage = function(arr) {
  var messageText;
  var oldList = document.getElementById('analysis');
  while (oldList.firstChild) {
    oldList.removeChild(oldList.firstChild);
  }

  for (var i = 0; i < arr.length; i++) {
    messageText = document.createElement('h3');
    messageText.innerHTML = arr[i];
    document.getElementById('analysis').appendChild(messageText);
  }
}

var healthAnalysis = function(current, index, array) {
  var len = recipeArray.length;
  var nutriString = '';
  var macros = macroNutrients(current);
  nutriString += 'The ' + current.food + ' is ';
    for (var i = 0; i < 5; i++) {
      if (macros[i] === 'fat' && current.fat < 2) {
        nutriString += ' low fat,';
      } else if (macros[i] === 'fat' && current.fat >= 2) {
        nutriString += ' high fat, ';
      } 
      if (macros[i] === 'fiber' && current.fiber < 2) {
        nutriString +- ' low fiber,';
      } else if (macros[i] === 'fiber' && current.fiber >= 2) {
        nutriString += ' high fiber,'; 
      }
    }
    nutriString = nutriString.replace(/(^,)|(,$)/g, '');

  return nutriString;
}

var colorChanger = function() {
  var proteinCell = document.querySelectorAll('p.protein')
  var fatCell = document.querySelectorAll('p.fat');
  var sugarCell = document.querySelectorAll('p.sugar');
  var fiberCell = document.querySelectorAll('p.fiber');

  for (var i = 0; i < fiberCell.length; i++) {
    if (fiberCell[i].innerHTML >= 2) {
      fiberCell[i].parentNode.style.backgroundColor = 'green';
    }
  }

  for (var j = 0; j < fatCell.length; j++) {
    if (fatCell[j].innerHTML < 2) {
      fatCell[j].parentNode.style.backgroundColor = 'green';
    } else {
      fatCell[j].parentNode.style.backgroundColor = 'red';
    }
  }
}

var macroNutrients = function(r) {
  var macroNames = [];
  var prop;
  for (var i = 3; i < 8; i++) {
    prop = Object.keys(r)[i];
    macroNames.push(prop);
  }

  return macroNames;
}

