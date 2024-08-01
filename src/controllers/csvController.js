const uploadData = require('../models/datamodels');
const fs = require("fs");
const csv = require('csv-parser');


// Upload CSVfile details to mongodb
module.exports.uploader = async function (req, res) {
  const { filename, originalname, path, size } = req.file;
  const newUpload = {
    filename,
    originalname,
    path,
    size,
  };
  uploadData.create(newUpload)
    .then((createdUpload) => {
      console.log("Upload created:", createdUpload);
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Error creating upload:", error);
      res.redirect("/");
    });
}

//load homepage with all files present in db
module.exports.home = async function (req, res) {
  const searchVal = req.query.s;
  uploadData.find()
    .then((files) => {
      res.render("home", {
        title: "CSV Upload",
        files,
        searchVal
      });
    })
    .catch((err) => {
      console.log("Error Finding Files");
      res.redirect("/");
    });
}

//handle viewpage for specific selected CSV
module.exports.view = (req, res) => {
  const fileId = req.params.fileId;
  const searchQuery = req.query.q; // Get the search query from the URL query parameters

  //find file in db with id
  uploadData.findById(fileId)
    .then((file) => {
      if (!file) {
        return res.status(404).send("File not found");
      }

      const filePath = path.join(__dirname, '../../public/uploads', file.filename);

      // Check if the file exists before attempting to read it
      const fileExists = fs.existsSync(filePath);
      if (!fileExists) {
        console.error(`File not found at path: ${filePath}`);
        return res.status(404).send("File not found");
      }
//create an empty array and fills it wil csv data
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => {
          results.push(data);
        })
        .on("end", () => {
          if (results.length === 0) {
            return res.status(404).send("No data found in the CSV file");
          }

          const tableHeaders = Object.keys(results[0]);
          let tableRows = results;


          if (searchQuery) {
            // Filter the tableRows based on the search query
            tableRows = tableRows.filter((row) =>
              Object.values(row).some((value) =>
                value.toLowerCase().includes(searchQuery.toLowerCase())
              )
            );
          }

          res.render("view", {
            title: "CSV Viewer",
            file,
            tableHeaders,
            tableRows,
            searchQuery,
          });
        })
        .on("error", (error) => {
          console.error("CSV parsing error:", error);
          res.status(500).send("Error parsing CSV file");
        });
    })
    .catch((error) => {
      console.error("File retrieval error:", error);
      res.status(500).send("Internal Server Error");
    });
};
//handle deletion of CSV file
module.exports.delete = async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const file = await uploadData.findById(fileId); // Find the file by ID in the database

    if (!file) {
      return res.status(404).send("File not found");
    }

    // Remove the file from the file system
    const filePath = path.join(__dirname, '../../public/uploads', file.filename);
    fs.unlinkSync(filePath);

    // Remove the file from the database
    await uploadData.findByIdAndDelete(fileId);

    res.redirect("/");
  } catch (error) {
    console.error("File deletion error:", error);
    res.status(500).send("Internal Server Error");
  }
};
