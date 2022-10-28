const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Review', reviewSchema)

//It has majestic grizzly masters in it. Beware tho, the grizzly hamsters are lethal predators. Beautiful and dangerous place.