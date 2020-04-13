import mongoose from 'mongoose'

mongoose
.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1/coviddb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err))