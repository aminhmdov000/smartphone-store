//IMPORT DATABASE CONNECTION POOL
const db = require('../config/db');
//CONTROLLER FUNCTION TO GET ALL PRODUCTS FROM TE DATABAE
exports.getAllProducts = async(req,res,next) => {
    try {

        //EXECUTE A SQL QUERY TO SELECT ALL PRODUCTS FROM DATABASE
        const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
        return res.status(200).json(products);
    } catch (error) {
       next(error);
    }
};
// get all products by slug
exports.getProductsBySlug = async(req,res,next) => {
    const {slug} = req.params; // get product id from url parameter
    try {
        const [product] = await db.execute(`SELECT * FROM products WHERE slug=?`, [slug]); // execute query to get product by slug
        if(product.length === 0) return res.status(404).json({error: 'Product not found!'});
        return res.status(200).json(product[0]);
    } catch (error) {
        next(error);
    }
};

//create products by id(admin)
exports.createProduct = async(req,res,next) => {
    try {
        const image_url = req.file ? req.file.filename : (req.body.image_url || null);
        const {name,slug,brand,price,stock,description,screen_size,ram,storage,camera,battery} = req.body;
        const [products] = await db.query(`INSERT INTO products
            (name,slug,brand,price,image_url,stock,description,screen_size,ram,storage,camera,battery)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`,
            [name,slug,brand,price,image_url,stock,description,screen_size,ram,storage,camera,battery]
        );
        return res.status(201).json({success: 'Product created', productID: products.insertId});
    } catch (error) {
       next(error)
    }
};

// update product by id(admin)
exports.updateProduct = async(req,res,next) => {
    const {id: productID} = req.params; // get product id from url parametre
    const {name,slug,brand,price,stock,description,screen_size,ram,storage,camera,battery, image_url: currentImage} = req.body;
    const image_url = req.file ? req.file.filename : currentImage || null;
    try {
        const [updated] = await db.query(`UPDATE products SET name=?, slug=?, brand=?, price=?, image_url=?, stock=?, description=?, screen_size=?, ram=?, storage=?, camera=?, battery=? WHERE id=?`,
            [name,slug,brand,price,image_url,stock,description,screen_size,ram,storage,camera,battery,productID]
        );
        if(updated.affectedRows === 0) return res.status(404).json({error: 'Product not found!'});
        return res.status(200).json({success: 'Product updated!'});
    } catch (error) {
      next(error)
    }
};

//delete product by id(admin)
exports.deleteProduct = async(req,res,next) => {
    try{
        const {id: productID} = req.params; // get product id from url parametre 
        const [deleted] = await db.query(`DELETE FROM products WHERE id=?`, [productID]);
        if(deleted.affectedRows === 0) return res.status(404).json({error: `Product not found with ID ${productID}`});
        return res.status(200).json({success: 'Product deleted!'});
    } catch(error){
        next(error)
    }
};

// get all products by pagination and filters
exports.getProducts = async(req,res,next) => {
    const page = parseInt(req.query.page) || 1; // get page number from query parameter
    const limit = parseInt(req.query.limit) || 10; // get limit query parameter
    const offset = (page - 1) * limit; // calculate offset for pagination
    const {search,brand, minPrice, maxPrice, kind} = req.query; // get filter query parameters
    try {
        let query = `SELECT * FROM products WHERE 1=1`; // base query to select products, we will append filters to this query
        let countQuery = `SELECT COUNT(*) as total FROM products WHERE 1=1`; // base query to count total products, we will append same filters to this query to get correct count
        let filters = ""; // we will build filters string based on which filters are provided in query parameters
        let values = []; // we will store values for prepared statement in this array, this help prevent SQL injection attacks by separating query structure from data
        if(search){
            filters += ` AND (name LIKE ? OR description LIKE ?)`
            // We add % so it matches "search" anywhere in the text
            const searchPattern = `%${search}%`
            values.push(searchPattern,searchPattern) // we push search pattern twice because we have two placeholders in the query (one for name and one for description)
        }
        // we check if brand filter is provided, if yes we add it to filters string and also push the value to values array for prepared statement
        if(brand){
            filters += ` AND brand=?`
            values.push(brand)
        } // we check if minPrice filter is provided, if yes we add it to filters string and also push the value to values array for prepared statement
        if(minPrice){
            filters += ` AND price>=?`
            values.push(minPrice)
        } // we check if maxPrice filter is provided, if yes we add it to filters string and also push the value to values array for prepared statement
        if(maxPrice){
            filters += ` AND price<=?`
            values.push(maxPrice)
        }
        query += filters // we append filters to our base query to get the final query with all filters applied
        countQuery += filters // we also append same filters to count query to get correct count of products based on applied filters
        // we check if kind parameter is provided for sorting, if yes we append appropriate ORDER BY clause to our query based on the value of kind parameter
        if(kind === 'price_desc'){
            query += ` ORDER BY price DESC`
        } else if(kind === 'price_asc'){
            query += ` ORDER BY price ASC`
        } else {
            query += ` ORDER BY created_at DESC`
        }
        //pagination
        query += ` LIMIT ? OFFSET ?`
        //execute count
        const [totalResult] = await db.execute(countQuery, values)
        const totalProduct = totalResult[0].total
        //execute data fetch
        const [products] = await db.execute(query, [...values, limit, offset])
        // we return the products along with pagination info like total count, total pages and current page number 
        return res.status(200).json({
            success: true,
            totalCount: totalProduct,
            totalPages: Math.ceil(totalProduct / limit),
            currentPage: page,
            data: products
        })

    } catch (error) {
        next(error)
    } 
};

