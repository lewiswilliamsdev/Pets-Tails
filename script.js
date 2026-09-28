const dashboardButton = document.getElementById("dashboard-button")
const inventoryButton = document.getElementById("inventory-button")
const categoriesButton = document.getElementById("categories-button")
const suppliersButton = document.getElementById("suppliers-button")
const ordersButton = document.getElementById("orders-button")
const userSelect = document.getElementById("user-select")

const specialOrderButton = document.getElementById("special-orders-button")
const addProductButton = document.getElementById("add-product-button")

const totalProductsCounter = document.getElementById("total-products-counter")
const totalCategoriesCounter = document.getElementById("categories-counter")
const totalStockCounter = document.getElementById("total-stock-units")
const lowStockCounter = document.getElementById("low-stock-counter")
const inventoryValueCounter = document.getElementById("inventory-value-counter")

const stockWarningContainer = document.getElementById("stock-warning-container")
const stockWarningNumber = document.getElementById("stock-warning-number")
const viewLowStockButton = document.getElementById("view-low-stock")

const stockSearch = document.getElementById("stock-search")
const stockSearchInput = document.getElementById("stock-search-input")
const categoriesSelect = document.getElementById("categories-select")
const stockLevelSelect = document.getElementById("stock-level-select")
const sortBySelect = document.getElementById("sort-by-select")
const clearFilterButton = document.getElementById("clear-filter")

const productNameFilter = document.getElementById("product-name-filter")
const stockFilter = document.getElementById("stock-filter")
const priceFilter = document.getElementById("price-filter")

const stockList = document.getElementById("stock-list")

const underBarProductCount = document.getElementById("under-bar-product-count")
const previousPageButton = document.getElementById("previous-page")
const pageNumbersCount = document.getElementById("page-numbers")
const nextPageButton = document.getElementById("next-page")
const rowsPerPageCount = document.getElementById("rows-per-page")

const productFormContainer = document.getElementById("product-form")

const stockCategoryChart = document.getElementById("stock-category-chart")
const stockHealthChart = document.getElementById("stock-health-chart")

let products = []

let currentPage = 1;
let totalPages = 1;

let stockCategoryChartInstance = null;
let stockHealthChartInstance = null;

const categories = [
    { value: "dogFood", text: "Dog Food" },
    { value: "catFood", text: "Cat Food" },
    { value: "treats", text: "Treats" },
    { value: "toys", text: "Toys" },
    { value: "bedding", text: "Bedding" },
    { value: "collarsLeads", text: "Collars & Leads" },
    { value: "grooming", text: "Grooming" },
    { value: "accesories", text: "Other Accessories" }
    ];

const statuses = [
    {value: "inStock", text: "In Stock"},
    {value: "lowStock", text: "Low Stock"},
    {value: "noStock", text: "Out of Stock"}
];

const savedProducts = localStorage.getItem("products")

if (savedProducts) {
    products = JSON.parse(savedProducts);
}

let editingId = null;

applyFilters();
updateCounters();
renderStockByCategoryChart();
renderStockHealthChart();

