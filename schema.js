/*
Author: chankruze (chankruze@geekofia.in)
Created: Wed Sep 16 2020 11:45:27 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2020 and beyond
*/

const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema, GraphQLFloat } = require('graphql')
const axios = require('axios')

const API_V4 = 'https://api.spacexdata.com/v4'
const END_LAUNCHES = '/launches'
const END_ROCKETS = '/rockets'
const END_LAUNCHPADS = '/launchpads'
const END_SHIPS = '/ships'

// Launch Type
const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields: () => ({
        id: { type: GraphQLString },
        flight_number: { type: GraphQLInt },
        name: { type: GraphQLString },
        success: { type: GraphQLBoolean },
        static_fire_date_utc: { type: GraphQLString },
        static_fire_date_unix: { type: GraphQLInt },
        date_utc: { type: GraphQLString },
        date_local: { type: GraphQLString },
        date_unix: { type: GraphQLInt },
        lunchpad: { type: GraphQLString },
        details: { type: GraphQLString },
        rocket: { type: GraphQLString },
        upcoming: { type: GraphQLBoolean },
        crew: { type: new GraphQLList(GraphQLString) },
        ships: { type: new GraphQLList(GraphQLString) },
        capsules: { type: new GraphQLList(GraphQLString) },
        payloads: { type: new GraphQLList(GraphQLString) },
        failures: { type: new GraphQLList(GraphQLString) },
        window: { type: GraphQLInt },
        // rocket_details: {
        //     type: RocketType,
        //     resolve(root, parent, args) {
        //         return axios.get(`${API_V4}${END_ROCKETS}/${root.rocket}`).then(res => res.data)
        //     }
        // },
        cores: {
            type: new GraphQLObjectType({
                name: 'Cores',
                fields: () => ({
                    core: { type: GraphQLString },
                    flight: { type: GraphQLInt },
                    gridfins: { type: GraphQLBoolean },
                    legs: { type: GraphQLBoolean },
                    reused: { type: GraphQLBoolean },
                    landing_attempt: { type: GraphQLBoolean },
                    landing_success: { type: GraphQLBoolean },
                    landing_type: { type: GraphQLString },
                    landpad: { type: GraphQLString },
                })
            })
        },
        links: {
            type: new GraphQLObjectType({
                name: 'Links',
                fields: () => ({
                    patch: {
                        type: new GraphQLObjectType({
                            name: 'Patch',
                            fields: () => ({
                                small: { type: GraphQLString },
                                large: { type: GraphQLString },
                            })
                        })
                    },
                    reddit: {
                        type: new GraphQLObjectType({
                            name: 'Reddit',
                            fields: () => ({
                                campaign: { type: GraphQLString },
                                launch: { type: GraphQLString },
                                media: { type: GraphQLString },
                                recovery: { type: GraphQLString },
                            })
                        })
                    },
                    flickr: {
                        type: new GraphQLObjectType({
                            name: 'Flickr',
                            fields: () => ({
                                small: { type: new GraphQLList(GraphQLString) },
                                original: { type: new GraphQLList(GraphQLString) },
                            })
                        })
                    },
                    presskit: { type: GraphQLString },
                    webcast: { type: GraphQLString },
                    article: { type: GraphQLString },
                    wikipedia: { type: GraphQLString }
                })
            })
        }
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
                    feet: { type: GraphQLFloat }
                })
            })
        },
        diameter: {
            type: new GraphQLObjectType({
                name: 'Diameter',
                fields: () => ({
                    meters: { type: GraphQLFloat },
                    feet: { type: GraphQLFloat }
                })
            })
        },
        mass: {
            type: new GraphQLObjectType({
                name: 'Mass',
                fields: () => ({
                    kg: { type: GraphQLFloat },
                    lb: { type: GraphQLFloat }
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
                    thrust_to_weight: { type: GraphQLFloat }
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

// Launchpad Type
const LaunchpadType = new GraphQLObjectType({
    name: 'Launchpad',
    fields: () => ({
        id: { type: GraphQLString },
        full_name: { type: GraphQLString },
        locality: { type: GraphQLString },
        region: { type: GraphQLString },
        timezone: { type: GraphQLString },
        latitude: { type: GraphQLFloat },
        longitude: { type: GraphQLFloat },
        launch_attempts: { type: GraphQLInt },
        launch_successes: { type: GraphQLInt },
        rockets: { type: new GraphQLList(GraphQLString) },
        launches: { type: new GraphQLList(GraphQLString) },
        details: { type: GraphQLString },
        status: { type: GraphQLString },
    })
})

// Ship Type
const ShipType = new GraphQLObjectType({
    name: 'Ship',
    fields: () => ({
        id: { type: GraphQLString },
        legacy_id: { type: GraphQLString },
        model: { type: GraphQLString },
        type: { type: GraphQLString },
        roles: { type: new GraphQLList(GraphQLString) },
        imo: { type: GraphQLInt },
        mmsi: { type: GraphQLInt },
        abs: { type: GraphQLInt },
        class: { type: GraphQLInt },
        mass_kg: { type: GraphQLInt },
        mass_lbs: { type: GraphQLInt },
        year_built: { type: GraphQLInt },
        home_port: { type: GraphQLString },
        status: { type: GraphQLString },
        speed_kn: { type: GraphQLInt },
        course_deg: { type: GraphQLFloat },
        latitude: { type: GraphQLFloat },
        longitude: { type: GraphQLFloat },
        last_ais_update: { type: GraphQLString },
        link: { type: GraphQLString },
        image: { type: GraphQLString },
        launches: { type: new GraphQLList(GraphQLString) },
        name: { type: GraphQLString },
        active: { type: GraphQLBoolean },
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // Launches
        launches: {
            type: new GraphQLList(LaunchType),
            resolve(parent, args) {
                return axios.get(`${API_V4}${END_LAUNCHES}`).then(res => res.data)
            }
        },
        launch: {
            type: LaunchType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return axios.get(`${API_V4}${END_LAUNCHES}/${args.id}`).then(res => res.data)
            }
        },
        // Rockets
        rockets: {
            type: new GraphQLList(RocketType),
            resolve(parent, args) {
                return axios.get(`${API_V4}${END_ROCKETS}`).then(res => res.data)
            }
        },
        rocket: {
            type: RocketType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return axios.get(`${API_V4}${END_ROCKETS}/${args.id}`).then(res => res.data)
            }
        },
        // Launchpads
        launchpads: {
            type: new GraphQLList(LaunchpadType),
            resolve(parent, args) {
                return axios.get(`${API_V4}${END_LAUNCHPADS}`).then(res => res.data)
            }
        },
        launchpad: {
            type: LaunchpadType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return axios.get(`${API_V4}${END_LAUNCHPADS}/${args.id}`).then(res => res.data)
            }
        },
        // Ships
        ships: {
            type: new GraphQLList(ShipType),
            resolve(parent, args) {
                return axios.get(`${API_V4}${END_SHIPS}`).then(res => res.data)
            }
        },
        ship: {
            type: ShipType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return axios.get(`${API_V4}${END_SHIPS}/${args.id}`).then(res => res.data)
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
