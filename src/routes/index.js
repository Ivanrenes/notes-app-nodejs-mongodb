const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.send('Index')
})

router.get('/about',(req, res) => {
    req.send('About')
})

module.exports = router;