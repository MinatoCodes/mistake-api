import { createCanvas, loadImage } from "@napi-rs/canvas";
import axios from "axios";

export default async function handler(req, res) {
  const { avatar } = req.query;

  if (!avatar) {
    return res.status(400).json({ error: "Missing avatar URL" });
  }

  try {
    // Load background template
    const template = await loadImage("https://i.ibb.co/TM52kYGr/image.jpg");

    // Load avatar image from URL
    const avatarResp = await axios.get(avatar, { responseType: "arraybuffer" });
    const avatarImg = await loadImage(Buffer.from(avatarResp.data));

    // Create canvas
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(template, 0, 0);

    // Draw avatar in the center
    const avatarSize = 250;
    const x = (canvas.width - avatarSize) / 2;
    const y = canvas.height - avatarSize - 30;
    ctx.drawImage(avatarImg, x, y, avatarSize, avatarSize);

    // Output PNG
    res.setHeader("Content-Type", "image/png");
    const buffer = await canvas.encode("png"); // @napi-rs/canvas uses encode()
    return res.send(buffer);
  } catch (err) {
    console.error("Canvas error:", err);
    return res.status(500).json({ error: "Error generating image" });
  }
}
  
