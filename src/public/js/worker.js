self.addEventListener('push', e => {
    const data = e.data.json();
    self.registration.showNotification(
        data.title, {
            body: data.body,
            icon: 'https://c7.uihere.com/files/481/820/987/popcorn-film-cinema-movie4k-to-popcorn.jpg'
        }
    );
});