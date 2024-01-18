// register services worker

if ('serviceWorker' in navigator) {
    console.log("Support");
    navigator.serviceWorker.register('/sw.js').then(register => {
        console.log(register);
    }).catch(err => console.log(err));
} else {
    console.log('Not Support');
};

// main logix

const getProducts = async () => {
    const res = await fetch('https://fakestoreapi.com/products?limit=6');
    const data = await res.json();
    return data
}

const generateProduct = (products) => {
    const wrapperProducts = document.querySelector('#wrapper-products');
    
    products.forEach(product => {
        wrapperProducts.insertAdjacentHTML('beforeend', `
            <div class="col">
                <div class="card bg-dark-subtle">
                    <img src=${product.image} class="card-img-top" alt="cleanCode">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                    </div>
                </div>
            </div>
        `)
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const products = await getProducts();
    generateProduct(products)
})