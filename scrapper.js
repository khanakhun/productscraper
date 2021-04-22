const axios = require('axios')
const cheerio = require('cheerio')
const download = require('image-downloader');
const fs = require('fs');
const { Parser } = require('json2csv');
const nData = [];

let size = '';
let material = '';
let printOptions = '';
let laminations = '';
let artwork = '';
let pdfProof = '';
let quantity = '';
let delievery = '';
let graphics = '';
let color = '';

async function Scrapper(){
    try {
        const response = await axios.get('https://cheapasprints.com/shop/signage-printing/pavement-signs-and-a-boards/');
        const $ = await  cheerio.load(response.data);


        // $('.cat-products').map( async (index, ele) => {
        //    const url =  $(ele).find('a').attr('href')
        //    await Main(url)
        // })

        $('.cat-products li').map(async (index,element)=>{
            const url = await $(element).find('a').attr('href');
            console.log(url)
            await Main(url)
        })
      } catch (error) {
        console.error(`Error occured at : ${error}`);
      }

      async function Main(url){
        const res = await axios.get(url);
        const $ = await cheerio.load(res.data);



        const title =  await $('.product-title').text();
        const subtitle =  await $('.prod-content h2').text();
        const descripition = await $('.prod-content > p').text();
        const price = await $('#order-price').text()
        const imageUrl = await $('.woocommerce-product-gallery ').find('img').attr('src');
        
        await variants(url);


        try {
              const imgPath = fs.mkdirSync(`./products/${title}`, {recursive: true}, function(err) {
              if (err) {
                console.log(err)
              } else {
              console.log(`${title} Directory Created Successfully`)
            }
          })
                nData.push({
                  title,
                  subtitle,
                  price,
                  descripition,
                  imageUrl,
                  size,
                  material,
                  printOptions,
                  laminations,
                  artwork,
                  pdfProof,
                  quantity,
                  delievery,
                  color,
                  graphics
                   
                })
              
          // Create  a  folder for each product 
             
            const parser = new Parser
            const csv = parser.parse(nData);
          fs.writeFileSync(`${imgPath}/${title}.csv`, csv, 'utf-8');
          await  imageDownloader(imageUrl,imgPath)
            console.log(csv);
          } catch(error){
            console.log(`Error's : ${error}`)
          }
      

          
      }

      async function imageDownloader(imageUrl,imgPath){
       
        const options = {
            url: imageUrl,
            dest: imgPath               // will be saved to /path/to/dest/image.jpg
          }
          
         await  download.image(options)
            .then(({ filename }) => {
              console.log(' %c Saved to','color: red', filename)  // saved to /path/to/dest/image.jpg
            })
            .catch((err) => console.error(err))

      }
  // Main Scrapper Executes
  Main()
  

  // Function to get Variations of a product from
  async function variants(url) {
     const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    
    $('#tm-epo-field-1 > div > .cpf_hide_element ').map(async (index, ele) => {
      
      
      const variants = $(ele).find($('.tm-epo-field-label')).text();
      const value = $(ele).find($('.tmcp-field')).text();
      console.log(variants)
      if (variants === 'Size') {
        size = $(ele).find($('.tmcp-field')).text().trim();
        console.log(`Size is : ${size}`)
      } else if (variants === 'Material') {
        material = $(ele).find($('.tmcp-field')).text().trim();
        console.log(`material is : ${material}`)
      } else if (variants === 'Print Options') {
        printOptions = $(ele).find($('.tmcp-field')).text().trim();
        console.log(`printOptions is : ${printOptions}`)
      } else if (variants === 'Lamination') {
        laminations = $(ele).find($('.tmcp-field')).text().trim();
        console.log(`Lamination is : ${laminations}`)
      } else if (variants === 'Artwork') {
        artwork = $(ele).find($('.tmcp-field')).text().trim();
        console.log(`Artwork is : ${artwork}`)
      } else if (variants === 'PDF Proof') {
        pdfProof = $(ele).find($('.tmcp-field')).text().trim();
        console.log(`pdfProof is : ${pdfProof}`)
      } else if (variants === 'Quantity') {
        quantity = $(ele).find($('.tmcp-field')).text().trim();
        console.log(`quantity is : ${quantity}`)
      } else if (variants === 'Delivery') {
        delievery = $(ele).find($('.tmcp-field')).text().trim();
        console.log(`delievery is : ${delievery}`)
      } else if (variants === 'Colour') {
        color = $(ele).find($('.tmcp-field')).text().trim();
        console.log(`color is : ${color}`)
      } else if (variants === 'Graphics') {
        graphics = $(ele).find($('.tmcp-field')).text().trim();
        console.log(`graphics is : ${graphics}`)
      }

    })

  }

};
  
    Scrapper();
