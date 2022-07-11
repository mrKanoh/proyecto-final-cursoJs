document.addEventListener("DOMContentLoaded", () => {
    fetchData()
})

const fetchData = async () => {
    try {
        const res = await fetch('./resources/products.json')
        const data = await res.json()
        pintarProductos(data)
        detectarBotones(data)
    } catch (error) {
        console.log(error)
    }
}

const contendorProductos = document.querySelector('#contenedor-productos')
const pintarProductos = (data) => {
    const template = document.querySelector('#template-productos').content
    const fragment = document.createDocumentFragment()

    data.forEach(producto => {
        template.querySelector('img').setAttribute('src', producto.imagenItem)
        template.querySelector('h5').textContent = producto.title
        template.querySelector('p span').textContent = producto.precio
        template.querySelector('button').dataset.id = producto.id
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    contendorProductos.appendChild(fragment)
}

let carrito = {}

//Agregar al carrito
const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button')

    botones.forEach(btn => {
        btn.addEventListener('click', () => {

            agregarNotificacion('Producto agregado', 1500);

            const producto = data.find(item => item.id === parseInt(btn.dataset.id))
            producto.cantidad = 1
            if (carrito.hasOwnProperty(producto.id)) {
                producto.cantidad = carrito[producto.id].cantidad + 1
            }
            carrito[producto.id] = { ...producto }

            pintarCarrito()
        })
    })
}

//Notificacion producto agregado
const agregarNotificacion = (mensaje, duracion) => {
    Toastify({
        text: mensaje,
        duration: duracion
    }).showToast();
}

const items = document.querySelector('#items')

const pintarCarrito = () => {

    items.innerHTML = ''

    const template = document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()

    Object.values(carrito).forEach(producto => {
        template.querySelector('th').textContent = producto.id
        template.querySelectorAll('td')[0].textContent = producto.title
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones
        template.querySelector('.btn-info').dataset.id = producto.id
        template.querySelector('.btn-danger').dataset.id = producto.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter()
    accionBotones()

}

const footer = document.querySelector('#footer-carrito')
const pintarFooter = () => {

    footer.innerHTML = ''

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío</th>
        `
        mostrarAlert('Carrito vacío', 1500);
        return
    }

    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)

    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)


    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

}

const accionBotones = () => {
    const botonesAgregar = document.querySelectorAll('#items .btn-info')
    const botonesEliminar = document.querySelectorAll('#items .btn-danger')

    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {
            const producto = carrito[btn.dataset.id]
            producto.cantidad ++
            carrito[btn.dataset.id] = { ...producto }
            pintarCarrito()
        })
    })

    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {

            const producto = carrito[btn.dataset.id]
            producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[btn.dataset.id]
            } else {
                carrito[btn.dataset.id] = { ...producto }
            }
            pintarCarrito()
        })
    })
}

//Alert carrito vacio
const mostrarAlert = (mensaje, duracion) => {
    Swal.fire({
        position: 'top-center',
        icon: 'info',
        title: mensaje,
        showConfirmButton: false,
        timer: duracion
    })
};
