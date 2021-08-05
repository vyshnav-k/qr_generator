const QRCode = require("qrcode");
const fs = require("fs")
const csv= require("csv-parser")
const { createCanvas, loadImage } = require("canvas");
const jsonData= {
    "image":"./bowl.jpg",
"qr_x":100,
"qr_y":100,
"qr_h":80,
"qr_w":150,
"qr_link":"https://upzak.com/",
"text_x":20,
"text_y":20,
"text":"qr",
"bg_w":250,
"bg_h":150,
"text_width":100

}
async function create(dataForQRcode, center_image, width, height,text) {
 
  
  const canvas = createCanvas(width, height);
  QRCode.toCanvas(
    canvas,
    dataForQRcode,
    {
      errorCorrectionLevel: "H",
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    width:width,
    height:height
    }
  );


  const ctx = canvas.getContext("2d");
  const img = await loadImage(center_image);
  
  const center = (width - height) / 2;
  ctx.drawImage(img, center, center,height, height);
  const buffer = canvas.toBuffer('image/png')
  const canvas2= createCanvas(jsonData.bg_w,jsonData.bg_h)
 
  const at= canvas2.getContext("2d")
  
  const img2= await loadImage(buffer)
  at.drawImage(img, 0,0,jsonData.bg_w,jsonData.bg_h);
  at.font = '50px serif';
at.fillText(text, jsonData.text_x, jsonData.text_y, jsonData.text_width);

  at.drawImage(img2,0, 0, jsonData.qr_w, jsonData.qr_h);
 const buffer2= canvas2.toBuffer('image/png')


  fs.writeFileSync(`./images/${Date.now()}.jpg`, buffer2)
  return



}

async function main() {
  const results= []
 fs.createReadStream('sample-data.csv')
  .pipe(csv({

  }))
  .on('data',(data)=>
     results.push(data))
     .on("end",()=>{
   
   
  
       results.map(async(e)=>{
     console.log(e);
        const qrCode = await create(
          jsonData.qr_link+e.Link,
          jsonData.image,
         jsonData.qr_w,
         jsonData.qr_h,
         e.Text
        );
       })
    
     })
  
 

  
}


main();