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
    try {
        const res = await fetch('https://pwa-app-24407-default-rtdb.firebaseio.com/courses.json');
        const data = await res.json();
    
        const courses = [];
    
        for (let course in data) {
            courses.push(data[course]);
        };
    
        return courses;
    } catch (error) {
        const data = await db.courses.toArray();
        return data;
    }
}

const generateProduct = (products) => {
    const wrapperProducts = document.querySelector('#wrapper-products');
    
    products.forEach(product => {
        wrapperProducts.insertAdjacentHTML('beforeend', `
            <div class="col">
                <div class="card bg-dark-subtle">
                    <img src="/assets/Images/Nextjs.webp" class="card-img-top" alt="cleanCode">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                    </div>
                </div>
            </div>
        `)
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const products = await getProducts();
    generateProduct(products);
})