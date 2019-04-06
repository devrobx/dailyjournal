


if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb+srv://rob:<password>@djprod-lyyjp.mongodb.net/test?retryWrites=true'
}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/diary-dev'}
}