function renderForm(productToEdit = null) {
    productFormContainer.innerHTML = "";

    const addProductForm = document.createElement("form");
    addProductForm.id = "add-product-form";

    const SkuInput = document.createElement("input");
    SkuInput.id = "sku-input";
    SkuInput.type = "text";

    const SkuInputLabel = document.createElement("label");
    SkuInputLabel.textContent =  "SKU:";
    SkuInputLabel.htmlFor = "sku-input";

    const  productNameInput = document.createElement("input");
    productNameInput.id = ("product-name-input");
    productNameInput.type = "text"

    const productNameInputLabel = document.createElement("label");
    productNameInputLabel.textContent = "Product Name:"
    productNameInputLabel.htmlFor = "product-name-input"

    const categoryInput = document.createElement("select");
    categoryInput.id = ("category-input");

    categories.forEach(function(category) {
        categoryInput.add(new Option(category.text, category.value));
    });

    const categoriesLabel = document.createElement("label");
    categoriesLabel.textContent = ("Category:");
    categoriesLabel.htmlFor = "category-input";

    const supplierInput = document.createElement("input");
    supplierInput.id = ("supplier-input");
    supplierInput.type = "text";

    const supplierInputLabel = document.createElement("label");
    supplierInputLabel.textContent = ("Supplier:");
    supplierInputLabel.htmlFor = "supplier-input";

    const stockInput = document.createElement("input");
    stockInput.id = ("stock-input");
    stockInput.type = "number";

    const stockInputLabel = document.createElement("label");
    stockInputLabel.textContent = ("Current Stock Amount:");
    stockInputLabel.htmlFor = "stock-input";

    const minStockInput = document.createElement("input");
    minStockInput.id = ("min-stock-input");
    minStockInput.type = "number";

    const minStockInputLabel = document.createElement("label");
    minStockInputLabel.textContent = "Minimum Desired Stock Value:";
    minStockInputLabel.htmlFor = "min-stock-input";

    const costPriceInput = document.createElement("input");
    costPriceInput.id = ("cost-price-input");
    costPriceInput.type = "number";

    const costPriceInputLabel = document.createElement("label");
    costPriceInputLabel.textContent = "Cost Price:";
    costPriceInputLabel.htmlFor = "cost-price-input";

    const sellPriceInput = document.createElement("input");
    sellPriceInput.id = ("sell-price-input");
    sellPriceInput.type = "number";

    const sellPriceInputLabel = document.createElement("label");
    sellPriceInputLabel.textContent = "Price:";
    sellPriceInputLabel.htmlFor = "sell-price-input";

    const productFormButton = document.createElement("button")
    productFormButton.id = ("product-form-button")
    productFormButton.type = ("submit");
    productFormButton.textContent = ("submit");

    if (productToEdit) {
        SkuInput.value = productToEdit.sku;
        productNameInput.value = productToEdit.name;
        categoryInput.value = productToEdit.category;
        supplierInput.value = productToEdit.supplier;
        stockInput.value = productToEdit.currentStock;
        minStockInput.value = productToEdit.minStock;
        costPriceInput.value = productToEdit.costPrice;
        sellPriceInput.value = productToEdit.sellPrice;

        productFormButton.textContent = "Update Product";
    }

    addProductForm.appendChild(SkuInputLabel);
    addProductForm.appendChild(SkuInput);
    addProductForm.appendChild(productNameInputLabel);
    addProductForm.appendChild(productNameInput);
    addProductForm.appendChild(categoriesLabel);
    addProductForm.appendChild(categoryInput);
    addProductForm.appendChild(supplierInputLabel);
    addProductForm.appendChild(supplierInput);
    addProductForm.appendChild(stockInputLabel);
    addProductForm.appendChild(stockInput);
    addProductForm.appendChild(minStockInputLabel);
    addProductForm.appendChild(minStockInput);
    addProductForm.appendChild(costPriceInputLabel);
    addProductForm.appendChild(costPriceInput);
    addProductForm.appendChild(sellPriceInputLabel);
    addProductForm.appendChild(sellPriceInput);
    addProductForm.appendChild(productFormButton);

    productFormContainer.appendChild(addProductForm);

    addProductForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const skuValue = SkuInput.value;
        const productNameValue = productNameInput.value;
        const categoryValue = categoryInput.value;
        const supplierValue = supplierInput.value;
        const currentStockValue = stockInput.value;
        const minStockValue = minStockInput.value;
        const costPriceValue = costPriceInput.value;
        const sellPriceValue = sellPriceInput.value;

        const productData = {
            sku: skuValue,
            name: productNameValue,
            category: categoryValue,
            supplier: supplierValue,
            currentStock: currentStockValue,
            minStock: minStockValue,
            costPrice: costPriceValue,
            sellPrice: sellPriceValue
        };

        if (productToEdit) {
            Object.assign(productToEdit, productData);
        } else {
        const product = {
            id: Date.now(),
            ...productData
        }

            products.push(product);
        }

        saveProducts();
        updateCounters();
        applyFilters();
        renderStockByCategoryChart();
        renderStockHealthChart();

        addProductForm.innerHTML = "";
        productFormContainer.classList.remove("active");
    })
};  
addProductButton.addEventListener("click", function(event) {
    event.preventDefault()

    productFormContainer.classList.add("active")
    renderForm();
})

