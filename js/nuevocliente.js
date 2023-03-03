
    let DB;
    const formulario = document.querySelector('#formulario');
    document.addEventListener('DOMContentLoaded',() => {
        conectarDB();
        formulario.addEventListener('submit', validarCliente)
    })

    
    function validarCliente(e) {
        e.preventDefault()
        const nombre = document.getElementById('nombre').value
        const email = document.getElementById('email').value
        const telefono = document.getElementById('telefono').value
        const empresa = document.getElementById('empresa').value

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            alerta('todos los campos son obligatorios', 'error');
            return;
        }
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now()
        }
        formulario.reset()
        crearCliente(cliente);
    }

    function crearCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite').objectStore('crm').add(cliente);
        alerta('!el cliente ha sido agregado¡')
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    

