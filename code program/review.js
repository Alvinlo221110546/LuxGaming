async function createPagination(currentPage, totalPages) {
  const paginationNav = document.createElement("nav");
  paginationNav.setAttribute("aria-label", "Pagination");

  const ul = document.createElement("ul");
  ul.classList.add("pagination", "justify-content-center");
  paginationNav.appendChild(ul);
  return paginationNav;
}

async function fetchData() {
  try {
    const response = await fetch("/getGames");
    const data = await response.json();

    const itemsPerPage = 4;
    const totalItems = data.games.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    let currentPage = 1;

    function changePage(newPage) {
      const reviewsContainer = document.getElementById("reviews-container");
      while (reviewsContainer.firstChild) {
        reviewsContainer.removeChild(reviewsContainer.firstChild);
      }

      const startIndex = (newPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      for (let i = startIndex; i < endIndex && i < totalItems; i++) {
        const game = data.games[i];

        const gameSection = document.createElement("div");
        gameSection.classList.add("game-section", "row");

        const leftContent = document.createElement("div");
        leftContent.classList.add("col-lg-6", "left-content");

        const imageHTML = `<img src="${game.image}" alt="${game.title}">`;
        const titleHTML = `<h4>${game.title}</h4>`;
        const categoryHTML = `<p>Category:<strong class="text-primary">${game.category}</strong></p>`;
        const tagHTML = `<p>Multi-tags:<strong class="text-primary">${game.tags}</strong></p>`;
        const descriptionHTML = `<p>Description:<p>${game.description}</p></p>`;
        leftContent.innerHTML = `<div>
        ${imageHTML}
        <br>
        ${titleHTML}
        <br>
        ${categoryHTML}
        <br>
        ${tagHTML}
        <br>
        ${descriptionHTML}
        </div>`;

        gameSection.appendChild(leftContent);

        const reviewsContainer = document.createElement("div");
        reviewsContainer.classList.add("col-lg-6", "right-content");

        game.reviews.forEach(review => {
          const reviewElement = document.createElement("div");
          reviewElement.classList.add("review");

          const userInfo = document.createElement("div");
          userInfo.classList.add("user-info");
          userInfo.innerHTML = `
          <div class="card w-100" id="comment">
          <div class="card-body p-4">
            <div class="">
              <h5 class="ml-5"><i class="fas fa-user-circle mr-5"></i>${review.user}</h5>
              <p class="small my-4">${review.date}</p>
              <p class="my-4">${review.content}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <a href="#!" class="link-muted me-2"><i class="fas fa-thumbs-up me-1"></i>158</a>
                  <a href="#!" class="link-muted"><i class="fas fa-thumbs-down me-1"></i>13</a>
                </div>
              </div>
              <div class="my-4">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div> 
            </div>
          </div>
        </div>
          `;
          reviewElement.appendChild(userInfo);

          reviewsContainer.appendChild(reviewElement);
        });
        gameSection.appendChild(reviewsContainer);
        document.getElementById("reviews-container").appendChild(gameSection);
      }

      currentPage = newPage;
    }
    changePage(currentPage);

    const paginationElement = await createPagination(currentPage, totalPages);
    const paginationContainer = document.getElementById("pagination-container"); 
    paginationContainer.appendChild(paginationElement);

    const pageLinks = paginationContainer.querySelectorAll(".page-link");
    pageLinks.forEach(pageLink => {
      pageLink.addEventListener("click", () => {
        const newPage = parseInt(pageLink.textContent);
        if (!isNaN(newPage) && newPage !== currentPage) {
          changePage(newPage);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching game data:", error);
  }
}

fetchData();
