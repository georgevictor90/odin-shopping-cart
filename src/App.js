import "./App.css";
import React from "react";
import RouteSwitch from "./components/RouteSwitch";
import { getAllCategoriesFromApi, getAllProductsFromApi } from "./api";

const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];

function App() {
  const [allProducts, setAllProducts] = React.useState([]);
  const [allCategories, setAllCategories] = React.useState([]);
  const [displayedProducts, setDisplayedProducts] = React.useState([]);
  const [cart, setCart] = React.useState(cartFromLocalStorage);
  const [cartCounter, setCartCounter] = React.useState(0);

  React.useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  React.useEffect(() => {
    getAllProductsFromApi().then((data) => setAllProducts(data));
  }, []);

  React.useEffect(() => {
    getAllCategoriesFromApi().then((json) =>
      setAllCategories(
        json.map((categ) => {
          return {
            category: categ,
            checked: true,
          };
        })
      )
    );
  }, []);

  React.useEffect(() => {
    setDisplayedProducts(allProducts);
  }, [allProducts]);

  React.useEffect(() => {
    let count = 0;
    if (cart.length) {
      cart.forEach((item) => {
        count = count + item.quantity;
      });
    }
    setCartCounter(count);
  }, [cart]);

  function selectCategory(e) {
    setDisplayedProducts(
      allProducts.filter((prod) => prod.category === e.target.id)
    );
  }

  function showAllProducts() {
    setDisplayedProducts(allProducts);
  }

  function sortPriceAscending() {
    const sorted = [...displayedProducts].sort((a, b) =>
      Number(a.price) > Number(b.price) ? 1 : -1
    );
    setDisplayedProducts(sorted);
  }

  function sortPriceDescending() {
    const sorted = [...displayedProducts].sort((a, b) =>
      Number(a.price) < Number(b.price) ? 1 : -1
    );
    setDisplayedProducts(sorted);
  }

  function addToCart(e) {
    const productId = e.target.parentNode.parentNode.id;

    let updatedCart = [...cart];

    const selectedProduct = displayedProducts.find(
      (prod) => prod.id.toString() === productId
    );

    const found = cart.find((item) => item.id.toString() === productId);

    // console.log();

    if (found) {
      // console.log("already in cart");
      updatedCart = updatedCart.map((item) => {
        return item.id === selectedProduct.id
          ? { ...item, quantity: item.quantity + 1 }
          : item;
      });
    } else {
      updatedCart.push({ ...selectedProduct, quantity: 1 });
    }
    setCart(updatedCart);
  }

  return (
    <div className="App">
      <RouteSwitch
        addToCart={addToCart}
        cart={cart}
        setCart={setCart}
        cartCounter={cartCounter}
        displayedProducts={displayedProducts}
        allCategories={allCategories}
        handleClick={selectCategory}
        showAllProducts={showAllProducts}
        sortPriceAscending={sortPriceAscending}
        sortPriceDescending={sortPriceDescending}
      />
    </div>
  );
}

export default App;
