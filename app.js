//Get the food and quantity inputs and assign them to variables
var foodInput = document.getElementById("new-food");
var qtyInput = document.getElementById("new-quantity");
//Assign the button to a variable
var addButton = document.getElementsByTagName("button")[0];
//Special function button
var swagButton = document.getElementsByTagName("button")[1];
//Assign the parent elemnt in the table to variable
var foodTable = document.getElementById("food-table");

//An array that contains food objects that contain nutritional info
var recipeArray = [];

//Get nutrion data from the Nutronix API
function addFood(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4) {
      createRow(xhr);
    }
  };
  xhr.open('GET', 'https://api.nutritionix.com/v1_1/search/'+foodInput.value+
    '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat%2C'+
    '%2Cnf_calories%2Cnf_protein%2Cnf_sugars%2Cnf_dietary_fiber'+
    '&appId=a5f3fad2&appKey=852bc683dfc97b299e0b1e1d6f9be7f5');
  xhr.send();
}

function Ingredient(food, cups, calories, protein, fat, sugar, fiber) {
  this.food = food;
  this.cups = cups;
  this.calories = calories;
  this.protein = protein;
  this.fat = fat;
  this.sugar = sugar;
  this.fiber = fiber;
}

//Create an add row function that builds up a table row by appending data cells 
//with each column value
var createRow = function (xhr) {
  var recipeArray = [];
  var foodObject = {};
  var data = JSON.parse(xhr.responseText);

  var recipeItem = document.createElement("tr");

  var foodName = data.hits[0].fields.item_name.split(' ')[0];
  var foodDataCell = document.createElement("td");
  var foodText = document.createElement("p");
  var foodInput = document.createElement("input");
  foodText.className = "food";
  foodText.innerText = foodName;
  foodInput.type = "text";
  foodInput.className = "foodInput";
  foodDataCell.appendChild(foodText);
  foodDataCell.appendChild(foodInput);
  recipeItem.appendChild(foodDataCell);
  
  var numberOfCups = parseInt(qtyInput.value);
  var cupsDataCell = document.createElement("td");
  var cupsText = document.createElement("p");
  var cupsInput = document.createElement("input");
  cupsText.className = "quantity";
  cupsText.innerText = Math.round(numberOfCups)*qtyInput.value;
  cupsInput.type = "text";
  cupsDataCell.appendChild(cupsText);
  cupsDataCell.appendChild(cupsInput);
  recipeItem.appendChild(cupsDataCell);

  var numberOfCalories = data.hits[0].fields.nf_calories;
  var caloriesDataCell = document.createElement("td");
  var caloriesText = document.createElement("p");
  caloriesText.className = "calories";
  caloriesText.innerText = Math.round(numberOfCalories)*qtyInput.value;
  caloriesDataCell.appendChild(caloriesText);
  recipeItem.appendChild(caloriesDataCell);

  var numberOfProtein = data.hits[0].fields.nf_protein;
  var proteinDataCell = document.createElement("td");
  var proteinText = document.createElement("p");
  proteinText.className = "protein";
  proteinText.innerText = Math.round(numberOfProtein)*qtyInput.value;
  proteinDataCell.appendChild(proteinText);
  recipeItem.appendChild(proteinDataCell);

  var numberOfFat = data.hits[0].fields.nf_total_fat;
  var fatDataCell = document.createElement("td");
  var fatText = document.createElement("p");
  fatText.className = "fat";
  fatText.innerText = Math.round(numberOfFat)*qtyInput.value;
  fatDataCell.appendChild(fatText);
  recipeItem.appendChild(fatDataCell);

  var numberOfSugar = data.hits[0].fields.nf_sugars;
  var sugarDataCell= document.createElement("td");
  var sugarText = document.createElement("p");
  sugarText.className = "sugar";
  sugarText.innerText = Math.round(numberOfSugar)*qtyInput.value;
  sugarDataCell.appendChild(sugarText);
  recipeItem.appendChild(sugarDataCell);

  var numberOfFiber = data.hits[0].fields.nf_dietary_fiber;
  var fiberDataCell = document.createElement("td");
  var fiberText = document.createElement("p");
  fiberText.className = "fiber";
  fiberText.innerText = Math.round(numberOfFiber)*qtyInput.value;
  fiberDataCell.appendChild(fiberText);
  recipeItem.appendChild(fiberDataCell);

  var editDataCell = document.createElement("td");
  var editButton = document.createElement("button");
  editButton.className = "edit";
  editButton.innerText = "Edit";
  editDataCell.appendChild(editButton);
  recipeItem.appendChild(editDataCell);

  var deleteDataCell = document.createElement("td");
  var deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.innerText = "Delete";
  deleteDataCell.appendChild(deleteButton);
  recipeItem.appendChild(deleteDataCell);

  foodTable.appendChild(recipeItem);
  
  bindRecipeEvents(recipeItem);
  
  //Create an object with the nutrient keys and values to push into our array of recipe ingredients
  var theIngredient = new Ingredient(foodName, numberOfCups, numberOfCalories, 
    numberOfProtein, numberOfFat, numberOfSugar, numberOfFiber);

  addQuantity(theIngredient);

  foodInput.value = "";
}

