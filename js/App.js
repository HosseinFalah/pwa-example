if ('serviceWorker' in navigator) {
    console.log("Support");
    navigator.serviceWorker.register('/sw.js').then(register => {
        console.log(register);
    }).catch(err => console.log(err));
} else {
    console.log('Not Support');
};