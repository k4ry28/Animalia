
// Importar librerías 
const express = require('express'),
      fs = require('fs'),
      matter = require('gray-matter'),      // ayuda a leer encabezado para agregar info extra de archivos md
// app sera un objeto q tenga todos los metodos de la libreria express:
      app = express(),
// definición de puerto:      
      port = 3000,
// ruta de directorio actual
      dirname = __dirname;

// Motor de plantillas
app.set('view engine', 'ejs');

// Definir carpeta de archivos estáticos
app.use(express.static(__dirname + '/public'));
// Analiza los cuerpos de solicitudes entrantes y transforma la entrada en variables accesibles con JS, este puede tener valores de cualquier tipo
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Direccionamientos
// req = request (peticion) ; res = response (respuesta)
app.get('/blog', (req, res) => {    
    // Leer directorio y listar los archivos en un array
    const posts = fs.readdirSync(dirname + '/blog_post').filter(file => file.endsWith('.md'));    
    
    // Pasar a la plantilla index.ejs el array con los nombres de los archivos md, el objeto matter y dirname
    res.render("index", {
        posts: posts,
        matter: matter,
        dirname: dirname
    });
});

app.get('/blog/:article', (req, res) => {  
    // Leer el archivo markdown con gray-matter:
    const file = matter.read(dirname + '/blog_post/' + req.params.article + '.md');

    // Convertir contenido a html con markdown-it:
    var md = require('markdown-it')({
        html:true,
        linkify:true
    });
    let content = file.content;
    var result = md.render(content);

    // Pasar a la plantilla post.ejs el contenido formateado a html del archivo md, el titulo y descripcion
    res.render("post", {
        post: result,
        title: file.data.title,
        description: file.data.description
    })
});

// Levantar servidor en puerto especificado
app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`)
});