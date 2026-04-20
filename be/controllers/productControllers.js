const db = require('../config/db');

exports.getAllProducts = async(req,res,next) => {
    try {
        const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
        return res.status(200).json({success: true, data: products);
    } catch (error) {
       next(error);
    }
};
// get all products by slug
exports.getProductsBySlug = async(req,res,next) => {
    const {slug} = req.params; 
    try {
        const [product] = await db.execute(`SELECT * FROM products WHERE slug=?`, [slug]); 
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
    const {id: productID} = req.params; 
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
        const {id: productID} = req.params; 
        const [deleted] = await db.query(`DELETE FROM products WHERE id=?`, [productID]);
        if(deleted.affectedRows === 0) return res.status(404).json({error: `Product not found with ID ${productID}`});
        return res.status(200).json({success: 'Product deleted!'});
    } catch(error){
        next(error)
    }
};

// get all products by pagination and filters
exports.getProducts = async(req,res,next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const offset = (page - 1) * limit; 
    const {search,brand, minPrice, maxPrice, kind} = req.query; 
    try {
        let query = `SELECT * FROM products WHERE 1=1`; 
        let countQuery = `SELECT COUNT(*) as total FROM products WHERE 1=1`; 
        let filters = ""; 
        let values = []; 
        if(search){
            filters += ` AND (name LIKE ? OR description LIKE ?)`
            const searchPattern = `%${search}%`
            values.push(searchPattern,searchPattern) 
        }
        if(brand){
            filters += ` AND brand=?`
            values.push(brand)
        } 
        if(minPrice){
            filters += ` AND price>=?`
            values.push(minPrice)
        } 
        if(maxPrice){
            filters += ` AND price<=?`
            values.push(maxPrice)
        }
        query += filters 
        countQuery += filters 
        if(kind === 'price_desc'){
            query += ` ORDER BY price DESC`
        } else if(kind === 'price_asc'){
            query += ` ORDER BY price ASC`
        } else {
            query += ` ORDER BY created_at DESC`
        }
    
        query += ` LIMIT ? OFFSET ?`
        const [totalResult] = await db.execute(countQuery, values)
        const totalProduct = totalResult[0].total
        const [products] = await db.execute(query, [...values, limit, offset])
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

