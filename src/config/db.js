if(process.env.NODE_ENV == 'production'){   
    module.exports = {mongoURI: ''}
}else{
    module.exports = {mongoURI:  process.env.MONGODB_STRING } //+'?retryWrites=true&w=majority'
    //module.exports = {mongoURI: "mongodb://localhost/minhaFab"}
}