const mongoose = require('mongoose');
const db = mongoose.connection;
const Campground = require('../models/campground');
const cities = require('./cities');
const images = require('./images')
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelpcamp');


db.on('error', console.error.bind(console, 'connection eroor:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1k = Math.floor(Math.random() * 1000);
        const random281 = Math.floor(Math.random() * 28);
        const random282 = Math.floor(Math.random() * 28);
        const random283 = Math.floor(Math.random() * 28);
        const price = Math.floor(Math.random() * 25 + 10);
        const camp = new Campground({
            author: '635b911e6fac261079a67f03',
            location: `${cities[random1k].city}, ${cities[random1k].state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1k].longitude,
                    cities[random1k].latitude,
                ]

            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: `${images[random281].url}`,
                    filename: `${images[random281].filename}`
                },
                {
                    url: `${images[random282].url}`,
                    filename: `${images[random282].filename}`
                },
                {
                    url: `${images[random283].url}`,
                    filename: `${images[random283].filename}`
                },

            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos accusantium voluptatem reiciendis sapiente! Dignissimos dolorem doloremque repudiandae. Veritatis quam esse eveniet! Dignissimos blanditiis obcaecati eius est doloremque, dolorem repellendus a.',
            price
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close()
}) 