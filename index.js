window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'u') {
        window.scrollBy(0, -window.innerHeight/2)
    }
    if (e.ctrlKey && e.key === 'd') {
        window.scrollBy(0, window.innerHeight/2)
    }
}, false);
