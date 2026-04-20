exports.errorHandler = (err, req, res, next) => {
    console.error("XƏTA BAŞ VERDİ:", err); 
    res.status(500).json({ success: false, message: err.message });
};

