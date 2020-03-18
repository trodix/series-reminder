const socket = io.connect('http://localhost:5000');
const publicVapidKey = 'BI0swuR9NOxOG_ABmFJ8J3526CMVYT5N2db1m9-sQepLNBB-CltDAhskzpKvYCRtfRvWlizwhsvHfYYkPQ0yCt4';
const subscribeBtn = document.querySelector('#subscribe');


subscribeBtn.addEventListener('click', (e) => {
    if ('serviceWorker' in navigator) {
        console.log('subscription handled');
        subscribe().then(subscription => {
            socket.emit('subscribe', subscription);
        });
    } else {
        console.error('can not subscribe, service worker is not availlable.')
    }
});

async function subscribe() {
    const register = await navigator.serviceWorker.register('./js/worker.js', {
        scope: '/js/'
    });
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    return subscription;
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
   
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
   
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}