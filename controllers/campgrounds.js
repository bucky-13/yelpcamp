const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require('../cloudinary');

//***************CAMPGROUNDS INDEX PAGE */

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}
//***************MAKE NEW CAMPGROUND */
//**********ORDER MATTERS, /new MUST BE ABOVE /:id IN THE CODE, OTHERWISE IT WON'T BE USED SINCE :id WILL OVERRIDE IT */

module.exports.showNewCampground = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.postNewCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()


    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

//*************VIEW ANY CAMPGROUND */

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

//************EDIT ANY CAMPGROUND */

module.exports.showEditCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.putEditCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })

        console.log(campground)
    }

    req.flash('success', 'Successfully updated the campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

//**************DELETE ANY CAMPGROUND */

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground successfully annihilated, deleted, unmade. This campground is no more.');
    res.redirect('/campgrounds');
}