function renderProducts(list) {
    stockList.innerHTML = "";

    list.forEach(function(product) {
        renderProduct(product);
    })
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function renderProduct(product) {
    const productCard = document.createElement("tr");
    productCard.className = "product-card";
    productCard.dataset.id = product.id;

    const productSku = document.createElement("td");
    productSku.textContent = product.sku;
    productSku.id = "SKU"

    const productName = document.createElement("td");
    productName.textContent = product.name;

    const matchingCategory = categories.find(function(category) {
        return category.value === product.category;
    })

    const productCategory = document.createElement("td");

    const productCategorySpan = document.createElement("span");
    productCategorySpan.textContent = matchingCategory.text;
    productCategorySpan.className = ("category-span");

    const productSupplier = document.createElement("td");
    productSupplier.textContent = product.supplier;

    const productStock = document.createElement("td");
    productStock.textContent = product.currentStock;

    const productMinStock = document.createElement("td");
    productMinStock.textContent = product.minStock;


    const productStatus = document.createElement("td");

    const productStatusContainer = document.createElement("div");
    productStatusContainer.className = ("product-status");

    const statusSpan = document.createElement("span")

    if (Number(product.currentStock == 0)) {
        statusSpan.textContent = "No Stock";
        productStatusContainer.classList.add("no-stock");
    } else if (Number(product.currentStock) <= Number(product.minStock)) {
        statusSpan.textContent = "Low Stock";
        productStatusContainer.classList.add("low-stock");
    } else {
        statusSpan.textContent = "In Stock";
        productStatusContainer.classList.add("in-stock");
    }

    const productStatusIcon = document.createElement("i");
    productStatusIcon.className = ("fa-solid fa-circle")

    const productCostPrice = document.createElement("td");
    productCostPrice.textContent = "£" + product.costPrice;

    const productSellPrice = document.createElement("td");
    productSellPrice.textContent = "£" + product.sellPrice;

    const productMargin = document.createElement("td");

    const priceDifference = product.sellPrice - product.costPrice;
    const margin = priceDifference / product.sellPrice;

    if (margin <= 0) {
        productMargin.className = ("negative-margin");
    } else {
        productMargin.className = ("positive-margin");
    }

    productMargin.textContent = Math.round(margin * 100) + "%";

    const productButtonsTd = document.createElement("td");
    productButtonsTd.className = ("td-buttons");

    const editButton = document.createElement("button");
    editButton.className = ("edit-button");

    const editButtonIcon = document.createElement("i");
    editButtonIcon.className = ("fa-solid fa-pencil");

    const removeButton = document.createElement("button");
    removeButton.className = ("remove-button");

    const removeButtonIcon = document.createElement("i")
    removeButtonIcon.className = ("fa-solid fa-trash-can");

    productCard.appendChild(productSku);
    productCard.appendChild(productName);

    productCategory.appendChild(productCategorySpan);

    productCard.appendChild(productCategory);
    productCard.appendChild(productSupplier);
    productCard.appendChild(productStock);
    productCard.appendChild(productMinStock);

    productStatusContainer.appendChild(productStatusIcon);
    productStatusContainer.appendChild(statusSpan);

    productStatus.appendChild(productStatusContainer);

    productCard.appendChild(productStatus);
    productCard.appendChild(productCostPrice);
    productCard.appendChild(productSellPrice);
    productCard.appendChild(productMargin);

    editButton.appendChild(editButtonIcon);
    removeButton.appendChild(removeButtonIcon);

    productButtonsTd.appendChild(editButton);
    productButtonsTd.appendChild(removeButton);

    productCard.appendChild(productButtonsTd);

    stockList.appendChild(productCard);

    productCategorySpan.classList.add(matchingCategory.value)
}

stockList.addEventListener("click", function(event) {
    const clickedEditButton = event.target.closest(".edit-button")

    if(!clickedEditButton) {
        return;
    }

    const productCard = clickedEditButton.closest(".product-card")
    const productId = Number(productCard.dataset.id)

    const productToEdit = products.find(function (product) {
        return product.id === productId;
    })

    if (!productToEdit) {
        return;
    }

    editingId = productId;

    productFormContainer.classList.add("active");

    renderForm(productToEdit);
})

stockList.addEventListener("click", function(event) {
    const productToRemove = event.target.closest(".remove-button")

    if (!productToRemove) {
        return;
    }

    const productCard = productToRemove.closest(".product-card")
    const productId = Number(productCard.dataset.id)

    products = products.filter(function (product) {
        return product.id !== productId;
    });

    saveProducts();
    updateCounters();
    applyFilters();
    renderStockByCategoryChart();
    renderStockHealthChart();
})

function updateCounters() {
    totalProductsCounter.textContent = products.length; 

    const productCategories = products.map(function(product) {
        return product.category;
    })

    const uniqueCategories = productCategories.filter(function(category, index) {
        return productCategories.indexOf(category) === index;
    })

    totalCategoriesCounter.textContent = uniqueCategories.length;

    const totalStock = products.reduce(function(total, product) {
        return total + Number(product.currentStock);
    }, 0);

    totalStockCounter.textContent = totalStock;

    const totalValue = products.reduce(function(total,product){
        return total + Number(product.currentStock) * Number(product.costPrice);
    }, 0);

    inventoryValueCounter.textContent = "£" + totalValue;

    const lowStock = products.filter(function(product) {
        if (Number(product.currentStock) <= Number(product.minStock)) {
            return product;
        }
    })

    if (lowStock.length >= 1) {
        stockWarningContainer.classList.add("active")
    } else {
        stockWarningContainer.classList.remove("active")
    }

    stockWarningNumber.textContent = lowStock.length;
}

stockSearchInput.addEventListener("input", function () {
    currentPage = 1;
    applyFilters();
})

function applyFilters() {
    let filteredProducts = [...products];

    const searchValue = stockSearchInput.value.toLowerCase();

    filteredProducts = filteredProducts.filter(function(product) {
        if (product.name.toLowerCase().includes(searchValue)) {
            return product;
        } else if (product.sku.toLowerCase().includes(searchValue)) {
            return product;
        } else if (product.supplier.toLowerCase().includes(searchValue)) {
            return product;
        }
    });

    const categoryValue = categoriesSelect.value

    filteredProducts = filteredProducts.filter(function(product) {
        if (categoryValue === "all") {
            return true;
        } else if (product.category === categoryValue) {
            return product;
        }
    });

    const selectedStockLevel = stockLevelSelect.value

    filteredProducts = filteredProducts.filter(function(product){
        if(selectedStockLevel === "allStock") {
            return true;
        } else if (selectedStockLevel === "noStock") {
            return Number(product.currentStock) === 0;
        } else if (selectedStockLevel === "lowStock") {
            return Number(product.currentStock) > 0 &&
            Number(product.currentStock) <= Number(product.minStock);
        } else if (selectedStockLevel === "inStock") {
            return Number(product.currentStock) >  Number(product.minStock);
        }
    });

    const sortValue = sortBySelect.value

    if (sortValue === "costPriceLtoH") {
        filteredProducts.sort(function(productA, productB) {
        return productA.costPrice - productB.costPrice;
    });
    } else if (sortValue === "costPriceHtoL") {
        filteredProducts.sort(function(productA, productB) {
        return productB.costPrice - productA.costPrice;
    });
    } else if (sortValue === "marginLtoH") {
        filteredProducts.sort(function(productA, productB) {
        const priceDifferenceA = productA.sellPrice - productA.costPrice;
        const marginA = priceDifferenceA / productA.sellPrice;

        const priceDifferenceB = productB.sellPrice - productB.costPrice;
        const marginB = priceDifferenceB / productB.sellPrice;

        return marginA - marginB;
    });
    } else if (sortValue === "marginHtoL") {
        filteredProducts.sort(function(productA, productB) {
        const priceDifferenceA = productA.sellPrice - productA.costPrice;
        const marginA = priceDifferenceA / productA.sellPrice;

        const priceDifferenceB = productB.sellPrice - productB.costPrice;
        const marginB = priceDifferenceB / productB.sellPrice;

        return marginB - marginA;
    });
    }

    const rowsPerPage = rowsPerPageCount.value;

    const rowsNumber = Number(rowsPerPage);

    totalPages = Math.ceil(filteredProducts.length / rowsNumber);

    if (currentPage > totalPages) {
    currentPage = Math.max(totalPages, 1);
    }

    const start = (currentPage - 1) * rowsNumber;
    const end = start + rowsNumber;

    const pageProducts = filteredProducts.slice(start, end)

    underBarProductCount.textContent = Number(start + 1) + " " + "to" + " " + Number(start + pageProducts.length) + " " + "of" + " " + filteredProducts.length;

    pageNumbersCount.innerHTML = "";

    function createPageButton(page) {
        const pageButton = document.createElement("button");
        pageButton.className = "page-number"

        const pageButtonNumber = document.createElement("span");
        pageButtonNumber.textContent = Number(page);

        pageButton.appendChild(pageButtonNumber);

        if (page === currentPage) {
                pageButton.classList.add("active");
            }

        pageNumbersCount.appendChild(pageButton);

        pageButton.addEventListener("click", function() {
            currentPage = page;
            applyFilters();

            scrollToProducts();
        });
    }

    if (totalPages <= 3) {
        for (let page = 1; page <= totalPages; page++) {
            createPageButton(page);
        }
    } else if (currentPage <= 3) {
        for (let page = 1; page <= 3; page++) {
            createPageButton(page);
        }

        createEllipsis();

        createPageButton(totalPages);
    } else if (currentPage >= totalPages - 2) {
            createPageButton(1);
            createEllipsis();

            for (let page = totalPages - 2; page <= totalPages; page++) {
                createPageButton(page)
            }
        } else {
            createPageButton(1);

            createEllipsis();

            for (let page = currentPage - 1; page <= currentPage + 1; page++) {
                createPageButton(page);
            }

            createEllipsis();

            createPageButton(totalPages);
        }

    renderProducts(pageProducts);
}

categoriesSelect.addEventListener("change", function() {
    currentPage = 1;
    applyFilters();
})

stockLevelSelect.addEventListener("change", function() {
    currentPage = 1;
    applyFilters();
})

sortBySelect.addEventListener("change", function(){
    currentPage = 1;
    applyFilters();
})

clearFilterButton.addEventListener("click", function() {
    currentPage = 1;
    stockSearchInput.value = "";
    categoriesSelect.value = "all";
    stockLevelSelect.value = "allStock";
    sortBySelect.value = "";

    applyFilters();
}) 

viewLowStockButton.addEventListener("click", function() {
    stockLevelSelect.value = "lowStock";

    currentPage = 1;

    applyFilters();
})

rowsPerPageCount.addEventListener("change", function() {
    currentPage = 1;

    pageNumbersCount.innerHTML = ""

    applyFilters();
})

previousPageButton.addEventListener("click", function() {
    if (currentPage > 1) {
        currentPage--;
        applyFilters();

        scrollToProducts();
    }
});

nextPageButton.addEventListener("click", function() {
    if (currentPage < totalPages) {
        currentPage++;
        applyFilters();

        scrollToProducts();
    }
})

function generateTestProducts() {
    const categories = [
        "dogFood",
        "catFood",
        "treats",
        "toys",
        "bedding",
        "collarsLeads",
        "grooming",
        "accesories"
    ];

    const suppliers = [
        "Pet Foods UK",
        "Animal Supplies Ltd",
        "Happy Pets Wholesale",
        "Paws Distribution"
    ];

    for (let i = 1; i <= 40; i++) {

        const product = {
            id: Date.now() + i,
            sku: "TEST" + String(i).padStart(3, "0"),
            name: "Test Product " + i,

            category: categories[(i - 1) % categories.length],
            supplier: suppliers[(i - 1) % suppliers.length],

            currentStock: (i * 3) % 25,
            minStock: 8,

            costPrice: Number((2 + (i % 15) * 0.75).toFixed(2)),
            sellPrice: Number((5 + (i % 15) * 1.25).toFixed(2))
        };

        products.push(product);
    }

    saveProducts();
    applyFilters();
    updateCounters();
}

//generateTestProducts();

function createEllipsis() {
    const ellipsis = document.createElement("span");
    ellipsis.textContent = "...";
    ellipsis.className = "page-ellipsis";

    pageNumbersCount.appendChild(ellipsis);
}

function scrollToProducts() {
    stockList.scrollIntoView({
        behavior: "smooth",
        block: "start"
    })
}

function getStockByCategory() {
    const categoryStock = {
        dogFood: 0,
        catFood: 0,
        treats: 0,
        toys: 0,
        bedding: 0,
        collarsLeads: 0,
        grooming: 0,
        accesories: 0
    }

    products.forEach(function(product) {
        categoryStock[product.category] += Number(product.currentStock);
    });

    return categoryStock;
}

function renderStockByCategoryChart() {
    const categoryStock = getStockByCategory();

    const categoryLabels = Object.keys(categoryStock);
    const categoryValues = Object.values(categoryStock);

    const displayLabels = categoryLabels.map(function(categoryLabel) {
        const foundCategory = categories.find(function(category) {
            return category.value === categoryLabel;
        })

        return foundCategory.text;
    })

    if (stockCategoryChartInstance === null) {

    stockCategoryChartInstance = new Chart(stockCategoryChart, {

    type: "bar",

    data: {
        labels: displayLabels,
        datasets: [
            {
                label: "Stock Units",
                data: categoryValues,
                backgroundColor: "#2f6846",
                borderRadius: 4,
                barThickness: 14
            }
        ]
    },

    options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Stock Units"
                },
                grid: {
                    color: "#eeeeee"
                },
                border: {
                    display: false
                }
            },

            y: {
                ticks: {
                    crossAlign: "far",
                    color: "#222222",
                    
                    font: {
                        weight: "500"
                    }
                },
                grid: {
                    display: false
                },
                border: {
                    display: false
                }
            }
        }
    }
});

    } else {
        stockCategoryChartInstance.data.labels = displayLabels;

        stockCategoryChartInstance.data.datasets[0].data = categoryValues;

        stockCategoryChartInstance.update();
    }
}


