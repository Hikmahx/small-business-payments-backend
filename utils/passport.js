const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const businessModel = require("../models/Business.model")
require("dotenv").config()

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    businessModel.findById(id).then((user) => {
        done(null, user)
    })
})


passport.use(
    new GoogleStrategy(
        {
            callbackURL: "https://grp93-frontend.netlify.app/client-login",
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
        },
        (accessToken, refreshToken, profile, done) => {
            businessModel.findOne({ googleId: profile.id }).then((currentUser) => {
                if (currentUser) {
                    console.log("user is: " + currentUser)
                    done(null, currentUser)
                } else {
                    new businessModel({
                        username: profile.displayName,
                        googleId: profile.id,
                        email: profile.emails[0].value
                    })
                        .save()
                        .then((newUser) => {
                            console.log("new user created: " + newUser);
                            done(null, newUser)
                        })
                }
            })
        }
    )
)