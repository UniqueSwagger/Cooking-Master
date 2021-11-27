const mealContainer = document.getElementById("meals");
const searchField = document.getElementById("search-field");

let orderedProductsArray = [];
const fetchData = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
document.getElementById("search-btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("meals").innerHTML = `<div
  id="spinner"
  class="spinner-border mx-auto text-primary"
  role="status"
>
  <span class="visually-hidden">Loading...</span>
</div>`;
  if (searchField.value == "") {
    mealContainer.innerHTML =
      "<p class='text-center mx-auto p-3 bg-danger'><b>Please enter a meal name...</b></p>";
  }
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchField.value}`;
  fetchData(url).then((data) => displayMeals(data.meals));
});
const displayMeals = (meals) => {
  if (meals == null) {
    mealContainer.innerHTML = ` <div class="card m-auto p-5 bg-warning" style="width: 18rem">
    <h5 class="card-title">Dear Sir/Ma'am,</h5>
    <p class="card-text">
      Your search --<b>${searchField.value}</b>-- did not match any of our set meal. Please enter a
      correct name.
    </p>
  </div>`;
  } else {
    searchField.value = "";
    const spinner = document.getElementById("spinner");
    spinner.classList.add("d-none");
    meals.forEach((meal) => {
      const mealDiv = document.createElement("div");
      const { strMealThumb, strMeal, idMeal } = meal;
      mealDiv.innerHTML = `
  <div class="col">
    <div class="card h-100 mx-auto"style="width:95%">
      <img src="${strMealThumb}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title text-center">${strMeal}</h5>
      </div>
      <button onclick="loadDetails(${idMeal})" type="button" class="btn btn-primary w-50 mx-auto my-2">See details</button>
    </div>
  </div>
    `;
      mealContainer.appendChild(mealDiv);
    });
  }
};
const loadDetails = (mealId) => {
  window.scrollTo(0, 60);
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  fetchData(url).then((data) => displayDetails(data.meals[0]));
};
const displayDetails = (meal) => {
  const singleMealContainer = document.getElementById("meal");
  singleMealContainer.textContent = "";
  const mealDiv = document.createElement("div");
  mealDiv.innerHTML = `
    <div class="card mobile h-100 mx-auto"style="width:30%">
      <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${meal.strMeal}</h5>
        <p><strong>ingredients</strong></p>
        <ul id="ingredient-list" ></ul>
      </div>
      <button onclick="addToCart(${meal.idMeal})" type="button" class="btn btn-primary w-50 mx-auto my-2">Add to cart</button>
    </div>

    `;
  singleMealContainer.appendChild(mealDiv);

  const ul = document.getElementById("ingredient-list");
  for (let i = 1; i <= 20; i++) {
    let ingredientNum = "strIngredient" + i;
    let ingredient = meal[ingredientNum];
    let quantityNum = "strMeasure" + i;
    let quantity = meal[quantityNum];
    const li = document.createElement("li");
    li.innerText = `${quantity} ${ingredient}`;
    const listItem = li.innerText;

    if (listItem.length > 2 && listItem.indexOf(null) == -1) {
      ul.appendChild(li);
    }
  }
};

const addToCart = (productId) => {
  window.scrollTo(0, 10);
  const isMealInArray = orderedProductsArray.find(
    (product) => product.idMeal == productId
  );
  if (isMealInArray != undefined) {
    isMealInArray.quantity++;
    updateCart();
  } else {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${productId}`;
    fetchData(url).then((data) => {
      const { strMeal, strMealThumb, idMeal } = data.meals[0];

      orderedProductsArray = [
        ...orderedProductsArray,
        { strMeal, strMealThumb, idMeal, quantity: 1 },
      ];

      updateCart();
    });
  }
};
const updateCart = () => {
  document.getElementById("cart-count").innerText = orderedProductsArray.length;

  const cartDiv = document.getElementById("cart-products");
  cartDiv.innerHTML = "";

  orderedProductsArray.map((product) => {
    const mealDiv = document.createElement("div");

    mealDiv.classList.add("card", "mb-3");
    mealDiv.style.maxWidth = "540px";

    mealDiv.innerHTML = `
  <div class="row g-0 ">
    <div class="col-md-4">
      <img src='${product.strMealThumb}' class="img-fluid rounded rounded-circle p-3" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body mt-3">
        <h5 class="card-title"> ${product.strMeal}</h5>
 <p>Quantity: ${product.quantity}</p>
      </div>

    </div>
  </div>
`;

    cartDiv.appendChild(mealDiv);
  });
};
