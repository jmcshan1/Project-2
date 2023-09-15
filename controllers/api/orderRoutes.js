const router = require('express').Router();
const { Product, Order } = require('../../models');
const withAuth = require('../utils/auth');
//route to take us to order page with a specific product IF and user information
router.get('/:id', withAuth, async (req, res) => {
  console.log('order route hit');
  try {
    const productData = await Product.findByPk(req.params.id);
    // const userData = await User.findAll();

    const product = productData.get({ plain: true });
    // const user = userData.map((user) => user.get({ plain: true }));
    const user = req.session.user_id;

    res.render('orders', {
      product,
      user,
      logged_in: req.session.logged_in,
    });
    console.log(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//route to take order form information and create a new order in order sql table
router.post('/', async (req, res) => {
  console.log('order post route hit');
  try {
    const { product_id, user_id, quantity, address, city, state, zip, paymentType } = req.body;

    if (!product_id || !user_id || !quantity || !address || !city || !state || !zip || !paymentType) {
      return res.status(400).json({ message: 'Please fill out all fields' });
    }

    const newOrder = await Order.create({
      user_id,
      product_id,
      quantity,
      address,
      city,
      state,
      zip,
      paymentType
    });
    res.status(200).json(newOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
