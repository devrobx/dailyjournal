


if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://rob:wiseguy723@ds111025.mlab.com:11025/heroku_j29r2bns'
}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/diary-dev'}
}
