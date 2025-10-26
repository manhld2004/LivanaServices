class Property {
  constructor({
    id = null,
    title,
    description,
    price,
    location,
    images = [],
    hostId,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.location = location;
    this.images = images;
    this.hostId = hostId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Property;
