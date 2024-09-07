const express = require('express');
const router = express.Router();
//modals 
const userModel = require('../models/userModel');
const postModel = require('../models/postModel');
const reelsModel = require('../models/reelsModel');
const https = require('https');
const cloudinary = require('cloudinary');

//to get random reels
router.get('/getReels',async (req,res) => {
  
  try {
    const totalReels = await reelsModel.countDocuments();//count total docs
    const sampleSize = totalReels < 10 ? totalReels : 10;
//get random reels
    const reels = await reelsModel.aggregate([
      { $sample: { size: sampleSize } }
    ]);

    res.json(reels);
  } catch (err) {
    console.error('Error fetching reels:', err);
    res.status(500).json({ error: 'Failed to fetch reels' });
  }
});

//to get ramdom posts
router.get('/getPosts',async (req,res) => {
  try {
    const totalPosts = await postModel.countDocuments();//count total docs
    const sampleSize = totalPosts < 10 ? totalReels : 10;
//get random reels
    const posts = await postModel.aggregate([
      { $sample: { size: sampleSize } }
    ]);

    res.json(posts);
  } catch (err) {
    console.error('Error fetching reels:', err);
    res.status(500).json({ error: 'Failed to fetch reels' });
  }
})
//to get random posts and users 
router.get('/getBoth',async (req,res) => {
  try {
    const reels = await reelsModel.countDocuments();
    const posts = await postModel.countDocuments();
    const totalPosts = reels + posts;
    if(totalPosts.size() < 20) {
      const Data1 = await postModel.aggregate([
        { $sample: {size:posts}}
      ])
      const Data2 = await reelsModel.aggregate([
        { $sample: {size:reels}}
      ])
      return res.json(Data1.concat(Data2));
    }else{
      const random = Math.random(0,20);
      const Data1 = await postModel.aggregate([
        { $sample: {size:random}}
      ])
      const Data2 = await reelsModel.aggregate([
        { $sample: {size:20-random}}
      ])
      return res.json(Data1.concat(Data2));
    }
    
  }
  catch(e) {
    console.log("error fetching data" + e.message);
    res.status(500).json({error: "error fetching data"})
  }
})
router.get('/stream-video/:video', (req, res) => {
  const videoPublicId = req.params.video;

  // Generate Cloudinary video URL
  const videoUrl = cloudinary.url(videoPublicId, { resource_type: 'video' });

  // Make an HTTPS request to stream the video
  https.get(videoUrl, (response) => {
    if (response.statusCode === 200) {
      // Set headers for streaming video content
      res.setHeader('Content-Type', 'video/mp4');

      // Pipe the response directly to the client
      response.pipe(res);
    } else {
      res.status(response.statusCode).send('Error retrieving video');
    }
  }).on('error', (err) => {
    res.status(500).json(err);
    console.error('Error streaming video:', err.message);
  });
});

module.exports = router;