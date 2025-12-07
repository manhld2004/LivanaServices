class User {
    constructor(data) {
        this.id = data.id;
        this.fullname = data.fullname;
        this.email = data.email;
        this.avatar = data.avatar || null;
        this.role = data.role;
        this.cart = data.cart || [];
        this.wish_list = data.wish_list || [];
        this.renting_history = data.renting_history || [];
        this.recent_list = data.recent_list || [];
        this.created_at = data.created_at || new Date();
    }
}

module.exports = User;
