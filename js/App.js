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

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const showNotfication = async () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(sw => {
            sw.showNotification('مرسی که اعتماد کردی', {
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

const getPushSubscription = async () => {
    if ('serviceWorker' in navigator) {
        const sw = await navigator.serviceWorker.ready;
        const pushSubscription = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BMOltQK6AZYhVwLNMjMknBnmnQfGY94gXU3NUHqBZVDC2XFbK_1azXgHI7W9lRbOqmd8BNidm87_qpYvpOo4ExU')
        });

        return pushSubscription;
    }
}

const getCurrentPushNotification = async () => {
    const sw = await navigator.serviceWorker.ready;
    const currentPushSubscription = await sw.pushManager.getSubscription();
    return currentPushSubscription;
}

const getNotficationPermission = async () => {
    const result = await Notification.requestPermission();

    if (result === 'granted') {
        showNotfication();
        const currentPushNotification = await getCurrentPushNotification();
        if (!currentPushNotification) {
            getPushSubscription();
        }
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