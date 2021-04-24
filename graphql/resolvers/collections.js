const { AuthenticationError } = require("apollo-server");

const checkAuth = require("../../utils/checkAuth");
const Collection = require("../../models/Collection");
const File = require("../../models/File");

module.exports = {
  Query: {
    async getCollections(_, __, context) {
      const user = checkAuth(context);

      try {
        const collections = await Collection.find()
          .populate("user")
          .sort({ name: -1 });
        return collections;
      } catch (error) {
        throw new Error(error);
      }
    },

    async getCollection(_, { collectionId }, context) {
      const user = checkAuth(context);

      try {
        let collection = await Collection.findById(collectionId).populate(
          "user"
        );

        // collection = await collection.toObject();

        console.log(collection);

        collection.blocks = await Promise.all(
          collection.blocks.map(async (block) => {
            block.elements = await Promise.all(
              block.elements.map(async (element) => {
                if (element.represents === "image") {
                  const data = JSON.parse(element.data);
                  const file = await File.findById(data.file);
                  element.data = JSON.stringify(file);
                }
                return element;
              })
            );
            return block;
          })
        );

        if (collection) {
          return collection;
        }

        throw new Error("Collection not found.");
      } catch (error) {
        throw new Error(error);
      }
    },

    async getBlock(_, { collectionId, blockId }, context) {
      const user = checkAuth(context);

      try {
        const collection = await Collection.findById(collectionId).populate(
          "user"
        );

        if (!collection) {
          throw new Error("Collection not found.");
        }
        const block = collection.blocks.filter((block) => block.id === blockId);
        if (block.length < 1) {
          throw new Error("Block not found.");
        }

        return block[0];
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createCollection(
      _,
      { collectionInput: { name, identifier, root } },
      context
    ) {
      const user = checkAuth(context);

      const newCollection = new Collection({
        name: name,
        identifier: identifier,
        root: root,
        user: user.id,
        blocks: [],
      });

      let collection = await newCollection.save();
      collection = await Collection.populate(collection, "user");

      return collection;
    },

    async createBlock(
      _,
      { collectionId, blockInput: { name, identifier, data } },
      context
    ) {
      const user = checkAuth(context);

      try {
        const existingCollection = await Collection.findById(collectionId);

        existingCollection.blocks.push({
          name,
          identifier,
          data,
          elements: [],
        });

        let collection = await existingCollection.save();
        collection = await Collection.populate(collection, "user");

        return collection;
      } catch (error) {
        throw new Error(error);
      }
    },

    async createElement(
      _,
      {
        collectionId,
        blockId,
        elementInput: { name, identifier, represents, data },
      },
      context
    ) {
      const user = checkAuth(context);

      try {
        const existingCollection = await Collection.findById(collectionId);

        existingCollection.blocks = existingCollection.blocks.map((block) => {
          if (block.id === blockId) {
            block.elements.push({
              name,
              identifier,
              represents,
              data,
            });
          }

          return block;
        });

        let collection = await existingCollection.save();
        collection = await Collection.populate(collection, "user");

        return collection;
      } catch (error) {
        throw new Error(error);
      }
    },

    async editCollection(
      _,
      { collectionId, collectionInput: { name, identifier, root } },
      context
    ) {
      const user = checkAuth(context);

      try {
        const existingCollection = await Collection.findById(collectionId);

        existingCollection.name = name;
        existingCollection.identifier = identifier;
        existingCollection.root = root;

        let collection = await existingCollection.save();
        collection = await Collection.populate(collection, "user");

        return collection;
      } catch (error) {
        throw new Error(error);
      }
    },
    async editBlock(
      _,
      { collectionId, blockId, blockInput: { name, identifier, data } },
      context
    ) {
      const user = checkAuth(context);

      try {
        const existingCollection = await Collection.findById(collectionId);

        existingCollection.blocks = existingCollection.blocks.map((block) => {
          if (block.id === blockId) {
            block.name = name;
            block.identifier = identifier;
            block.data = data;
          }

          return block;
        });

        let collection = await existingCollection.save();
        collection = await Collection.populate(collection, "user");

        return collection;
      } catch (error) {
        throw new Error(error);
      }
    },
    async editElement(
      _,
      {
        collectionId,
        blockId,
        elementId,
        elementInput: { name, identifier, represents, data },
      },
      context
    ) {
      const user = checkAuth(context);

      try {
        const existingCollection = await Collection.findById(collectionId);

        existingCollection.blocks = existingCollection.blocks.map((block) => {
          if (block.id === blockId) {
            block.elements = block.elements.map((element) => {
              if (element.id === elementId) {
                element.name = name;
                element.identifier = identifier;
                element.represents = represents;
                element.data = data;
              }
              return element;
            });
          }

          return block;
        });

        let collection = await existingCollection.save();
        collection = await Collection.populate(collection, "user");

        return collection;
      } catch (error) {
        throw new Error(error);
      }
    },

    async deleteCollection(_, { collectionId }, context) {
      const user = checkAuth(context);

      try {
        await Collection.findByIdAndDelete(collectionId);

        return "Collection successfully deleted.";
      } catch (error) {
        throw new Error(error);
      }
    },
    async deleteBlock(_, { collectionId, blockId }, context) {
      const user = checkAuth(context);

      try {
        const existingCollection = await Collection.findById(collectionId);

        existingCollection.blocks = existingCollection.blocks.filter(
          (block) => {
            return block.id !== blockId;
          }
        );

        let collection = await existingCollection.save();
        collection = await Collection.populate(collection, "user");

        return collection;
      } catch (error) {
        throw new Error(error);
      }
    },
    async deleteElement(_, { collectionId, blockId, elementId }, context) {
      const user = checkAuth(context);

      try {
        const existingCollection = await Collection.findById(collectionId);

        existingCollection.blocks = existingCollection.blocks.map((block) => {
          if (block.id === blockId) {
            block.elements = block.elements.filter((element) => {
              return element.id !== elementId;
            });
          }
          return block;
        });

        let collection = await existingCollection.save();
        collection = await Collection.populate(collection, "user");

        return collection;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
