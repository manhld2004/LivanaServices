// const express = require('express');
// const app = express();
// const propertyRoutes = require('./routes/property.routes');

// app.use(express.json());

// // Route chính
// app.use('/api/properties', propertyRoutes);

// const PORT = 4000;
// app.listen(PORT, () => console.log(`✅ Property service running on port ${PORT}`));


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