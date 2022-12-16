let express = require('express');
let multer = require('multer')
let mongoose = require('mongoose')
let app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

//--------------------------------------Database Setup ------------------------------------->
mongoose.connect('mongodb+srv://Bhuwan:fake2fake@cluster0.ygunjqo.mongodb.net/testing?retryWrites=true&w=majority')
    .then(() => console.log(`MongoDb is connected`))
    .catch(err => console.log(err.message))

let myschema = mongoose.Schema({
    Picture: String
})

let mymodel = mongoose.model('table', myschema)


//-----------------------------------Upload Setting------------------------------------------>
let upload = multer({

    //-------------------------------Storage Setting----------------------------------------> 
    storage: multer.diskStorage({
        destination: './public/images',      //directory (folder)/Storge setting ---- Currently Storing in Local System -- Not noe in DataBase
        filename: (req, file, cb) => {
            cb(null,file.fieldname+_+Date.now())      // file name setting
        }
    }),

    fileFilter: (req, file, cb) => {           //------- Optinal -- If want to Apply filter in Files
        if ( file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif') {
            cb(null, true)
        }
        else {
            cb(null, false);
            cb(new Error('Only jpeg,  jpg , png, and gif Image allow'))
        }
    }
})



//-----------------------------SINGALE IMAGE UPLODING---------------------------------------------->
app.post('/singlepost', upload.single('single_input_field'), (req, res) => {
    req.file                      //------------- Passing Upload Function as a Middleware with Singal Functio
    mymodel.create({ Picture: req.file.filename })
        .then((x) => {               // ^ Singal input ki gagah par ------- Field/ key name Ayega 
            res.redirect('/view')
        })
        .catch((y) => {
            console.log(y)
        })
    //res.send(req.file.filename)
})


//------------------------------------mULTIPLE IMAGE UPLODING--------------------------------------------->
app.post('/multiplepost', upload.array('multiple_input_field', 3), (req, res) => {
    req.files.forEach((singale_image) => {    // Passing Upload Function as a Middleware With Array(Multi) Function
        mymodel.create({ Picture: singale_image.filename })
            .then((x) => {          //-------- ^ multiole_input ki gagah par ---- Field/ key ka key name Ayega
                res.redirect('/view')
            })
            .catch((y) => {
                console.log(y)
            })
    })
})


app.get('/', (req, res) => {
    res.render('index')           //---- Home Page  on Sterting
})

app.get('/view', (req, res) => {
    mymodel.find({})
        .then((x) => {
            res.render('privew', { x })
            console.log(x)
        })
        .catch((y) => {
            console.log(y)
        })

})

app.listen(3000, () => {
    console.log('3000 Port Working')
})