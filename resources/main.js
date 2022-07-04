//Nav menu
const ham = document.querySelector('.ham');
const enlances = document.querySelector('.enlaces__menu');
const barras = document.querySelectorAll('.ham span')

ham.addEventListener('click', () => {
    enlances.classList.toggle('activado');
    barras.forEach(child => {
        child.classList.toggle('animado')
    });
});