var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
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
		email: email
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
				var userModel = new User({
					email: email,
					password: password
				});

				userModel.save(function(err, newUser){
					newUser.token = jwt.sign({ user: newUser,
											 }, 'secret', {
							            expiresIn: TOKEN_EXPIRATION
									});
					newUser.save(function(err, user){
						res.json({
							token: user.token
						});
					});		        
				});
			}
		}
	});
});

router.get('/self/?access_token=:token', function(req, res){
	var token = req.body.access_token;
	res.json({
		token: token
	});
	// User.findById(req.params.id, function(err, user){
	// 	if(err){
	// 		res.json({
	// 			status: 500,
	// 			err: "create user error"
	// 		});
	// 	}else{
	// 		res.json({
	// 			user: user
	// 		});
	// 	}
	// });
});

module.exports = router;
