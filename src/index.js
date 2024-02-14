require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./db/dbconfig');

const app = express();
dbConnection();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserRoutes = require('./routes/user.js');
const PublicationRoutes = require('./routes/publication.js');
const FollowRoutes = require('./routes/follow.js');
app.use('/api/user', UserRoutes);
app.use('/api/publication', PublicationRoutes);
app.use('/api/follow', FollowRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server escuchando en el puerto: ${process.env.PORT}`);
})
