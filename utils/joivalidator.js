const Joi = require('joi')
const authSchema = Joi.object({
    firstname: Joi.string().alphanum().min(3).max(10).required(),
    lastname: Joi.string().alphanum().min(3).max(10).required(),
    address: Joi.string().min(3).max(10).required(),
    mobile:Joi.string().min(12).max(12).required(),
    email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password:Joi.string().min(3).max(10).required()
});
const updateauthSchema = Joi.object({
    firstname: Joi.string().alphanum().min(3).max(10),
    lastname: Joi.string().alphanum().min(3).max(10),
    address: Joi.string().min(3).max(10),
    mobile:Joi.string().min(12).max(12),
    email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:Joi.string().min(3).max(10)
});
module.exports ={authSchema,updateauthSchema}