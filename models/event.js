const moongoose = require('mongoose')
const Schema = moongoose.Schema
const eventSchema = new Schema({
    name: String,
    description: String,
    date: Number,
    special: Boolean
})

module.exports = moongoose.model('event', eventSchema, 'events')