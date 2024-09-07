const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const reelsModel = require("../models/reelsModel");
const postModel = require("../models/postModel");

const upload = require("../config/muterConfig");
const {
  cloudinaryConfig,
  placeFileInCloudinary,
  uploadVideoToCloudinary
} = require("../config/cloudinaryConfig");

cloudinaryConfig();

// Render the user page
router.get("/", async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.cookies.user });
    if (!user) {
      res.status(404).redirect("/error?code=404&message=User not Found");
      return;
    }
    res.render("user", {
      bio: user.bio,
      username: user.username,
      profile: user.profile || "",
    });
  } catch (error) {
    res.status(500).redirect("/error?code=500&message=Internal Server Error");
    return;
  }
});

// Render the edit info page with the user's current data
router.get("/editInfo", async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.cookies.user });
    if (!user) {
      res.status(404).redirect("/error?code=404&message=Error Finding user");
      return;
    }
    res.render("editInfo", {
      username: user.username,
      bio: user.bio,
      profile: user.profile || "",
    });
  } catch (err) {
    console.log(err);
    res.status(500).redirect("/error?code=500&message=Internal Server Error");
    return;
  }
});

router.get("/addInfo", (req, res) => {
  res.render("addPost");
});
// Handle the form submission for updating user information
/*to be resolved error ?? */
router.post("/editInfo", upload.single("image-input"), async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.cookies.user });
    console.log(req.body, req.file);
    if (!user) {
      res.status(404).redirect("/error?code=404&message=User not found");
      return;
    }

    if (req.file) {
      const url = await placeFileInCloudinary(req.file.path);
      user.profile = url;
    }

    if (req.body.bio) {
      user.bio = req.body.bio;
    }

    if (req.body.username) {
      user.username = req.body.username;
      res.cookie("user", req.body.username);
    }

    await user.save();
    res.render("user", {
      bio: user.bio,
      username: user.username,
      profile: user.profile || "",
    });
  } catch (err) {
    res.send(err);
    //res.status(500).redirect('/error?code=500&message=Internal Server Error');
    return;
  }
});

router.post('/addInfo', upload.single('media-input'), async (req, res) => {
  let file = req.file;

  try {
    const user = await userModel.findOne({ username: req.cookies.user });
    if (!user) {
      return res.status(404).redirect('/error?code=404&message=User Not Found');
    }
    console.log(req.body,req.file)
    if (!file) {
      return res.status(404).redirect('/error?code=404&message=No File Selected');
    }

    const mimeType = file.mimetype;
    let url;

    if (mimeType.startsWith('image/')) {
      url = await placeFileInCloudinary(file.path)
      
      user.posts.push(url);
      const newPost = new postModel({
        username: user.username,
        url: url,
        likes: 0,
      });
      await newPost.save();
    } else if (mimeType.startsWith('video/')) {
      url = await uploadVideoToCloudinary(file.path)
      if(!url) {
        return res.json("url is not present")
      }
      user.reels.push(url);
      const newReel = new reelsModel({
        username: user.username,
        url: url,
        likes: 0,
      });
      await newReel.save();
    } else {
      return res.status(400).redirect('/error?code=400&message=Invalid File Type');
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.send(err)
  }
});


module.exports = router;