addButton.addEventListener("click", function(){
  if (foodInput.value !== ""){
    addFood();
  }
});

//Create an edit function that selects the parent node of the button
var editRecipe = function() {
  var editCell = this.parentNode;
  var recipeItem = editCell.parentNode;
  var editInput = recipeItem.querySelectorAll("input[type=text]")[0];
  var editQuantity = recipeItem.querySelectorAll("input[type=text]")[1];
  var textElement = recipeItem.querySelector("p.food");

  var quantityElement = recipeItem.querySelector("p.quantity");
  var previousQuantity = quantityElement.innerHTML;

  var caloriesElement = recipeItem.querySelector("p.calories");
  var previousCalories = caloriesElement.innerHTML;

  var proteinElement = recipeItem.querySelector("p.protein");
  var previousProtein = proteinElement.innerHTML;

  var fatElement = recipeItem.querySelector("p.fat");
  var previousFat = fatElement.innerHTML;

  var sugarElement = recipeItem.querySelector("p.sugar");
  var previousSugar = sugarElement.innerHTML;

  var fiberElement = recipeItem.querySelector("p.fiber");
  var previousFiber = fiberElement.innerHTML;

  var containsClass = recipeItem.classList.contains("editMode");
  var editButton = recipeItem.querySelector("button.edit");

//Swaps the p value with the input value if you click edit
//Clicking edit again to switch out of editmode swaps edit input value with p value
  if (containsClass) {

    textElement.innerText = editInput.value;
    var newtext = textElement.innerText;

    quantityElement.innerText = editQuantity.value;
    var newquantity = quantityElement.innerText - previousQuantity;

    caloriesElement.innerText = (caloriesElement.innerText/previousQuantity) * quantityElement.innerText;
    var newcalories = caloriesElement.innerText - previousCalories;

    proteinElement.innerText = (proteinElement.innerText/previousQuantity) * quantityElement.innerText; 
    var newprotein = proteinElement.innerText - previousProtein;

    fatElement.innerText = (fatElement.innerText/previousQuantity) * quantityElement.innerText;
    var newfat = fatElement.innerText - previousFat; 

    sugarElement.innerText = (sugarElement.innerText/previousQuantity) * quantityElement.innerText;
    var newsugar = sugarElement.innerText - previousSugar;

    fiberElement.innerText = (fiberElement.innerText/previousQuantity) * quantityElement.innerText;
    var newfiber = fiberElement.innerText - previousFiber;

    editButton.innerText = "Edit";

    var theIngredient = new Ingredient(newtext, newquantity, newcalories, newprotein, newfat, newsugar, newfiber);

    addQuantity(theIngredient);

  } else {

    editInput.value = textElement.innerText;
    editQuantity.value = quantityElement.innerText;
    editButton.innerText = "Save";
    
  }
  recipeItem.classList.toggle('editMode');


}

//Create delete function to select the parent row node of the button, assign to a variable 
//then move up to the next parent and then removes the child to delete the row
var deleteRecipe = function() {
  var buttonCell = this.parentNode;
  var buttonRow = buttonCell.parentNode;
  var tbody = buttonRow.parentNode;
  tbody.removeChild(buttonRow);
}

