const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const crawler = require('../crawler/crawler');


router.get('/',(req, res) => {
    res.render('index');
});

router.post('/api/crawl', async(req, res) => {
    
    const {error } = validateReqParams(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});

    const payload = await crawler(req.body.twitterUrl);
    if(!payload) return res.status(500).json({message:'Something failed'});
    
    res.json(payload);
});

function validateReqParams(reqBody){
    const schema = Joi.object({
        twitterUrl: Joi.string()
        .required()
        .pattern(new RegExp('^https://twitter.com/'))
    });

    return schema.validate(reqBody);
}

module.exports = router;