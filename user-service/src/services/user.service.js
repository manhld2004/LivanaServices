const UserRepository = require('../repositories/user.repository');
const Role = require('../models/role.model');

class UserService {
    async createUser(uid, data) {
        data.role = data.role || Role.USER;
        return await UserRepository.createUser(uid, data);
    }

    async getUserById(uid) {
        const user = await UserRepository.getUserById(uid);
        if (!user) throw new Error('User not found');
        return user;
    }

    async updateField(uid, field, value) {
        return await UserRepository.updateField(uid, field, value);
    }

    async updateAvatar(uid, avatar) {
        return await UserRepository.updateAvatar(uid, avatar);
    }

    async addRentingHistory(uid, bookingId) {
        return await UserRepository.addRentingHistory(uid, bookingId);
    }

    async addToWishList(uid, propertyId) {
        return await UserRepository.addToWishList(uid, propertyId);
    }

    async removeFromWishList(uid, propertyId) {
        return await UserRepository.removeFromWishList(uid, propertyId);
    }
}

module.exports = UserService;