//Create an add function that sums the colums and displays them on the bottom row
var addQuantity = function(foodObject) {
  var title = "Total"
  var quantity = 0;
  var cals = 0;
  var protein = 0;
  var fat = 0;
  var sugar = 0;
  var fiber = 0;
  var totalArr = [];

  recipeArray.push(foodObject);

  quantity = Math.round(total(recipeArray.map(function(item) {
    return item.cups;
  })));

  cals = Math.round(total(recipeArray.map(function(item) {
    return item.calories;
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

  //Add the totals to the footer table row
  document.getElementById("tQty").innerText = quantity;
  document.getElementById("tCals").innerText = cals;
  document.getElementById("tPro").innerText = protein;
  document.getElementById("tFat").innerText = fat;
  document.getElementById("tSug").innerText = sugar;
  document.getElementById("tFib").innerText = fiber;

}

swagButton.addEventListener('click', function() {
  // var nutriArray = recipeArr.map(healthAnalysis);
  // var diet = document.getElementById("diet").value;
  // var highFiber = recipeArr.filter(fiberFilter).map(healthAnalysis);
  // display(nutriArray, diet);
  // colorChanger(diet);
  // average(recipeArr);

});

var total = function(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus);
}

var mapper = function(array, prop) {
  return array[prop];
}

var display = function(r, diet) {
  // console.log(document.getElementById("analysis"))
  var messageText;
  var dietCaps = diet.slice(0,1).toUpperCase() + diet.slice(1);
  document.getElementById("dietMessage").innerHTML = "The " + dietCaps + " breakdown";
  var oldList = document.getElementById("analysis");
  while (oldList.firstChild) {
    oldList.removeChild(oldList.firstChild);
  }

  for (var i = 0; i < r.length; i++){
    messageText = document.createElement("li");
    messageText.innerHTML = r[i];
    document.getElementById("analysis").appendChild(messageText);
  }
}


var healthAnalysis = function(current, index, array) {
  var len = recipeArr.length;
  var nutriString = "";
  var macros = macroNutrients(current);
  nutriString += "The " + current.food + " is ";
    for (var i = 0; i < 4; i++) {
    if (macros[i] === "protein" && current.protein > 5) {
      nutriString += "high protein ";
    } else if (macros[i] === "fat" && current.fat < 2) {
      nutriString += "low fat ";
    } else if (macros[i] === "sugar" && current.sugar < 5) {
      nutriString += "low sugar ";
    } else if (macros[i] === "fiber" && current.fiber > 2) {
      nutriString += "high fiber "
    }
  }
    console.log(nutriString);
  return nutriString;
}

var colorChanger = function(diet){
  var proteinCell = document.querySelectorAll("p.protein")
  var fatCell = document.querySelectorAll("p.fat");
  var sugarCell = document.querySelectorAll("p.sugar");
  var fiberCell = document.querySelectorAll("p.fiber");
  if (diet === "vegan") {
    for (var i = 0; i < fiberCell.length; i++) {
      if (fiberCell[i].innerHTML > 2) {
        fiberCell[i].parentNode.style.backgroundColor = "green";
      }
    }
    for (var j = 0; j < fatCell.length; j++) {
      if (fatCell[j].innerHTML < 2) {
        fatCell[j].parentNode.style.backgroundColor = "green";
      } else {
        fatCell[j].parentNode.style.backgroundColor = "red";
      }
    }
  }
  if (diet === "paleo") {
    for (var k = 0; k < proteinCell.length; k++) {
      if (proteinCell[k].innerHTML > 5) {
        proteinCell[k].parentNode.style.backgroundColor = "green";
      }
    }
    for (var x = 0; x < fatCell.length; x++) {
      //If fat is high then make the cell green 
      //Don't make cell red if not high fat since it might be a veggie
      if (fatCell[x].innerHTML > 3) {
        fatCell[x].parentNode.style.backgroundColor = "green";
      }
    }
    for (var y = 0; y < sugarCell.length; y++) {
      if (sugarCell[y].innerHTML > 5) {
        sugarCell[y].parentNode.style.backgroundColor = "red";
      }
    }
  }
}
var macroNutrients = function(r) {
  var macroNames = [];
  for (var i = 3; i < 7; i++) {
    var prop = Object.keys(r)[i];
    macroNames.push(prop);
  }
  return macroNames;
}

//Create a bind function that assigns click event handlers to the edit and delete functions
//use a for loop to go through each table row calling the bind function
var bindRecipeEvents = function(recipeItem) {
  var editButton = recipeItem.querySelector("button.edit");
  var deleteButton = recipeItem.querySelector("button.delete");
  editButton.addEventListener("click", editRecipe);
  deleteButton.addEventListener("click", deleteRecipe);
}

for (var i = 0; i < foodTable.children.length; i++) {
  bindRecipeEvents(foodTable.children[i]);
}

// foodArray();



