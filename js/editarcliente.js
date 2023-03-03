
    const nombreIm = document.getElementById('nombre')
    const emailIm = document.getElementById('email')
    const telefonoIm = document.getElementById('telefono')
    const empresaIm = document.getElementById('empresa')
    const formulario = document.getElementById('formulario')
    let DB;
    let parametroURL;
    document.addEventListener('DOMContentLoaded',() => {  
        conectarDB();
        formulario.addEventListener('submit', actualiza);
        parametroURL = new URLSearchParams(window.location.search).get('id')
        parametroURL ? setTimeout(() => {obtenerCliente(parametroURL);},100) : null
    })
    function actualiza(e) {
        e.preventDefault()
        if (nombreIm.value === '' || emailIm.value === '' || telefonoIm.value === '' || empresaIm.value === '') {
            alerta('todos los campos son obligatorios', 'error');
            return;
        }
        const objActualizado ={
            nombre : nombreIm.value,
            empresa : empresaIm.value,
            telefono : telefonoIm.value,
            email : emailIm.value,
            id : Number(parametroURL)
        }
        // console.log(objActualizado);
        const transaction = DB.transaction(['crm'], 'readwrite')
        const objectStore = transaction.objectStore('crm')
        objectStore.put(objActualizado);

        transaction.oncomplete = function() {  
            window.location.href = 'index.html'
        }
    }
    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readwrite').objectStore('crm')
        transaction.openCursor().onsuccess = (e) => { 
            const cursor = e.target.result;
            if (cursor) {
                if (cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value)
                    // console.log(cursor.value)
                }
                cursor.continue();
            }
        } 
    }
    function llenarFormulario({nombre,email,telefono,empresa,id}) {
        nombreIm.value = nombre
        emailIm.value = email
        empresaIm.value = empresa
        telefonoIm.value = telefono
    }
    function conectarDB() {
        const abrirConeccion = window.indexedDB.open('crm', 1);
        abrirConeccion.onerror=() => { console.log('hay un error'); }
        abrirConeccion.onsuccess=() => { DB = abrirConeccion.result }
    }
