const db = require('../config/db');

exports.addToCart = async(req,res,next) => {
    try {
        const userID = req.user.id; 
        const {productID, quantity} = req.body;
        const ProductID = Number(productID);
        const Quantity = Number(quantity);

        if (!Number.isInteger(ProductID) || ProductID <= 0) {
            return res.status(400).json({error: 'Valid Product ID is required!'});
        }

        if (!Number.isInteger(Quantity) || Quantity <= 0) {
            return res.status(400).json({error: 'Quantity must be a positive integer!'});
        }
       
        let [carts] = await db.query(
            'SELECT * FROM carts WHERE user_id = ?',
            [userID]); 
        let cart;
        if(carts.length === 0){
            const [result] = await db.execute(
                'INSERT INTO carts(user_id) VALUES(?)',
                [userID]);          
            cart = {id: result.insertId};
        }
        else cart = carts[0]
        const [items] = await db.query(
        'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
        [cart.id, ProductID]
        );
        if(items.length > 0){
            await db.execute('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
            [Quantity, items[0].id]
            )
        }
        else{
            await db.execute('INSERT INTO cart_items(cart_id,product_id,quantity) VALUES(?,?,?)',
                [cart.id,ProductID,Quantity]
            );   
        }
        res.status(201).json({success: 'Product added to cart!'})
    } catch (error) {
        next(error)
    }
};

exports.getCard = async(req,res,next) => {
    try {
        const userID = req.user.id;
        const [cart] = await db.query('SELECT * FROM carts WHERE user_id = ?', [userID]);
        if(cart.length === 0) return res.json([]);
        const [items] = await db.query(
            `SELECT ci.id AS cart_item_id, p.id, p.name, p.price, p.image_url, ci.quantity
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = ?`,
            [cart[0].id]
        )
        return res.status(200).json(items);
    } catch (error) {
        next(error)
    }
};

exports.updateCartItem = async(req,res,next) => {
    try {
        const userID = req.user.id;
        const {id} = req.params;
        const {quantity} = req.body;
        const ItemID = Number(id);
        const Quantity = Number(quantity);

        if (!Number.isInteger(ItemID) || ItemID <= 0) {
            return res.status(400).json({error: 'Valid cart item id is required!'});
        }

        if (!Number.isInteger(Quantity) || Quantity <= 0) {
            return res.status(400).json({error: 'Quantity must be a positive integer!'});
        }

        const [result] = await db.query(
            `UPDATE cart_items ci
             JOIN carts c ON c.id = ci.cart_id
             SET ci.quantity = ?
             WHERE ci.id = ? AND c.user_id = ?`,
            [Quantity, ItemID, userID]
        );
        if (result.affectedRows === 0) return res.status(404).json({error: 'Cart item not found!'});
        return res.status(200).json({success: 'Cart updated!'});
    } catch (error) {
        next(error);
    }
};

exports.removeCartItem = async(req,res,next) => {
    try {
        const userID = req.user.id;
        const {id} = req.params;
        const ItemID = Number(id);

        if (!Number.isInteger(ItemID) || ItemID <= 0) {
            return res.status(400).json({error: 'Valid cart item id is required!'});
        }

        const [result] = await db.query(
            `DELETE ci FROM cart_items ci
             JOIN carts c ON c.id = ci.cart_id
             WHERE ci.id = ? AND c.user_id = ?`,
            [ItemID, userID]
        );
        if (result.affectedRows === 0) return res.status(404).json({error: 'Cart item not found!'});
        return res.status(200).json({success: 'Item removed!'})
    } catch (error) {
      next(error)
    }
}
