'use strict';

/**
 *Performs all necessary CRUD that our routes may want.
 */
class Collection {
  constructor(app, model) {
    this.model = model; // creates reference to the SQL model right?
    this.associations = new Map(); // our Map structure for a many-to-many relationship.
    this.setupRoutes(app, model.name);
  }

  async create(obj, options) {
    // create the new model
    let data = await this.model.create(obj);

    if (options) {
      if (options.association) this.createAssociate(data, options.association);
    }
    return data;
  }

  async read(id) {
    let options = { include: [...this.associations.keys()] };
    let datas = null;

    if (id) {
      options['where'] = { id };
      datas = await this.model.findOne(options);
    } else {
      datas = await this.model.findAll(options);
    }

    return datas;
  }

  async update(id, obj) {
    if (!id) throw new Error('No data id provided');

    let data = await this.model.findOne({ where: { id } });
    let updatedData = await data.update(obj);
    return updatedData;
  }

  async delete(id) {
    if (!id) throw new Error('No data ID provided');

    let deletedData = await this.model.destroy({ where: { id } });
    return deletedData;
  }

  belongsToManyThrough(collection, model) {
    this.model.belongsToMany(collection.model, { through: model });
    this.associations.set(collection.model, model);
  }

  /**
   * Creates join table for data
   * @param {Sequelize Model Instance} - data
   * @param {Object<id INT, Sequelize Model>} - association
   *  */
  async createAssociate(data, association) {
    // check if the association collection model is contained within the associations Map.
    if (!this.associations.has(association.collection.model)) {
      throw new Error('No association found for specified collection');
    }
    let associatedModel = this.associations.get(association.collection.model);
    let associatedModelData = await associatedModel.create({
      [`${this.model.name}Id`]: data.id,
      [`${association.collection.model.name}Id`]: association.id,
    });
    return associatedModelData;
  }
  setupRoutes(app) {
    app.get();
  }
}

module.exports = Collection;
