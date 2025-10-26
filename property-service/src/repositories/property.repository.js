const db = require('../firebase/firebase.config');
const collection = db.collection('properties');

const PropertyRepository = {
  async getAll() {
    const snapshot = await collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async create(data) {
    const ref = await collection.add(data);
    return { id: ref.id };
  },

  async getById(id) {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    await collection.doc(id).update(data);
    return { id, ...data };
  },

  async delete(id) {
    await collection.doc(id).delete();
    return { id };
  }
};

module.exports = PropertyRepository;
