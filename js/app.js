(function() {
    const listado = document.getElementById('listado-clientes');
    let DB;
    document.addEventListener('DOMContentLoaded', () => { 
        crearDB()
        window.indexedDB.open('crm', 1)? obtenerClientes() : null
        listado.addEventListener('click', eliminar)
    })

    function eliminar(e) {
        if (e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.cliente);
            const transaction = DB.transaction(['crm'], 'readwrite').objectStore('crm').delete(idEliminar);
            e.target.parentElement.parentElement.remove();
        }
    }
    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = () => { 
            console.log('hay un error');    
        }
        crearDB.onsuccess = () => { 
           DB = crearDB.result; 
        }
        crearDB.onupgradeneeded = (e) => {
            const db = e.target.result 
            const objectStore = db.createObjectStore('crm', {keyPath:'id', autoIncrement: true })
            
            objectStore.createIndex('nombre', 'nombre', {unique: false})
            objectStore.createIndex('email', 'email', {unique: false})
            objectStore.createIndex('telefono', 'telefono', {unique: false})
            objectStore.createIndex('empresa', 'empresa', {unique: false})
            objectStore.createIndex('id', 'id', {unique: true})
        }
    }
    function obtenerClientes() {
        const abrir = window.indexedDB.open('crm', 1);
        abrir.onerror = () => { console.log('hubo un error'); }
        abrir.onsuccess = () => { 
            DB = abrir.result 
            const objectStore = DB.transaction('crm').objectStore('crm');
            objectStore.openCursor().onsuccess = function(e) {
                const cursor =  e.target.result;

                if (cursor) {
                    const {nombre,email,telefono,empresa,id} = cursor.value;
                    
                    listado.innerHTML +=` <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>
                `;
                    cursor.continue();
                }
            } 
        }
        
    }
})();