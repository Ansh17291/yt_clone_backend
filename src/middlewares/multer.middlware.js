import multer from "multer"


// read this from docs , just basic setup of multer
const storage = multer.diskStorage({
    destination : function(req, file , cb) {
        cb(null, './public/temp')
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname + '-' + uniqueSuffix)
    }
})

export const upload = multer({ 
    storage,
})