function getStockHealthValues() {
    const stockHealth = {
        lowStock: 0,
        noStock: 0,
        inStock: 0,
    }

    products.forEach(function(product){
        if (Number(product.currentStock == 0)) {
            stockHealth.noStock++;
        } else if (Number(product.currentStock) <= Number(product.minStock)) {
            stockHealth.lowStock++;
        } else {
            stockHealth.inStock++;
        }
    })

    const healthInStock = document.getElementById("health-inStock-value")
    const healthLowStock = document.getElementById("health-lowStock-value")
    const healthNoStock = document.getElementById("health-noStock-value")

    healthInStock.textContent = stockHealth.inStock;
    healthLowStock.textContent = stockHealth.lowStock;
    healthNoStock.textContent = stockHealth.noStock;

    lowStockCounter.textContent = stockHealth.lowStock;

    return stockHealth;
}

function renderStockHealthChart() {
    const currentStockHealth = getStockHealthValues();

    const stockHealthLabels = Object.keys(currentStockHealth);
    const stockHealthValues = Object.values(currentStockHealth);

    const displayLabels = stockHealthLabels.map(function(stockHealthLabel){
        const foundStatus = statuses.find(function(status) {
            return status.value === stockHealthLabel;
        });

        return foundStatus.text;
    })

    if (stockHealthChartInstance === null) {
    
    stockHealthChartInstance = new Chart(stockHealthChart, {

        type: "doughnut",

        data: {
            labels: displayLabels,

            datasets: [
                {
                    data: stockHealthValues,
                    backgroundColor: [
                        "#FFBF00",
                        "red",
                        "green"
                    ]
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            legend: {
                display: false
            }
        },
            cutout: "67%"
        }
    })
} else {
    stockHealthChartInstance.data.labels = displayLabels;
    stockHealthChartInstance.data.datasets[0].data = stockHealthValues;
    stockHealthChartInstance.update();
}
}




