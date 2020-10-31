//This script hashes all passwords generated by Mokaroo y saves them into a new file
const path = require('path'),
      fs = require('fs'),
      bcrypt = require('bcryptjs'),
      hash = bcrypt.genSaltSync(10)
      ;
 
function hashPasswords(url){
    let data = fs.readFileSync(path.join(__dirname,url),'utf-8');
    let users = JSON.parse(data);
    for(let user of users){
        let newPassword = bcrypt.hashSync(user.password,hash);
        user.password = newPassword;
    }
    fs.writeFileSync(
        path.join(__dirname,'users.json'),
        JSON.stringify(users,null,2)
        );
}
// hashPasswords('users1.json');

//this function generates a .sql script that populates users table from database
function generateScriptForUsers(){
    let data = fs.readFileSync(path.join(__dirname,'users.json'),'utf-8');
    let users = JSON.parse(data);
    let query = "use dist_saludable;\ninsert into users (first_name,last_name,email,password) values \n";
    for(let user of users){
        query +=`('${user.first_name}','${user.last_name}','${user.email}','${user.password}'),\n`
    }
    fs.writeFileSync(
        path.join(__dirname,'add_users.sql'),
        query
        );
}
// generateScriptForUsers();

//this function generates a .sql file to pupulate 'categories' table
function generateScriptForCategories(){
    let dataCategories = fs.readFileSync(path.join(__dirname,'categories.json'),'utf-8');
    let categories = JSON.parse(dataCategories);
    let query = "use dist_saludable;\ninsert into categories (id,name) values \n";
    let id=1;
    for(let category of categories){
        query+=`(${id},'${category.name}'),\n`;
        id++;
    }
    fs.writeFileSync(
        path.join(__dirname,'add_categories.sql'),
        query
        );
}
// generateScriptForCategories();

function generateScriptForProducts(){
    //primero creo un array con un objeto para cada categoria
    let dataCategories = fs.readFileSync(path.join(__dirname,'categories.json'),'utf-8');
    let categories = JSON.parse(dataCategories);
    let categoriesDB = [];
    let i=1;
    for(let category of categories){
        let newCategory = { id:i, name: category.name, code:category.id};
        categoriesDB.push(newCategory);
        i++;
    }

    //read products JSON file and parse to js obejcts
    let dataProducts = fs.readFileSync(path.join(__dirname,'products.json'),'utf-8');
    let products =JSON.parse(dataProducts);
    let queryProducts = 'use dist_saludable;\n insert into products (id,name,image,category_id) values\n';
    let queryVariants = 'use dist_saludable;\n insert into variants (product_id,name,price,stock) values\n';
    //create new object for each distinct product
    let lastAddedProduct='';
    let newProduct = {
        id:null,
        name:null,
        image:null,
        category_id:null
    }
    
    let id = 500;
    for(let product of products){

        if(product.id != lastAddedProduct){
            id++
            lastAddedProduct=product.id
            newProduct.id=id;
            newProduct.name=product.producto;
            newProduct.image=product.img;
            for(let category of categoriesDB){
                if(category.code == product.id.slice(0,3).toLowerCase()){
                    newProduct.category_id=category.id;
                    break
                }
            }
            queryProducts += `( ${id},'${newProduct.name}','${newProduct.image}', ${newProduct.category_id} ),\n`
        }

        queryVariants += `( ${id},'${product.variante}',${parseInt(product.precio)},${10}),\n`

    }
    fs.writeFileSync(
        path.join(__dirname,'add_products.sql'),
        queryProducts
        );
    fs.writeFileSync(
        path.join(__dirname,'add_variants.sql'),
        queryVariants
        );
    // console.log('added products: '+addedProducts.length)
}
generateScriptForProducts()