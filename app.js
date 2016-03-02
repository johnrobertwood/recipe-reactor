// Get the food and quantity inputs and assign them to variables
var newFoodInput = document.getElementById('new-food');
var qtyInput = document.getElementById('new-quantity');
// Assign the add button
var addButton = document.getElementsByTagName('button')[0];
// Assign the reset button
var resetButton = document.getElementsByTagName('button')[1];
// Assign the analyze button
var analyzeButton = document.getElementsByTagName('button')[2];
// Assign a parent element for the table we are going to create
var foodTable = document.getElementById('food-table');

// An array of food objects containing nutritional info
var recipeArray = [];

// Clicking the add button will query the API and create a row of nutrition information
addButton.addEventListener('click', function() {
  if (newFoodInput.value !== '' && qtyInput.value !== '' && qtyInput.value > 0) {
    addFood();
  }
});

// Reset All button clears the recipe object array and removes all the 
// food-table and analysis child nodes to reset the page
resetButton.addEventListener('click', function() {
  var foodTable = document.getElementById('food-table');
  var foodChildren = foodTable.children;
  console.log(foodChildren.length);
  recipeArray = [];
  for (var i = foodChildren.length - 1; i >= 0; i--){
    foodTable.removeChild(foodChildren[i]);
  }
  nutriArray = recipeArray.map(healthAnalysis);
  displayMessage(nutriArray);
  addQuantity();
});

/*
 / Clicking the analyze button will call functions to evaluate recipe ingredient 
 / macronutrient values and provide feedback to the user
*/
analyzeButton.addEventListener('click', function() {
  var nutriArray = recipeArray.map(healthAnalysis);
  displayMessage(nutriArray);
  colorChanger();
});

// Get nutrion data from the Nutritionix API with the user input in the query string
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

// Builds up a food item row by creating and appending data cell elements 
var createRow = function (xhr) {
  var foodObject = {};
  var data = JSON.parse(xhr.responseText);

  // Create a row element that will have nutrition data as columns elements
  var recipeItem = document.createElement('tr');

  var foodName = data.hits[0].fields.item_name.split(' ')[0];

  // Remove trailing commas from the first word in the API returned food name string
  foodName = foodName.replace(/,/g, '');

  // Remove pluralizations of food names to improve grammar on displayed messages
  if (foodName.lastIndexOf('s') === foodName.length - 1) {
    foodName = foodName.slice(0, -1);
  }

  var numCups = parseFloat(qtyInput.value);
  var numCalories = Math.round(data.hits[0].fields.nf_calories * qtyInput.value);
  var numCarbs = Math.round(data.hits[0].fields.nf_total_carbohydrate * qtyInput.value);
  var numProtein = Math.round(data.hits[0].fields.nf_protein * qtyInput.value);
  var numFat = Math.round(data.hits[0].fields.nf_total_fat * qtyInput.value);
  var numSugar = Math.round(data.hits[0].fields.nf_sugars * qtyInput.value);
  var numFiber = Math.round(data.hits[0].fields.nf_dietary_fiber * qtyInput.value);

  var macroProps = ['food', 'cups', 'calories', 'carbs', 'protein', 'fat', 'sugar', 'fiber'];
  var dataProps = [foodName, numCups, numCalories, numCarbs, numProtein, numFat, numSugar, numFiber];

  // Create cells, assign class names add text and append nodes
  for (var i = 0; i < macroProps.length; i++) {
    var cell = document.createElement('td');
    var label = document.createElement('p');
    var input;
    label.className = macroProps[i];
    label.innerHTML = dataProps[i];
    cell.appendChild(label);
    recipeItem.appendChild(cell);

    if (macroProps[i] === 'cups') {
      input = document.createElement('input');
      input.type = 'text';
      cell.appendChild(input);
    }

  }

  var editDataCell = document.createElement('td');
  var editButton = document.createElement('button');
  editButton.className = 'edit';
  editButton.innerHTML = 'Edit Qty';
  editDataCell.appendChild(editButton);
  recipeItem.appendChild(editDataCell);

  var deleteDataCell = document.createElement('td');
  var deleteButton = document.createElement('button');
  deleteButton.className = 'delete';
  deleteButton.innerHTML = 'Delete';
  deleteDataCell.appendChild(deleteButton);
  recipeItem.appendChild(deleteDataCell);


  foodTable.appendChild(recipeItem);
  
  // Bind event listeners to the buttons on the food item row
  bindRecipeEvents(recipeItem);
  
  // Create an object with the nutrient keys and values to push into our array of recipe ingredients
  var theIngredient = new Ingredient(foodName, numCups, numCalories, numCarbs, 
    numProtein, numFat, numSugar, numFiber);

  addQuantity(theIngredient);

  newFoodInput.value = '';
  qtyInput.value = '';
}

