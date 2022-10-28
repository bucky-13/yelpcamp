const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const campgroundCtrl = require('../controllers/campgrounds')
const Campground = require('../models/campground');
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })

const { isLoggedIn, validateCampground, validateAuthor } = require('../utilities/authMiddleware')




//***************VIEW CAMPGROUNDS INDEX PAGE + POST NEW CAMPGROUND*/

router.route('/')
    .get(catchAsync(campgroundCtrl.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundCtrl.postNewCampground))


//***************VIEW NEW CAMPGROUND FORM */

router.get('/new', isLoggedIn, campgroundCtrl.showNewCampground)


//**********ORDER MATTERS, /:id SHOULD BE UNDER ANY OTHER /route, SINCE IT WILL OVERRIDE PAGES SUCH AS /new */

//*************VIEW, PUT (SEND) EDIT AND DELETE ANY SPECIFIC CAMPGROUND */
router.route('/:id')
    .get(catchAsync(campgroundCtrl.showCampground))
    .put(isLoggedIn, validateAuthor, upload.array('image'), validateCampground, catchAsync(campgroundCtrl.putEditCampground))
    .delete(isLoggedIn, validateAuthor, catchAsync(campgroundCtrl.deleteCampground))

//************EDIT ANY CAMPGROUND */
router.get('/:id/edit', isLoggedIn, validateAuthor, catchAsync(campgroundCtrl.showEditCampground))

//********DO NOT COMMENT THIS OUT EVER, IT WILL BREAK THE APP.................. */
module.exports = router;



//**********************OLD SETUP********************************************************************************* */

// //***************CAMPGROUNDS INDEX PAGE */

// router.get('/', catchAsync(campgroundCtrl.index));

// //***************MAKE NEW CAMPGROUND */
// //**********ORDER MATTERS, /new MUST BE ABOVE /:id IN THE CODE, OTHERWISE IT WON'T BE USED SINCE :id WILL OVERRIDE IT */
// router.get('/new', isLoggedIn, campgroundCtrl.showNewCampground)

// router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundCtrl.postNewCampground))

// //*************VIEW ANY CAMPGROUND */
// router.get('/:id', catchAsync(campgroundCtrl.showCampground))

// //************EDIT ANY CAMPGROUND */
// router.get('/:id/edit', isLoggedIn, validateAuthor, catchAsync(campgroundCtrl.showEditCampground))

// router.put('/:id', isLoggedIn, validateCampground, validateAuthor, catchAsync(campgroundCtrl.putEditCampground))

// //**************DELETE ANY CAMPGROUND */
// router.delete('/:id', isLoggedIn, validateAuthor, catchAsync(campgroundCtrl.deleteCampground))

