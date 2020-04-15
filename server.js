const express = require('express');
const Pool = require('pg').Pool;
const nunjucks = require('nunjucks');

const app = express();

const db = new Pool({
    user: 'postgres',
    password: 'jones666',
    host: 'localhost',
    port: 5432,
    database: 'doe'
});

app.use(express.static('public')); /* arquivos estaticos estao nessa pasta (scripts,css,imagens)*/ 
nunjucks.configure('./', {
    express: app,
    noCache: true
});

app.use(express.urlencoded({ extended: true })); // habilitar o body na req 

app.get('/', (req, res) =>{
    const query = `select * from donors`;

    
    db.query(query, (err, result) =>{
        if(err) return res.send('Erro no banco de dados');

        const donors = result.rows;
        return res.render('index.html', {donors});

    });

    
});

app.post('/', (req, res)=>{
    const { name, email, blood }= req.body;
    const query = `insert into donors ("name", "email", "blood") values ($1, $2, $3)`;
    const values = [name,email,blood];

    if(name ===""|| email ==="" || blood === "") return res.send('Preencha todos os campos!')
    db.query(query, values, (err) =>{
        if(err) return res.send('Erro no banco de dados');
        return res.redirect('/');
    })

   

})



app.listen(3000, ()=>{
    console.log('Servidor iniciado');
});