require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = express();


// Middlewares
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Routes (update path as needed based on your project structure)
const emailRoutes = require('./routes/emailConfig');
const paymentRoutes = require('./routes/stripePayment');
const retrieveStripe = require('./routes/retrievestripe');

app.use(emailRoutes);
app.use(paymentRoutes);
app.use(retrieveStripe);

//route middleware
app.use('/blog',require('./routes/blogRoute'));
app.use('/user',require('./routes/userRoute'));


//conrct to database
mongoose.connect(process.env.mongoose_uri)
.then(()=>{
    app.listen(process.env.port, ()=>{
        console.log(`server live at port ${process.env.port}`)
    })
}).catch(error=>{
    console.error(error)
})

// Export for Vercel
// module.exports = app;
// module.exports.handler = serverless(app);
