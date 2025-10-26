const express = require('express');
const db = require('./firebase/firebase.config');
const propertyRoutes = require('./routes/property.routes'); // 👈 thêm dòng này
const app = express();

app.use(express.json());

// test route
app.get('/', (req, res) => res.send('Property service is running!'));

// property routes
app.use('/property', propertyRoutes); // 👈 thêm dòng này

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));