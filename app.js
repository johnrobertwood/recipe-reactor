//Get the food and quantity inputs and assign them to variables
var foodInput = document.getElementById("new-food");
var quantityInput = document.getElementById("new-quantity");
//Assign the button to a variable
var addButton = document.getElementsByTagName("button")[0];
//Assign the parent elemnt in the table to variable
var foodTable = document.getElementById("food-table");

function addFood(){
	var recipeItem = createRow("banana", 1);
	foodTable.appendChild(recipeItem);
}


//Create an add row function that builds up a table row by appending data cells with each column value
function createRow(food, quantity) {
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
  var fiberData = document.createElement("td");
  var fiberText = document.createElement("p");
  var sugarData = document.createElement("td");
  var sugarText = document.createElement("p");
  var editData = document.createElement("td");
  var editButton = document.createElement("button");
  var deleteData = document.createElement("td");
  var deleteButton = document.createElement("button");

  foodData.innerHTML = food;
  foodInput.type = "text";
  quantityData.innerHTML = quantity;
  quantityInput.type = "text";
  editButton.innerHTML = "Edit";
  editButton.className = "edit";
  deleteButton.innerHTML = "Delete";
  deleteButton.className = "delete";

  foodData.appendChild(foodText);
  foodData.appendChild(foodInput);
  quantityData.appendChild(quantityText);
  quantityData.appendChild(quantityInput);
  caloriesData.appendChild(caloriesText);
  proteinData.appendChild(proteinText);
  fiberData.appendChild(fiberText);
  sugarData.appendChild(sugarText);
  editData.appendChild(editButton);
  deleteData.appendChild(deleteButton);

  recipeItem.appendChild(foodData);
  recipeItem.appendChild(quantityData);
  recipeItem.appendChild(caloriesData);
  recipeItem.appendChild(proteinData);
  recipeItem.appendChild(fiberData);
  recipeItem.appendChild(sugarData);
  recipeItem.appendChild(editData);
  recipeItem.appendChild(deleteData);

  return recipeItem;

}

addButton.addEventListener("click", addFood);


//Create an edit function that selects the parent node of the button
//then swaps the p value with the input value if you click edit
//Clicking edit again to switch out of editmode swaps edit input value with p value

//Create delete function that selects the parent row node of the button to a variable, then 
//moves up to the next parent and removes that variable which is now the child

//Create an add function that sums the colums and displays them on the bottom row

//Create a bind function that assigns click event handlers to the edit and delete functions
//use a for loop to go through each table row calling the bind function






