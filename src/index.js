
// Learn more about the SafeStream SDK here: https://github.com/shiftio/safestream-javascript-sdk#readme
import { SafeStream } from "@safestream/safestream-javascript-sdk";

// Learn more about VideoJS here: https://videojs.com/
import videojs from "video.js"

import "./styles.css";

//
// Step 1:
//
// Initialize SafeStream
//
// You can find you API credentials by logging into your SafeStream account
// at https:/admin.safestream.com and going to the "Manage API Keys" section
//
const safeStream = SafeStream({
  auth: {
    //
    // Keep these keys secret and safe. We recommend using environment variables and accessing
    // the keys via `process.env`. However, for simplicity sake in this example, we've hard coded them.
    //
    apiKey: "PASTE YOUR API KEY HERE",
    apiSecret: "PASTE YOUR API SECRET HERE"
  }
});

const renderWatermarkedVideo = () => {
    //
    // Step 2:
    //
    // Get video and watermarking template from SafeStream
    //
    // The video is the video that you'd like to watermark for your current viewer. 
    // Watermarking templates define how watermarks should look on your video. Your 
    // account comes with 3 templates. When you want to watermark a video you just 
    // need to tell SafeStream what data to hydrate the temaplte with.
    //
    const videoRequest = safeStream.getVideos().then(videos => videos[0]);
    const templateRequest = safeStream.getTemplates().then(templates => templates[0]);

    Promise.all([videoRequest, templateRequest]).then((result) => {
        const video = result[0]
        const template = result[1]
        
            //
            // Step 3:
            //
            // Get a watermarked stream of your video
            // 
            // IMPORTANT!!! - For development purposes it's perfectly fine to call `getStream()` 
            // in the browser. However, since everything in the browswer can be seen and modified 
            // by the user it's unsafe. In production you should call `getStream()` on your server.
            //
        safeStream.getStream(video.id, template.id, {
            UserData1: "Karol Fritz",
            UserData2: "karol@karolfritz.com",
            UserData3: "127.0.0.1"
        }).then(stream => {

            //
            // Step 4:
            //
            // Play the video
            // 
            // You can use any player you'd like. For this example we're using videojs.
            //
            const player = videojs("player", { autoplay: false, controls: true, poster: video.posterFrameUrl, fluid: true });
            player.src({ src: stream.containers.m3u8, type: "application/x-mpegURL" });
        });
        
    });
  
};

renderWatermarkedVideo();
