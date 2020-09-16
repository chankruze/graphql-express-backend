/*
Author: chankruze (chankruze@geekofia.in)
Created: Wed Sep 16 2020 11:45:27 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2020 and beyond
*/

const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema, GraphQLFloat } = require('graphql')
const axios = require('axios')

const API_V4_LAUCHES = 'https://api.spacexdata.com/v4/launches'
const API_V4_ROCKETS = 'https://api.spacexdata.com/v4/rockets'

// Launch Type
const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields: () => ({
        id: { type: GraphQLString },
        flight_number: { type: GraphQLInt },
        name: { type: GraphQLString },
        success: { type: GraphQLBoolean },
        date_local: { type: GraphQLString },
        lunchpad: { type: GraphQLString },
        rocket: { type: GraphQLString },
        rocket_details: {
            type: RocketType,
            resolve(root, parent, args) {
                return axios.get(`${API_V4_ROCKETS}/${root.rocket}`).then(res => res.data)
            }
        },
        links: { type: LinksType }
    })
})

// Links Type
const LinksType = new GraphQLObjectType({
    name: 'Links',
    fields: () => ({
        webcast: { type: GraphQLString },
        article: { type: GraphQLString },
        wikipedia: { type: GraphQLString }
    })
})

// Rocket Type
const RocketType = new GraphQLObjectType({
    name: 'Rocket',
    fields: () => ({
        name: { type: GraphQLString },
        type: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        stages: { type: GraphQLInt },
        boosters: { type: GraphQLInt },
        cost_per_launch: { type: GraphQLInt },
        success_rate_pct: { type: GraphQLInt },
        first_flight: { type: GraphQLString },
        country: { type: GraphQLString },
        company: { type: GraphQLString },
        wikipedia: { type: GraphQLString },
        description: { type: GraphQLString },
        id: { type: GraphQLString },
        height: {
            type: new GraphQLObjectType({
                name: 'Height',
                fields: () => ({
                    meters: { type: GraphQLFloat },
                    feet: { type: GraphQLInt }
                })
            })
        },
        diameter: {
            type: new GraphQLObjectType({
                name: 'Diameter',
                fields: () => ({
                    meters: { type: GraphQLFloat },
                    feet: { type: GraphQLInt }
                })
            })
        },
        mass: {
            type: new GraphQLObjectType({
                name: 'Mass',
                fields: () => ({
                    kg: { type: GraphQLInt },
                    lb: { type: GraphQLInt }
                })
            })
        },
        engines: {
            type: new GraphQLObjectType({
                name: 'Engines',
                fields: () => ({
                    number: { type: GraphQLInt },
                    type: { type: GraphQLString },
                    version: { type: GraphQLString },
                    layout: { type: GraphQLString },
                    engine_loss_max: { type: GraphQLInt },
                    propellant_1: { type: GraphQLString },
                    propellant_2: { type: GraphQLString },
                    thrust_to_weight: { type: GraphQLInt }
                })
            })
        },
        landing_legs: {
            type: new GraphQLObjectType({
                name: 'Landing_Legs',
                fields: () => ({
                    number: { type: GraphQLInt },
                    material: { type: GraphQLString }
                })
            })
        },
        payload_weights: {
            type: new GraphQLList(new GraphQLObjectType({
                name: 'Payload_Weights',
                fields: () => ({
                    id: { type: GraphQLString },
                    name: { type: GraphQLString },
                    kg: { type: GraphQLInt },
                    lb: { type: GraphQLInt }
                })
            }))
        },
        flickr_images: {
            name: 'Flickr_Images',
            type: new GraphQLList(GraphQLString)
        }
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        launches: {
            type: new GraphQLList(LaunchType),
            resolve(parent, args) {
                return axios.get(API_V4_LAUCHES).then(res => res.data)
            }
        },
        launch: {
            type: LaunchType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return axios.get(`${API_V4_LAUCHES}/${args.id}`).then(res => res.data)
            }
        },
        rocket: {
            type: RocketType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return axios.get(`${API_V4_ROCKETS}/${args.id}`).then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})