
const mongoose = require('mongoose');

// Configuración de la conexión a la base de datos
const username = 'ucrfabianvindas';
const password = 'u649Mj774gQI5xqW';
const dbName = 'Cluster0'; // Reemplaza con el nombre de tu base de datos

// URL de conexión de MongoDB
const url = `mongodb+srv://${username}:${password}@cluster0.wzwbjra.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// Conexión a la base de datos
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conexión exitosa a la base de datos'))
    .catch(err => console.error('Error de conexión a la base de datos:', err));

module.exports = mongoose;

// Modelo de datos para las licencias
const licenseSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    }
});

licenseSchema.statics.addKeysInBulk = async function(newKeys) {
    try {
        const insertedKeys = await this.insertMany(newKeys);
        console.log('New keys inserted successfully:', insertedKeys);
        return insertedKeys;
    } catch (error) {
        console.error('Error inserting new keys:', error);
        throw error;
    }
};

const License = mongoose.model('License', licenseSchema);

// Array de objetos representando nuevas llaves sin usar
const newKeys = [
    { key: 'CLEANBAN-DKMFAA', used: false },
    { key: 'CLEANBAN-U6A5MS', used: false },
    { key: 'CLEANBAN-TX4VUX', used: false },
    { key: 'CLEANBAN-W15MS1', used: false },
    { key: 'CLEANBAN-01UGL6', used: false },
    { key: 'CLEANBAN-RQJWBP', used: false },
    { key: 'CLEANBAN-B1V9HX', used: false },
    { key: 'CLEANBAN-70ZNJ6', used: false },
    { key: 'CLEANBAN-ERJSKA', used: false },
    { key: 'CLEANBAN-IWAXGB', used: false },
    { key: 'CLEANBAN-GD9V1I', used: false },
    { key: 'CLEANBAN-P7PZJX', used: false },
    { key: 'CLEANBAN-1IUE6A', used: false },
    { key: 'CLEANBAN-2JEI4C', used: false },
    { key: 'CLEANBAN-KCJ62Y', used: false },
    { key: 'CLEANBAN-Z8VMT9', used: false },
    { key: 'CLEANBAN-D6D4XB', used: false },
    { key: 'CLEANBAN-NCE899', used: false },
    { key: 'CLEANBAN-ZGKCFA', used: false },
    { key: 'CLEANBAN-D6CNKR', used: false }
];


// Llamar a la función para agregar las llaves en masa
License.addKeysInBulk(newKeys)
    .then(insertedKeys => {
        console.log('New keys inserted successfully:', insertedKeys);
    })
    .catch(error => {
        console.error('Error inserting new keys:', error);
    });
