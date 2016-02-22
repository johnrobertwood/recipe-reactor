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
var recipeArr = [];

//An array to store the sum of the values in each column
var totalArr = [];

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

  recipeArr.push(theIngredient);
  foodInput.value = "";
  addQuantity();
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
  var text = recipeItem.querySelectorAll("p")[0];
  var quantity = recipeItem.querySelectorAll("p")[1];
  var calories = recipeItem.querySelectorAll("p")[2];
  var protein = recipeItem.querySelectorAll("p")[3];
  var fat = recipeItem.querySelectorAll("p")[4];
  var sugar = recipeItem.querySelectorAll("p")[5];
  var fiber = recipeItem.querySelectorAll("p")[6];
  var containsClass = recipeItem.classList.contains("editMode");
  var editButton = recipeItem.querySelector("button.edit");

//Swaps the p value with the input value if you click edit
//Clicking edit again to switch out of editmode swaps edit input value with p value
  if (containsClass) {
    text.innerText = editInput.value;
    quantity.innerText = editQuantity.value;
    calories.innerText *= quantity.innerText;
    protein.innerText *= quantity.innerText; 
    fat.innerText *= quantity.innerText;
    sugar.innerText *= quantity.innerText;
    fiber.innerText *= quantity.innerText;
    editButton.innerText = "Edit";
  } else {
    editInput.value = text.innerText;
    editQuantity.value = quantity.innerText;
    editButton.innerText = "Save";
  }
  recipeItem.classList.toggle('editMode');
  addQuantity();
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
var addQuantity = function() {
  var title = "Total"
  var totalQuantity = 0;
  var totalCalories = 0;
  var totalProtein = 0;
  var totalFat = 0;
  var totalSugar = 0;
  var totalFiber = 0;
  
  //Create arrays that contain all of the table data column cells
  var quantities = document.getElementsByClassName("quantity");
  var calories = document.getElementsByClassName("calories");
  var protein = document.getElementsByClassName("protein");
  var fat = document.getElementsByClassName("fat");
  var sugar = document.getElementsByClassName("sugar");
  var fiber = document.getElementsByClassName("fiber");

  //Go through each table row and add the nutrient values in each column to their respective totals
  for (var i = 0; i < quantities.length; i++) {
    totalQuantity += parseInt(quantities[i].innerText);
    totalCalories += parseInt(calories[i].innerText);
    totalProtein += parseInt(protein[i].innerText);
    totalFat += parseInt(fat[i].innerText);
    totalSugar += parseInt(sugar[i].innerText);
    totalFiber += parseInt(fiber[i].innerText);
  }

  //Create a new object with the total values of each nutrient column
  var theTotal = new Ingredient(title, totalQuantity, totalCalories, totalProtein, totalFat, totalSugar, totalFiber);

  totalArr = [theTotal];

  //Add the totals to the footer table row
  document.getElementById("tQty").innerText = totalQuantity;
  document.getElementById("tCals").innerText = totalCalories;
  document.getElementById("tPro").innerText = totalProtein;
  document.getElementById("tFat").innerText = totalFat;
  document.getElementById("tSug").innerText = totalSugar;
  document.getElementById("tFib").innerText = totalFiber;

}

swagButton.addEventListener('click', function() {

  var nutriArray = recipeArr.map(healthAnalysis);
  display(nutriArray);
  colorChanger(recipeArr);
});

var display = function(r) {
  // console.log(document.getElementById("analysis"))
  var messageText;
  for (var i = 0; i < r.length; i++){
    messageText = document.createElement("li");
    messageText.innerText = r[i];
    document.getElementById("analysis").appendChild(messageText);
    console.log(r);
  }
}


var healthAnalysis = function(r) {
  var rArr = [];
  var len = recipeArr.length;
  var macros = macroNutrients(r);
    for (var i = 0; i < 4; i++) {
    if (macros[i] === "protein" && r.protein > 5) {
      rArr.push("The " + r.food + " is high in " + macros[i]);

    } else if (macros[i] === "fat" && r.fat < 2) {
      rArr.push("The " + r.food + " is low in " + macros[i]);
    } else if (macros[i] === "sugar" && r.sugar < 5) {
      rArr.push("The " + r.food + " is low in " + macros[i]);
    } else if (macros[i] === "fiber" && r.fiber > 2) {
      rArr.push("The " + r.food + " is high in " + macros[i]);
      // recipeItem.querySelector("p.fiber").style.backgroundColor = "green";
    }
  }
  return rArr;
}

var colorChanger = function(r) {
  var fiberCell = document.querySelectorAll("p.fiber");
  var fatCell = document.querySelectorAll("p.fat");
  for (var i = 0; i < fiberCell.length; i++) {
    if (fiberCell[i].innerHTML > 2) {
      fiberCell[i].parentNode.style.backgroundColor = "green";
    } else
    {
      fiberCell[i].parentNode.style.backgroundColor = "red";
    }
  }
  for (var j = 0; j < fatCell.length; j++) {
    if (fatCell[j].innerHTML < 2) {
      fatCell[j].parentNode.style.backgroundColor = "green";
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



