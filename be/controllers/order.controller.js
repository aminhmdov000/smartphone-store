const db = require('../config/db'); 
const VALID_ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const VALID_PAYMENT_METHODS = ['fake_card', 'cash_on_delivery'];
exports.checkout = async(req,res,next) => { 
    const userID = req.user.id; 
    const paymentMethod = req.body.paymentMethod || 'cash_on_delivery';
    const connection = await db.getConnection(); 
    try{
        await connection.beginTransaction();
        if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
            await connection.rollback();
            return res.status(400).json({error: 'Invalid payment method!'});
        }
        const requestedItems = Array.isArray(req.body.items) ? req.body.items : [];

        const [carts] = await connection.query('SELECT * FROM carts WHERE user_id = ?', [userID]); 
        const cart = carts[0] || null; 
        let items = [];
      
        if (cart) {
            const [cartItems] = await connection.query(
                'SELECT ci.product_id, ci.quantity, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?',
                [cart.id]
            );
            items = cartItems;
        } else if (requestedItems.length > 0) {
            const normalizedItems = requestedItems.map((item) => ({
                product_id: Number(item.product_id ?? item.id),
                quantity: Number(item.quantity)
            }));

            const invalidItem = normalizedItems.find(
                (item) => !Number.isInteger(item.product_id) || item.product_id <= 0 || !Number.isInteger(item.quantity) || item.quantity <= 0
            );

            if (invalidItem) {
                await connection.rollback();
                return res.status(400).json({error: 'Invalid cart items!'});
            }

            for (const item of normalizedItems) {
                const [products] = await connection.query('SELECT id, price FROM products WHERE id = ?', [item.product_id]);
                if (products.length === 0) {
                    await connection.rollback();
                    return res.status(400).json({error: `Product not found for ID ${item.product_id}`});
                }

                items.push({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: products[0].price
                });
            }
        } else {
            await connection.rollback();
            return res.status(400).json({error: 'Cart not found!'});
        }
        if(items.length === 0) {
            await connection.rollback();
            return res.status(400).json({error: 'Cart is empty!'});
        }
    
        let totalPrice = 0;
        items.forEach(item =>{ 
            totalPrice += item.price * item.quantity;
        });
        const orderStatus = paymentMethod === 'fake_card' ? 'paid' : 'pending';
        
        const [orderResult] = await connection.query('INSERT INTO orders(user_id, total_price, status) VALUES(?,?,?)',
            [userID, totalPrice, orderStatus]);
        const orderID = orderResult.insertId;

        for(let item of items){
            //lock product row
            const [products] = await connection.query('SELECT stock FROM products WHERE id = ? FOR UPDATE',
                [item.product_id]
            )
            if(products.length === 0) {
                await connection.rollback();
                return res.status(400).json({error: 'Product not found!'});
            }
            const product = products[0];
            //CHECK STOCK
            if(product.stock < item.quantity){
                await connection.rollback();
                return res.status(400).json({error: `Not enough stock for product ID ${item.product_id}`});
            };
            //reduce stock
            await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
            //INSERT ORDER ITEM
            await connection.query('INSERT INTO order_items(order_id, product_id, quantity, price) VALUES(?,?,?,?)',
                [orderID, item.product_id, item.quantity, item.price]
            )
        };
        //CLEAR CART
        if (cart) {
            await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]); 
        }
        await connection.commit(); 

        return res.status(201).json({
            success: paymentMethod === 'fake_card' ? 'Payment successful and order created.' : 'Order created successfully.',
            orderID,
            status: orderStatus,
            paymentMethod
        });
    } catch (error) {
        await connection.rollback(); // IF ANY ERROR OCCURS DURING THE CHECKOUT PROCESS, WE ROLLBACK THE TRANSACTION TO REVERT ANY CHANGES MADE TO THE DATABASE, ENSURING THAT THE DATABASE REMAINS IN A CONSISTENT STATE. THIS IS IMPORTANT TO PREVENT PARTIAL UPDATES TO THE DATABASE IN CASE OF FAILURES.
        // ROLLBACK IS CALLED TO UNDO ANY CHANGES MADE TO THE DATABASE DURIG THE TRANSACTION, ENSURING THAT THE DATABASE REMAINS IN A CONSISTENT STATE EVEN IF AN ERROR OCCURS. THIS IS CRUCIAL FOR MAINTAINING DATA INTEGRITY AND PREVENTING PARTIAL UPDATES TO THE DATABASE.
        next(error)       
    }
    finally{
        //RELEASE IS CALLED TO RETURN THE DATABASE CONNECTION BACK TO THE POOL, ENSURING THAT IT CAN BE REUSED FOR OTHER REQUESTS. THIS IS IMPORTANT TO PREVENT CONNECTION LEAKS AND TO MAINTAIN THE PERFORMANCE OF THE APPLICATION BY EFFICIENTLY MANAGING DATABASE CONNECTIONS.
        connection.release(); // FINALLY, WE RELEASE THE DATABASE CONNECTION BACK TO THE POOL, WHETHER THE CHECKOUT PROCESS SUCCEEDED OR FAILED. THIS IS IMPORTANT TO ENSURE THAT CONNECTIONS ARE NOT LEAKED AND ARE AVAILABLE FOR OTHER REQUESTS.
    }
};

