'use strict';

/**
 *Performs all necessary CRUD that our routes may want.
 */
class Collection {
  constructor(model, app) {
    this.model = model; // creates reference to the SQL model right?
    this.associations = new Map(); // our Map structure for a many-to-many relationship.
    this.setupRoutes(app);
  }

  async create(req, res) {
    // create the new model
    try {
      let data = await this.model.create(req.body);
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async read(req, res) {
    const options = { include: [...this.associations.keys()] };
    let datas = null;

    if (req.params.id) {
      options['where'] = { id: req.params.id };

      datas = await this.model.findOne(options);
    } else {
      datas = await this.model.findAll(options);
    }

    res.status(200).send(datas);
  }

  async update(req, res) {
    try {
      let data = await this.model.findOne({ where: { id: req.params.id } });
      let updatedData = await data.update(req.body);
      res.status(200).send(updatedData);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async delete(req, res) {
    try {
      const deleted = await this.model.destroy({
        where: { id: req.params.id },
      });
      if (!deleted) {
        res.status(404).send(`could not find id ${req.params.id}`);
      } else {
        res.status(200).send(`deleted id ${req.params.id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
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
    const routeName = this.model.name.toLowerCase();
    const requiresAccess = (allowedRoles) => {
      return (req, res, next) => {
        if (req.user && allowedRoles.includes(req.user.role)) {
          next();
        } else {
          let why = 'missing required roles for this action';
          if (req.user) {
            why += ', you are only a ' + req.user.role;
          }
          res.status(403).send(why);
        }
      };
    };
    //C
    app.post(
      `/${routeName}`,
      requiresAccess(['writer', 'editor', 'admin']),
      this.create.bind(this)
    );
    //R
    app.get(
      `/${routeName}`,
      requiresAccess(['user', 'writer', 'editor', 'admin']),
      this.read.bind(this)
    );
    app.get(
      `/${routeName}/:id`,
      requiresAccess(['user', 'writer', 'editor', 'admin']),
      this.read.bind(this)
    );
    //U
    app.put(
      `/${routeName}/:id`,
      requiresAccess(['editor', 'admin']),
      this.update.bind(this)
    );
    //D
    app.delete(
      `/${routeName}/:id`,
      requiresAccess(['admin']),
      this.delete.bind(this)
    );
  }
}

module.exports = Collection;
