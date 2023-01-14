const User = require('./user');
require('dotenv').config()

async function check(name,callback){
    
    
    await User.findOne({username: name}).then((currentUser)=>{
        if(currentUser)
        {
            
            console.log('user exists');
          if(currentUser.group=="not assigned")
          callback("not assigned")
          else
           callback(currentUser.group)
        }
        else
        callback('not there')


})

}

module.exports = {check}