//Get the food and quantity inputs and assign them to variables
var foodInput = document.getElementById("new-food");
var quantityInput = document.getElementById("new-quantity");
//Assign the button to a variable
var addButton = document.getElementsByTagName("button")[0];
//Assign the parent elemnt in the table to variable
var foodTable = document.getElementById("food-table");

function addFood(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4) {
      createRow(xhr);
console.log(xhr);
    }
  };
  xhr.open('GET', 'https://api.nutritionix.com/v1_1/search/'+foodInput.value+
    '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat%2C'+
    'nf_serving_size_qty%2Cnf_calories%2Cnf_protein%2Cnf_sugars%2Cnf_dietary_fiber'+
    '&appId=a5f3fad2&appKey=852bc683dfc97b299e0b1e1d6f9be7f5');
  xhr.send();
}

//Create an add row function that builds up a table row by appending data cells 
//with each column value
var createRow = function (xhr) {
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

  foodText.innerText = data.hits[0].fields.item_name.split(' ')[0];
  foodText.className = "food";
  foodInput.type = "text";
  quantityText.innerText = Math.round(data.hits[0].fields.nf_serving_size_qty);
  quantityText.className = "quantity";
  quantityInput.type = "text";
  caloriesText.innerText = Math.round(data.hits[0].fields.nf_calories);
  caloriesText.className = "calories";
  proteinText.innerText = Math.round(data.hits[0].fields.nf_protein);
  proteinText.className = "protein";
  fatText.innerText = Math.round(data.hits[0].fields.nf_total_fat);
  fatText.className = "fat";
  sugarText.innerText = Math.round(data.hits[0].fields.nf_sugars);
  sugarText.className = "sugar";
  fiberText.innerText = Math.round(data.hits[0].fields.nf_dietary_fiber);
  fiberText.className = "fiber";
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

  var containsClass = recipeItem.classList.contains("editMode");
  var editButton = recipeItem.querySelector("button.edit");

  if (containsClass) {
    text.innerText = editInput.value;
    quantity.innerText = editQuantity.value;
    editButton.innerText = "Edit";
  } else {
    editInput.value = text.innerText;
    editQuantity.value = quantity.innerText;
    editButton.innerText = "Save";
  }
  recipeItem.classList.toggle('editMode');
  addQuantity();
}
//then swaps the p value with the input value if you click edit
//Clicking edit again to switch out of editmode swaps edit input value with p value

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
  var totalQuantity = 0;
  var totalCalories = 0;
  var totalProtein = 0;
  var totalFat = 0;
  var totalSugar = 0;
  var totalFiber = 0;
  var quantities = document.getElementsByClassName("quantity");
  var calories = document.getElementsByClassName("calories");
  var protein = document.getElementsByClassName("protein");
  var fat = document.getElementsByClassName("fat");
  var sugar = document.getElementsByClassName("sugar");
  var fiber = document.getElementsByClassName("fiber");
  for (var i = 0; i < quantities.length; i++) {
    totalQuantity += parseInt(quantities[i].innerText);
    totalCalories += parseInt(calories[i].innerText);
    totalProtein += parseInt(protein[i].innerText);
    totalFat += parseInt(fat[i].innerText);
    totalSugar += parseInt(sugar[i].innerText);
    totalFiber += parseInt(fiber[i].innerText);
  }
  document.getElementById("tQty").innerText = totalQuantity;
  document.getElementById("tCals").innerText = totalCalories;
  document.getElementById("tPro").innerText = totalProtein;
  document.getElementById("tFat").innerText = totalFat;
  document.getElementById("tSug").innerText = totalSugar;
  document.getElementById("tFib").innerText = totalFiber;
  console.log(totalFat)
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