/* The edit function switches into edit mode and allows the user to change 
 / food name and quantity. When the user saves, the new values are displayed 
 / and the updated quantity is added to the recipe object
*/ 
var editRecipe = function() {
  var editCell = this.parentNode;
  var recipeItem = editCell.parentNode;
  var editQuantity = recipeItem.querySelectorAll('input[type=text]')[0];

  var foodEl = recipeItem.querySelector('p.food');
  var prevFood = foodEl.innerHTML;

  var containsClass = recipeItem.classList.contains('editMode');
  var editButton = recipeItem.querySelector('button.edit');

  var elArr = [];
  var classArr = ['p.cups', 'p.calories', 'p.carbs', 'p.protein', 'p.fat', 'p.sugar', 'p.fiber'];
  var namesArr = ['cups', 'calories', 'carbs', 'protein', 'fat', 'sugar', 'fiber'];
  var prevArr = [];
  for (var i = 0; i < classArr.length; i++) {
    elArr[i] = recipeItem.querySelector(classArr[i]);
    prevArr[i] = elArr[i].innerHTML;
  }

/* Swaps the p value with the input value if you click edit
 * clicking edit again to switch out of editmode swaps edit input value with p value
 */
  if (containsClass) {

    if (editQuantity.value > 0) {
      elArr[0].innerHTML = editQuantity.value;
    } else {
      elArr[0].innerHTML = prevArr[0];
    }

    // Recalculate and display the values with the new quantity
    for (var j = 1; j < elArr.length; j++) {
      elArr[j].innerHTML = ((elArr[j].innerHTML/prevArr[0]) * elArr[0].innerHTML).toFixed(0);
    }

    editButton.innerHTML = 'Edit Qty';
    
    var byName = {};
    recipeArray.forEach(function(obj) {
      byName[obj.food] = obj;
    });

    for (var k = 0; k < elArr.length; k++) {
      byName[prevFood][namesArr[k]] = parseFloat(elArr[k].innerHTML); 
    }
    // Recalculate and display the sum totals
    addQuantity();

  } else {
    // editQuantity.value = cupsEl.innerHTML;
    editQuantity.value = elArr[0].innerHTML;
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

/* The delete function to select the parent node the removes 
/  child to delete the row
*/
var deleteRecipe = function() {
  var buttonCell = this.parentNode;
  var buttonRow = buttonCell.parentNode;
  var foodName = buttonRow.querySelector('p.food').innerHTML;
  var nutriArray;
  var tbody = buttonRow.parentNode;
  tbody.removeChild(buttonRow);

  recipeArray = recipeArray.filter(function(el) {
    return el.food !== foodName;
  });

  nutriArray = recipeArray.map(healthAnalysis);
  addQuantity();
  // Check if we have already analyzed and if so update to remove the message
  if (document.getElementById('analysis').childNodes[0].innerHTML) {
    displayMessage(nutriArray);
  }
}

// Create an add function that sums the colums and displays them on the bottom row
var addQuantity = function(foodObject) {
  var title = 'Total';
  var cups = 0;
  var calories = 0;
  var carbs = 0;
  var protein = 0;
  var fat = 0;
  var sugar = 0;
  var fiber = 0;

  var valueArr = [];
  var nameArr = ['cups', 'calories', 'carbs', 'protein', 'fat', 'sugar', 'fiber'];

  if (foodObject) {
    //check recipeArray to see if the foodObject.food exists
    var recipeObject = recipeArray.filter(function(element) {
      return element.food === foodObject.food;
    });

    recipeArray.push(foodObject);
  }

  for (var i = 0; i < nameArr.length; i++) {
    valueArr.push(total(recipeArray.map(function(item) {
      return item[nameArr[i]];
    })));
  }

  var displayRow = function(value, name) {
    var outputDiv = document.getElementById(name);
    outputDiv.innerHTML = value;
  }

  // Add the totals to the footer table row
  for (var j = 0; j < valueArr.length; j++) {
    displayRow(valueArr[j], nameArr[j])  
  }

}

var total = function(array) {
  function plus(a, b) { 
    return a + b; 
  }

  return array.reduce(plus, 0);
}

var mapper = function(array, prop) {
  return array[prop];
}

// Display the nutritional analysis strings
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

// Function to pull property names from array of objects
var macroNutrients = function(r) {
  var macroNames = [];
  var prop;
  for (var i = 3; i < 8; i++) {
    prop = Object.keys(r)[i];
    macroNames.push(prop);
  }

  return macroNames;
}

// Create message strings with health information
var healthAnalysis = function(current, index, array) {

  var len = recipeArray.length;
  var nutriString = '';
  var macros = macroNutrients(current);
  var uniqueMessage = [];
  var item = '';
  var arr = ['protein', 'fat', 'sugar', 'fiber'];

  nutriString += 'The ' + current.food + ' is ';
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < 5; j++) {
      if (macros[j] === arr[i] && (current[arr[i]] / current.cups) < 2) {
        nutriString += ' low ' + arr[i] + ',';
      } else if (macros[j] === arr[i] && (current[arr[i]] / current.cups) >= 2) {
        nutriString += ' high ' + arr[i] + ',';
      } 
    }
  }

  nutriString = nutriString.replace(/(^,)|(,$)/g, '');
  return nutriString;
}

// Loop through table data elements and change background colors according to nutrition rules
var colorChanger = function() {
  var cupsCell = document.querySelectorAll('p.cups');

  var proteinCell = document.querySelectorAll('p.protein');
  var fiberCell = document.querySelectorAll('p.fiber');
  var goodArr = [proteinCell, fiberCell];
  
  var fatCell = document.querySelectorAll('p.fat');
  var sugarCell = document.querySelectorAll('p.sugar');
  var badArr = [fatCell, sugarCell];

  for (var i = 0; i < goodArr.length; i++) {
    for (var j = 0; j < goodArr[i].length; j++) {
      if ((goodArr[i][j].innerHTML / cupsCell[j].innerHTML) >= 2) {
        goodArr[i][j].parentNode.style.backgroundColor = 'green';
      } else {
        goodArr[i][j].parentNode.style.backgroundColor = 'red';
      }
    }
  }

  for (var i = 0; i < badArr.length; i++) {
    for (var j = 0; j < badArr[i].length; j++) {
      if ((badArr[i][j].innerHTML / cupsCell[j].innerHTML) >= 2) {
        badArr[i][j].parentNode.style.backgroundColor = 'red';
      } else {
        badArr[i][j].parentNode.style.backgroundColor = 'green';
      }
    }
  }

}

