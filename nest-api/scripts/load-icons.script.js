const mainFolder = './28/';
const testFolder = './28_png/';
const fs = require('fs');
const Jimp = require('jimp');
const sharp = require("sharp")
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, GetObjectAclCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');
const replaceColor = require('replace-color')
let files = fs.readdirSync(testFolder);

for (let f of fs.readdirSync(mainFolder)) {
  sharp(mainFolder + f)
  .resize(300)
  .png()
  .toFile(testFolder + f.split('.')[0] + '.png')
}

files = files.filter(file => file.match(/.*outline.*/))
// console.log(files, files.length);


const s3 = new S3Client({
  endpoint: 'https://s3.timeweb.com',
  credentials: {
    accessKeyId: 'ce36416',
    secretAccessKey: '1234567890987654321q',
  },
  region: 'ru-1'
  });

async function save(path, buffer) {
    // try {
      // await s3.send(new PutObjectCommand({Bucket: '244a64f4-roadjedi', Key: path, Body: buffer, ContentType: 'image/svg+xml'}))
      await s3.send(new PutObjectCommand({Bucket: '244a64f4-roadjedi', Key: path, Body: buffer, ContentType: 'image/png'}))

      console.log(`saved ${path}`);

      return path;
    // } catch (error) {
    // console.error(`failed to save ${path}`);
    // console.error(error);
    // }
  }

// let testFiles = files.slice(0, 2);

for (let i of files) {
  console.log(i, fs.readFileSync(testFolder + i));
    save('/icons/28/png/' + i, fs.readFileSync(testFolder + i))
}
// for (let i of fs.readdirSync(mainFolder)) {
//   console.log(i, fs.readFileSync(mainFolder + i));
//     save('/icons/28/svg/' + i, fs.readFileSync(mainFolder + i))
// }
// for(let i of fs.readdirSync(testFolder)) {
    
//     console.log(i)
//     let b = async () => {
//       try {
//         await s3.send(new DeleteObjectCommand({Bucket: '244a64f4-roadjedi', Key: '/icons/28/png/' + i}))
//         console.log('delete', i)
//       } catch(error) {
//         console.log('failed to delete')
//       }
//       // const filesss = await s3.send(new ListObjectsCommand({Bucket: '244a64f4-roadjedi', Prefix: '/icons/28/png'}))
//       // console.log(filesss)
//     } 
//     b()
//     // break;
//   }
const a = async () => {
  // const files = await s3.send(new GetObjectCommand({Bucket: '244a64f4-roadjedi', Key: '/icons/28/folder_simple_lock_outline_28.svg'}))

  // console.log(files);
  // for(let i of files.Contents) {
  //   await s3.send(new DeleteObjectCommand({Bucket: '244a64f4-roadjedi', Key: i.Key}))
  // }
  const image = new Jimp(200, 200, '#000', () => { })
  const icon = await Jimp.read('https://244a64f4-roadjedi.s3.timeweb.com/icons/28/folder_simple_lock_outline_28.png');
  icon.color([{apply:'lighten', params: [100]}])
  icon.resize(100, 100)
  
  image.composite(icon, (100)/2, (100)/2)

  image.write('test.png')

}
// a()