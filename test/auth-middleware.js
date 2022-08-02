const expect = require('chai').expect
const jwt = require('jsonwebtoken')
const sinon = require('sinon')

const authMiddleware = require ('../middleware/is-auth');

describe("Auth Middleware", function(){
it("should throw an error if no authorization header is present", function(){
    const req = {
        get: function(headerName){
            return null;
        }
    }
    expect(authMiddleware.bind(this, req, {}, () =>{})).to.throw(
        'Not authenticated'
    )
});

it ("should throw an error if the authorization is only one string", function (){
    const req ={
        get: function(headerName){
            return 'abc';
        }
    }
    expect(authMiddleware.bind(this, req, {}, () =>{})).to.throw()
})

it ("should throw an error if the token cannot be verified", function (){
    const req ={
        get: function(headerName){
            return 'Bearer abc';
        }
    }
    expect(authMiddleware.bind(this, req, {}, () =>{})).to.throw()
})

it ("should yield a userID after decoding the token", function (){
    const req ={
        get: function(headerName){
            return 'Bearer abc';
        }
    }
    sinon.stub(jwt, 'verify')
    jwt.verify.returns({userId: 'abc'});
    authMiddleware(req, {}, ()=>{})
    expect(req).to.have.property('userId')
    expect(req).to.have.property('userId', 'abc')
    jwt.verify.restore();
})
})
