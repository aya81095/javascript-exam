// & style animation
// * open side bar
function openSideNav() {
  const sideNav = document.querySelector(".side-nav-menu");
  const icon = document.querySelector(".open-close-icon");
  const listItems = document.querySelectorAll(".links li");

  sideNav.classList.add("open");

  icon.classList.remove("fa-bars");
  icon.classList.add("fa-x");

  listItems.forEach((li, i) => {
    li.style.transitionDelay = `${i * 0.2}s`;
    li.classList.add("show");
  });
}

// * close side bar
function closeSideNav() {
  const sideNav = document.querySelector(".side-nav-menu");
  const icon = document.querySelector(".open-close-icon");
  const listItems = document.querySelectorAll(".links li");

  sideNav.classList.remove("open");

  icon.classList.remove("fa-x");
  icon.classList.add("fa-bars");

  listItems.forEach((li) => {
    li.classList.remove("show");
    li.style.transitionDelay = "0.1s";
  });
}

// * toggle side bar
function toggleSideNav() {
  const sideNav = document.querySelector(".side-nav-menu");

  if (sideNav.classList.contains("open")) {
    closeSideNav();
  } else {
    openSideNav();
  }
}

// * cards animation
function animation() {
  let cards = document.querySelectorAll(".food-card");
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add("show");
    }, i * 50);
  });
}

// & containers
let dataContainer = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");

// * categories
async function getAllCategories() {
  searchContainer.innerHTML = "";
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let data = await response.json();
  console.log(data);
  displayCategories(data.categories);
}

function displayCategories(arr) {
  let categories = "";

  for (let i = 0; i < arr.length; i++) {
    categories += `
        <div class="col-lg-3 col-md-4 col-sm-6 food-card ">
                <div onclick="getCategoryMeals('${
                  arr[i].strCategory
                }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${
                      arr[i].strCategoryThumb
                    }" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center p-2 d-flex justify-content-center align-items-center flex-column">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                    </div>
                </div>
        </div>
        `;
  }

  dataContainer.innerHTML = categories;
  animation();
}

// * meal details
async function getMealDetails(mealID) {
  searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  let data = await response.json();
  console.log(data);
  displayMealDetails(data.meals[0]);
}

function displayMealDetails(meal) {
  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-primary m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }
  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-warning m-2 p-1">${tags[i]}</li>`;
  }

  let details = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2 class=" mt-2 fw-bold">${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h3 class="fw-bolder">Instructions</h3>
                <p>${meal.strInstructions}</p>
                <h4><span class="fw-bolder">Area : </span>${meal.strArea}</h4>
                <h4><span class="fw-bolder">Category : </span>${meal.strCategory}</h4>
                <h4 class="fw-bolder">Recipes :</h4>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h4 class="fw-bolder">Tags :</h4>
                <ul class="list d-flex g-3 flex-wrap ps-0">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

  dataContainer.innerHTML = details;
  animation();
}
// * display meals
function displayMeals(arr) {
  let meals = "";

  for (let i = 0; i < arr.length; i++) {
    meals += `
        <div class="col-lg-3 col-md-4 col-sm-6 food-card">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center d-flex p-2 d-flex flex-column justify-content-center align-items-center">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `;
  }

  dataContainer.innerHTML = meals;
  animation();
}

// * category meals
async function getCategoryMeals(category) {
  searchContainer.innerHTML = "";
  dataContainer.innerHTML = "";

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let data = await response.json();
  console.log(data);

  displayMeals(data.meals.slice(0, 20));
  animation();
}

// * areas
async function getAreas() {
  searchContainer.innerHTML = "";
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await respone.json();
  console.log(data);

  displayArea(data.meals);
}

function displayArea(area) {
  let areas = "";
  for (let i = 0; i < area.length; i++) {
    areas += `
        <div class="col-lg-3 col-md-4 col-sm-6 food-card">
                <div onclick="getAreaMeals('${area[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-location-dot fa-4x"></i>
                        <h3>${area[i].strArea}</h3>
                </div>
        </div>
        `;
  }

  dataContainer.innerHTML = areas;
  animation();
}

// * area meals
async function getAreaMeals(area) {
  searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let data = await response.json();
  console.log(data);
  displayMeals(data.meals.slice(0, 20));
}

// * ingredients
async function getIngredients() {
  searchContainer.innerHTML = "";
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await respone.json();
  console.log(data);
  displayIngredients(data.meals.slice(0, 20));
}

function displayIngredients(arr) {
  let ingredients = "";

  for (let i = 0; i < arr.length; i++) {
    ingredients += `
        <div class="col-lg-3 col-md-4 col-sm-6 food-card">
                <div onclick="getIngredientsMeals('${
                  arr[i].strIngredient
                }')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-bowl-food fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                </div>
        </div>
        `;
  }

  dataContainer.innerHTML = ingredients;
  animation();
}

// * ingredients meals
async function getIngredientsMeals(ingr) {
  searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingr}`
  );
  let data = await response.json();
  console.log(data);

  displayMeals(data.meals.slice(0, 20));
}

// * search
function searchInputs() {
  searchContainer.innerHTML = `
  <div class="row g-3 mt-3">
        <div class="col-md-6">
            <input oninput="searchByName(this.value)" class="form-control bg-transparent text-black" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input oninput="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-black" type="text" placeholder="Search By First Letter">
        </div>
        </div>`;

  dataContainer.innerHTML = "";
}

async function searchByName(name) {
  dataContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let data = await response.json();

  data.meals ? displayMeals(data.meals) : displayMeals([]);
}

async function searchByFLetter(name) {
  dataContainer.innerHTML = "";
  name == "" ? (name = "a") : "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${name}`
  );
  let data = await response.json();

  data.meals ? displayMeals(data.meals) : displayMeals([]);
}

searchByName("");

function displayContacts() {
  searchContainer.innerHTML = "";
  dataContainer.innerHTML = `<div class="contact pt-5 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid (exemple@gmail.com)
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password (Minimum eight characters, at least one letter and one number)
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-primary px-2 mt-3" type="submit">Submit</button>
    </div>
</div> `;
  submitBtn = document.getElementById("submitBtn");

  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true;
  });

  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true;
  });

  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true;
  });

  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true;
  });

  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true;
  });

  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true;
  });
}
let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
  if (nameInputTouched) {
    if (nameValidation()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (emailInputTouched) {
    if (emailValidation()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (phoneInputTouched) {
    if (phoneValidation()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (ageInputTouched) {
    if (ageValidation()) {
      document
        .getElementById("ageAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("ageAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (passwordInputTouched) {
    if (passwordValidation()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (repasswordInputTouched) {
    if (repasswordValidation()) {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

function nameValidation() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}

function emailValidation() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    document.getElementById("emailInput").value
  );
}

function phoneValidation() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    document.getElementById("phoneInput").value
  );
}

function ageValidation() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
    document.getElementById("ageInput").value
  );
}

function passwordValidation() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
    document.getElementById("passwordInput").value
  );
}

function repasswordValidation() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}
