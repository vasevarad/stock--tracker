const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

//@route    GET api/balance
//@desc     Get balance
router.get('/', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user.balance);
   } catch(err){
       console.error(err.message);
       res.status(500).send('Server error');
   }
});



//@route    POST api/balance
//@desc     update the balance
router.post('/:update_balance', async (req, res) => {

    const { email } = req.body;

  //  try{
    //does the user exist?
    try{
        let user = await User.findOne({ email});
        let old_balance = user.balance;
        let update_balance = Number(req.params.update_balance); 
        let new_balance =  (old_balance + update_balance < 0) ? 0 : old_balance + update_balance;
        req.email = email;
        req.balance = new_balance;
        await User.findOneAndUpdate({"email" : email}, {"balance": new_balance}, { returnNewDocument: true}, function(err, doc){
            if (err) return res.send(500, { error: err });
            //user.select('-password');
            res.json(user);
        });
        user = await User.findOne({ email});
        res.json(user);
        
    }
    catch(err){
        return res.status(400).json({ errors: [ {msg: 'Error updating balance'}] });
        
    }

});



module.exports = router;