const db = require('../firebase/firebase.config');
const User = require('../models/user.model');

const collection = db.collection("users");

const UserRepository = {
    async createUser(uid, data) {
        await collection.doc(uid).set(data);
        return { id: uid, ...data };
    },

    async getUserById(uid) {
        const doc = await collection.doc(uid).get();
        if (!doc.exists) return null;
        return new User({ id: doc.id, ...doc.data() });
    },

    async updateField(uid, field, value) {
        await collection.doc(uid).update({ [field]: value });
        return true;
    },

    async updateAvatar(uid, avatarUrl) {
        await collection.doc(uid).update({ avatar: avatarUrl });
        return true;
    },

    async addRentingHistory(uid, bookingId) {
        await collection.doc(uid).update({
            renting_history: db.FieldValue.arrayUnion(bookingId)
        });
        return true;
    },

    async addToWishList(uid, propertyId) {
        await collection.doc(uid).update({
            wish_list: db.FieldValue.arrayUnion(propertyId)
        });
    },

    async removeFromWishList(uid, propertyId) {
        await collection.doc(uid).update({
            wish_list: db.FieldValue.arrayRemove(propertyId)
        });
    }
};

module.exports = UserRepository;
