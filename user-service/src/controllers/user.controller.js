const UserService = require('../services/user.service');
const userService = new UserService();

class UserController {
    async createUser(req, res) {
        try {
            const { uid, data } = req.body;
            const result = await userService.createUser(uid, data);
            res.status(201).json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getUser(req, res) {
        try {
            const uid = req.params.id;
            const user = await userService.getUserById(uid);
            res.json(user);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }

    async updateAvatar(req, res) {
        try {
            const uid = req.params.id;
            const { avatarUrl } = req.body;
            await userService.updateAvatar(uid, avatarUrl);
            res.json({ message: "Avatar updated" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = new UserController();