// GET ALL ORDERS FOR THE LOGGED-IN USER
exports.myOrders = async(req,res,next) => {
    try {
        const userID = req.user.id; // get user id from token (authMiddleware decoded)
        //get orders that belong to this user
        const [orders] = await db.query(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`, [userID]);
        for(const order of orders){
          const [items] = await db.query(`
            SELECT oi.product_id, p.name, oi.quantity, oi.price
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id=?`, [order.id]
          );
          order.items = items; // attach items to each other order object in the orders array, so we can return the order details along with the items in the response. This allows the frontend to display the order information along with the products included in each order.
        }
        return res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

//GET ORDER DETAILS INCLUDING ORDER ITEMS (PRODUCT INFO) FOR A SPECIFIC ORDER, CHECKING THAT THE ORDER BELONGS TO THE LOGGED-IN USER
exports.orderDetails = async(req,res,next) => {
    try {
        const orderID = req.params.id;
        const userID = req.user.id; // from protect middleware
        //get order and check if belongs to this user
        const [orders] = await db.execute('SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [orderID,userID]);
        if(orders.length === 0) return res.status(404).json({error: 'Order not found!'});
        const order = orders[0];
        //get order with product info
        const [items] = await db.execute(
            `SELECT oi.product_id, p.name, oi.quantity, oi.price
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`,
            [orderID]
        );
        return res.status(200).json({order,items})
    } catch (error) {
        next(error)
    }
};

// GET ALL ORDERS (admin)
exports.getAllOrders = async(req,res,next) => {
    try{
        const [orders] = await db.execute(`
            SELECT o.*, u.email AS user_email
            FROM orders o
            JOIN users u ON u.id = o.user_id
            ORDER BY o.created_at DESC
        `);
        return res.status(200).json(orders);
    } catch(error){
        next(error);
    }
};

//update order status(admin)
exports.updateStatus = async(req,res,next) => {
    const orderID = req.params.id; // order id from url parametre
    const {status} = req.body; // new status from request body

    try {
        //check if status is valid
        if(!VALID_ORDER_STATUSES.includes(status)) return res.status(400).json({error: 'Invalid status!'});
        const [statuses] = await db.execute(`UPDATE orders SET status = ? WHERE id =?`, [status,orderID]);
        if(statuses.affectedRows === 0) return res.status(404).json({error: 'Order not found!'});
        return res.status(200).json({success: 'Order status updated!'});
    } catch (error) {
      next(error);
    }
};
//cancelled orders
exports.cancelledOrders = async(req,res,next) => {
  const orderID = req.params.id; // order id from url
  const userID = req.user.id; // from protect middleware
  try {
    const [orders] = await db.execute('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderID, userID]);
    if(orders.length === 0) return res.status(404).json({error: 'Order not found!'});
    const order = orders[0];
    if(order.status === 'shipped' || order.status === 'delivered') return res.status(400).json({error: 'Cannot cancel shipped or delivered orders!'});
    await db.execute('UPDATE orders SET status = ? WHERE id = ? AND user_id = ?', ['cancelled', orderID, userID]);
    return res.status(200).json({success: 'Order cancelled!'});
  } catch (error) {
    next(error);
  }
};
// get order statuses for admin
exports.getOrderStatuses = async(req,res,next) => {
  try {
    return res.status(200).json({statuses: VALID_ORDER_STATUSES});
  } catch (error) {
    next(error);
  }
};
