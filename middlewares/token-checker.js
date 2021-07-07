let jwt = require('jsonwebtoken');
function checkToken(req,res,next){
    //Auth header value = > send token into header

    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){

        //split the space at the bearer
        const bearer = bearerHeader.split(' ');
        //Get token from string
        const bearerToken = bearer[1];

        //set the token
        req.token = bearerToken;
        jwt.verify(req.token, process.env.MY_SECRET_KEY || 'thisismymostsecrectkey', (err, result) => {
            if(err) {
                res.sendStatus(401);
            } else {
                //next middleweare
                next();
            }
        })

    }else{
        //Fobidden
        res.sendStatus(403);
    }

}

module.exports =  checkToken;
