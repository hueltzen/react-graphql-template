const fs = require("fs");
const path = require("path");
const os = require("os");
const { AuthenticationError } = require("apollo-server");

const checkAuth = require("../../utils/checkAuth");
const File = require("../../models/File");

module.exports = {
  Query: {
    async getFiles(_, __, context) {
      const user = checkAuth(context);

      try {
        const files = await File.find();

        console.log(files);

        return files;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async singleUpload(parent, { file }, context) {
      const user = checkAuth(context);

      console.log(file);

      try {
        const { createReadStream, filename, mimetype, encoding } = await file;

        console.log(createReadStream);

        const stream = createReadStream();
        const pathName = path.join(
          os.homedir(),
          `/.duality/public/uploads/${filename}`
        );
        await stream.pipe(fs.createWriteStream(pathName));

        const newFile = new File({
          path: filename,
          mimetype: mimetype,
          encoding: encoding,
        });

        const savedFile = await newFile.save();

        console.log(savedFile);

        return savedFile;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
