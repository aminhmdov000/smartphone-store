exports.validateReg = async(req,res,next) => {
  const {name, email, password} = req.body;
  try {
    if(
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ){
      return res.status(400).json({error: 'All fields are required!'});
    };
    if(name.trim().length < 3) return res.status(400).json({error: 'Name must be at least 3 characters!'}); 
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regexEmail.test(email)) return res.status(400).json({error: 'Invalid email format!'});
    if(password.length < 8) return res.status(400).json({error: 'Password must be at least 8 characters!'}); 
    next();
  } catch (error) {
    next(error);
  }
}

exports.validateLogin = async(req,res,next) => {
  const {email,password} = req.body;
  try {
    if(!email || !password) return res.status(400).json({error: 'Email and password required!'});
    next()
  } catch (error) {
    next(error)
  }
}
