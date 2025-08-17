import { createCanvas, loadImage } from "canvas";
import axios from "axios";

export default async function handler(req, res) {
  const { avatar } = req.query;
  if (!avatar) {
    return res.status(400).json({ error: "Missing avatar URL" });
  }

  try {
    // Load base template
    const template = await loadImage("https://i.ibb.co/TM52kYGr/image.jpg");

    // Load avatar from URL
    const avatarResp = await axios.get(avatar, { responseType: "arraybuffer" });
    const avatarImg = await loadImage(Buffer.from(avatarResp.data, "binary"));

    // Create canvas
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    // Draw background template
    ctx.drawImage(template, 0, 0);

    // Avatar placement
    const avatarSize = 250; // adjust
    const x = (canvas.width - avatarSize) / 2;
    const y = canvas.height - avatarSize - 30;

    // Draw avatar as square
    ctx.drawImage(avatarImg, x, y, avatarSize, avatarSize);

    // Output image
    res.setHeader("Content-Type", "image/png");
    return res.send(canvas.toBuffer("image/png"));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error generating image" });
  }
}
