const axios = require('axios')
const cheerio = require('cheerio')
const download = require('image-downloader');
const fs = require('fs');
const { Parser } = require('json2csv');
const nData = [];
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
        console.error(error);
      }

      async function Main(url){
          const res = await axios.get(url);
          const $ = cheerio.load(res.data);



          const title = $('.product-title').text();
          const subtitle = $('.prod-content h2').text();
          const descripition = $('.prod-content > p').text();
          const price = $('#pricecalc').text();
            const imageUrl = $('.flex-viewport a').attr('href');

            try {
                nData.push({
                    title,
                    subtitle,
                    descripition,
                    price,
                    imageUrl,
                   
                })
                        const parser = new Parser
                        const csv = parser.parse(nData);
                        fs.writeFileSync(`./${title}.csv`, csv,'utf-8')
                        console.log(csv);
            } catch(error){
                console.log(`Error's : ${error}`)
            }

        //    await  imageDownloader(imageUrl,title)
      }

      async function imageDownloader(imageUrl, pname){
        // const imgPath = fs.mkdir(`images/${pname}`, function(err) {
        //     if (err) {
        //       console.log(err)
        //     } else {
        //       console.log(`${pname } Directory Created Successfully`)
        //     }
        //   })
        const options = {
            url: imageUrl,
            dest: './images/'                // will be saved to /path/to/dest/image.jpg
          }
          
         await  download.image(options)
            .then(({ filename }) => {
              console.log(' %c Saved to','color: red', filename)  // saved to /path/to/dest/image.jpg
            })
            .catch((err) => console.error(err))

      }
      
    }
  
    Scrapper();

   

   