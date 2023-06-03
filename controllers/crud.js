const client = require('../database/db');

exports.save = (req, res) =>{
    const nombreProducto = req.body.nombreProducto;
    const stockDisponible = req.body.stockDisponible;
    const visibilidadProducto = req.body.visibilidadProducto;
    const precioProducto = req.body.precioProducto;
    const descripcionProducto = req.body.descripcionProducto;
    //const categoriaProducto = req.body.categoriaProducto;
    //const imagenProducto = req.body.imagenProducto;


    console.log(nombreProducto)
    console.log(stockDisponible)
    console.log(visibilidadProducto)
    console.log(precioProducto)
    console.log(descripcionProducto)
    //console.log(categoriaProducto)
    //console.log(imagenProducto)

    client.query('INSERT INTO producto (nombre, stock, visibilidad, precio_unitario, descripcion) VALUES ($1, $2, $3, $4, $5)', [nombreProducto, stockDisponible, visibilidadProducto, precioProducto, descripcionProducto], (error, result) => {
        if (error) {
            console.error('Error al insertar el producto:', error);
            // Manejar el error adecuadamente, por ejemplo, enviar una respuesta de error al cliente
        } else {
            console.log('Producto insertado correctamente');
            res.redirect('/homeAdmin');
            // Enviar una respuesta de éxito al cliente si es necesario
        }
    });
}

