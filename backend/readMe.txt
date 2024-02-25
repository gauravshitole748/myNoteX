1. Mongoose Document: https://mongoosejs.com/docs/index.html
2. Express Validator: https://express-validator.github.io/docs/
3. ----> Password Hashcode & salt
    - Basically to protect password; salt & paper is added
        - First password gets converted to Hashcode and 
        - Salt is like some prefix/suffix added to the password
        - Pepper is also some prefix/suffix added to the salt
        - Hashcode of password + salt + Pepper makes our password stronger
        
Bcrypt: https://www.npmjs.com/package/bcryptjs

4. json webtoken
https://jwt.io/
    1. Red: Algorithem & token type
    2. Purple: data
    3. Blue: signiture