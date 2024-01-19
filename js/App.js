const addCourse = document.querySelector('#add-course');
const showNotification = document.querySelector('#show-notification');

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

const addNewCourse = () => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(sw => {
            const newCourse = {
                id: 4,
                title: 'Next Expert'
            }
    
            db.syncCourses.put(newCourse)
                .then(data => console.log(data, 'new Course Insert SuccessFully'))
                .catch(err => console.log(err))

            return sw.sync.register('add-new-course')
                .then(() => console.log('task add successfully'))
                .catch(err => console.log(err))
        })
    } else {
        console.log('not support');
    }
}

const showNotfication = async () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(sw => {
            sw.showNotification('welcome to shopping', {
                body: 'please add new course',
                vibrate: [100, 50, 200],
                icon: '/assets/Images/logo.svg',
                badge: '/assets/Images/logo.svg',
                image: '/assets/Images/logo.svg',
                tag: 'test-notfication',
                actions: [
                    { action: 'confirm', title: 'Reply' },
                    { action: 'cancel', title: 'Like ❤️' }
                ]
            })
        })
    }
}

const getNotficationPermission = async () => {
    const result = await Notification.requestPermission();

    if (result === 'granted') {
        showNotfication();
        console.log('permission granted');
    } else if (result === 'denied') {
        console.log('permission denied');
    }
}

addCourse.addEventListener('click', () => addNewCourse());
showNotification.addEventListener('click', () => getNotficationPermission());

document.addEventListener('DOMContentLoaded', async () => {
    const products = await getProducts();
    generateProduct(products);
})