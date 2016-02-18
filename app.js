//Get the food and quantity inputs and assign them to variables
var foodInput = document.getElementById("new-food");
var qtyInput = document.getElementById("new-quantity");
//Assign the button to a variable
var addButton = document.getElementsByTagName("button")[0];
//Special function button
var swagButton = document.getElementsByTagName("button")[1];
//Assign the parent elemnt in the table to variable
var foodTable = document.getElementById("food-table");

var recipeArr = [];

var totalArr = [];


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

function Ingredient(food, quantity, calories, protein, fat, sugar, fiber) {
  this.food = food;
  this.quantity = quantity;
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
  var foodData = document.createElement("td");
  var foodText = document.createElement("p");
  var foodInput = document.createElement("input");
  var quantityData = document.createElement("td");
  var quantityText = document.createElement("p");
  var quantityInput = document.createElement("input");
  var caloriesData = document.createElement("td");
  var caloriesText = document.createElement("p");
  var proteinData = document.createElement("td");
  var proteinText = document.createElement("p");
  var fatData = document.createElement("td");
  var fatText = document.createElement("p");
  var sugarData = document.createElement("td");
  var sugarText = document.createElement("p");
  var fiberData = document.createElement("td");
  var fiberText = document.createElement("p");
  var editData = document.createElement("td");
  var editButton = document.createElement("button");
  var deleteData = document.createElement("td");
  var deleteButton = document.createElement("button");

  var foodName = data.hits[0].fields.item_name.split(' ')[0].slice(0, -1);
  foodText.innerText = foodName;
  foodText.className = "food";
  foodInput.type = "text";

  var numberOfCups = parseInt(qtyInput.value);
  quantityText.innerText = Math.round(numberOfCups)*qtyInput.value;
  quantityText.className = "quantity";
  quantityInput.type = "text";

  var numberOfCalories = data.hits[0].fields.nf_calories;
  caloriesText.innerText = Math.round(numberOfCalories)*qtyInput.value;
  caloriesText.className = "calories";

  var numberOfProtein = data.hits[0].fields.nf_protein;
  proteinText.innerText = Math.round(numberOfProtein)*qtyInput.value;
  proteinText.className = "protein";

  var numberOfFat = data.hits[0].fields.nf_total_fat;
  fatText.innerText = Math.round(numberOfFat)*qtyInput.value;
  fatText.className = "fat";

  var numberOfSugar = data.hits[0].fields.nf_sugars;
  sugarText.innerText = Math.round(numberOfSugar)*qtyInput.value;
  sugarText.className = "sugar";

  var numberOfFiber = data.hits[0].fields.nf_dietary_fiber;
  fiberText.innerText = Math.round(numberOfFiber)*qtyInput.value;
  fiberText.className = "fiber";

  var theIngredient = new Ingredient(foodName, numberOfCups, numberOfCalories, numberOfProtein, numberOfFat, numberOfSugar, numberOfFiber );

  recipeArr.push(theIngredient);
  // console.log(recipeArr);

  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";

  foodData.appendChild(foodText);
  foodData.appendChild(foodInput);
  quantityData.appendChild(quantityText);
  quantityData.appendChild(quantityInput);
  caloriesData.appendChild(caloriesText);
  proteinData.appendChild(proteinText);
  fatData.appendChild(fatText);
  sugarData.appendChild(sugarText);
  fiberData.appendChild(fiberText);
  editData.appendChild(editButton);
  deleteData.appendChild(deleteButton);

  recipeItem.appendChild(foodData);
  recipeItem.appendChild(quantityData);
  recipeItem.appendChild(caloriesData);
  recipeItem.appendChild(proteinData);
  recipeItem.appendChild(fatData);
  recipeItem.appendChild(sugarData);
  recipeItem.appendChild(fiberData);
  recipeItem.appendChild(editData);
  recipeItem.appendChild(deleteData);
  foodTable.appendChild(recipeItem);
  bindRecipeEvents(recipeItem);
  foodInput.value = "";
  addQuantity();
}

addButton.addEventListener("click", addFood);

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

//Create delete function that selects the parent row node of the button to a variable, then 
//moves up to the next parent and removes that variable which is now the child
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

  var nutriArray = [];
  nutriArray.push(recipeArr.map(highFiber));
  nutriArray.push(recipeArr.map(lowFat));
  nutriArray.push(recipeArr.map(highProtein));
  nutriArray.push(recipeArr.map(lowSugar));

  display(nutriArray);
});

var display = function(r) {
  for (var i = 0; i < r.length; i++){
    var messageNode = document.createElement("li");
    messageNode.innerText = r[i];
    document.getElementById("analysis").appendChild(messageNode);
  }
}

var highFiber = function(r) {
  var fiberProp = Object.keys(r)[6];
  var rArr = [];
  if (r.fiber > 2){
    rArr.push("The " + r.food + " is high in " + fiberProp);
  } else {
    rArr.push("The " + r.food + " is low in " + fiberProp);
  }
  return rArr;
}

var lowFat = function(r) {
  var fatProp = Object.keys(r)[4];
  var rArr = [];
  if (r.fat > 2){
    rArr.push("The " + r.food + " is high in " + fatProp);
  } else {
    rArr.push("The " + r.food + " is low in " + fatProp);
  }
  return rArr;
}

var highProtein = function(r) {
  var proteinProp = Object.keys(r)[3];
  var rArr = [];
  if (r.protein > 5){
    rArr.push("The " + r.food + " is high in " + proteinProp);
  } else {
    rArr.push("The " + r.food + " is low in " + proteinProp);
  }
  return rArr;
}

var lowSugar = function(r) {
  var sugarProp = Object.keys(r)[5];
  var rArr = [];
  if (r.sugar > 5){
    rArr.push("The " + r.food + " is high in " + sugarProp);
  } else {
    rArr.push("The " + r.food + " is low in " + sugarProp);
  }
  return rArr;
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



