var express = require('express');
var jwt = require("jsonwebtoken");
var router = express.Router();
var User = require('../models/User');
var TOKEN_EXPIRATION = 60;
/* GET users listing. */
router.get('/', function(req, res, next) {
	User.find({}, function (err, user) {
		if(err){
			res.json({
				status: 500,
				err: "create user error"
			});
		}else{
			res.json({
				user : user
			});
		}
	});
});

router.post('/', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;

	User.findOne({
		where:{email: email}
	}, function(err, user){
		if(err){
			res.json({
				data: "error occured: " + err
			});
		}else{
			if(user){
				res.status(404).json({
					data: "User already exists!"
				});
			}else{
				var userModel = new User();

				userModel.email = email;
				userModel.password = password;
				userModel.save(function(err, newUser){
					newUser.email = email;
					newUser.password = password;
					newUser.token = jwt.sign({ user: newUser,
											 }, 'secret', {
							            expiresIn: TOKEN_EXPIRATION
									});
					newUser.save(function(err, user){
						res.json({
							data: user,
							token: user.token
						});
					});		        
				});
			}
		}
	});
});

module.exports = router;
