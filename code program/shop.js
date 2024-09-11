const itemsPerPage = 12;

async function fetchData() {
  try {
    const response = await fetch('/getGames');
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error fetching data: ' + error);
  }
}

async function initializePage() {
  try {
    const data = await fetchData();
    const productContainer = document.querySelector('.trending-box');
    const paginationContainer = document.getElementById('pag');
    let currentPage = 1;
    let currentFilter = '*';

    function applyFilter(filter) {
      currentFilter = filter;
      displayItemsOnPage(currentPage);
    }

    const filterLinks = document.querySelectorAll('.trending-filter a');
    filterLinks.forEach(filterLink => {
      filterLink.addEventListener('click', () => {
        filterLinks.forEach(link => link.classList.remove('is_active'));
        filterLink.classList.add('is_active');
        const filter = filterLink.getAttribute('data-filter');
        applyFilter(filter);
      });
    });

    function displayItemsOnPage(page) {
      const startIdx = (page - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      productContainer.innerHTML = '';

      for (let i = startIdx; i < endIdx && i < data.games.length; i++) {
        const product = data.games[i];

        if (currentFilter === '*' || product.category === currentFilter) {
          const productItem = document.createElement('div');
          productItem.className = `col-lg-3 col-md-6 align-self-center mb-30 trending-items col-md-6 ${product.category.toLowerCase()}`;
          productItem.innerHTML = `
            <div class="item">
              <div class="thumb">
                <a href="product-details.html"><img src="${product.image}" alt="${product.title}" width="200" height="200"></a>
                <span class="price"><em>$${product.discountedPrice}</em>$${product.price}</span>
              </div>
              <div class="down-content">
                <span class="category">${product.category}</span>
                <h4>${product.title}</h4>
                <a href="#" class="add-to-cart" data-id="${product.id}" data-title="${product.title}"><i class="fa fa-shopping-bag"></i></a>
              </div>
            </div>
          `;

          productContainer.appendChild(productItem);
        }
      }

      const addToCartButtons = productContainer.querySelectorAll('.add-to-cart');
      addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const productTitle = event.currentTarget.getAttribute('data-title');
          alert(`Pesanan untuk produk ${productTitle}  akan diproses.`);
        });
      });
    }

    displayItemsOnPage(currentPage);

    const previousPageButton = document.getElementById('previousPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageLinks = paginationContainer.querySelectorAll('a');

    pageLinks.forEach(pageLink => {
      pageLink.addEventListener('click', () => {
        const clickedPage = parseInt(pageLink.id);
        if (!isNaN(clickedPage)) {
          currentPage = clickedPage;
          displayItemsOnPage(currentPage);

          pageLinks.forEach(link => link.classList.remove('current'));
          pageLink.classList.add('current');
        }
      });
    });

    previousPageButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        displayItemsOnPage(currentPage);

        pageLinks.forEach(link => link.classList.remove('current'));
        paginationContainer.querySelector(`#${currentPage}`).classList.add('current');
      }
    });

    nextPageButton.addEventListener('click', () => {
      if (currentPage < Math.ceil(data.games.length / itemsPerPage)) {
        currentPage++;
        displayItemsOnPage(currentPage);

        pageLinks.forEach(link => link.classList.remove('current'));
        paginationContainer.querySelector(`#${currentPage}`).classList.add('current');
      }
    });
  } catch (error) {
    console.error(error.message);
  }
}

initializePage();
