const axios = require('axios')
const cheerio = require('cheerio')
const download = require('image-downloader');
const fs = require('fs');
const { Parser } = require('json2csv');
 const { Attributes,  Attribute1 ,Attribute2 ,Attribute3 ,Attribute4 ,Attribute5 ,Attribute6 ,Attribute7 ,Attribute8 ,Attribute9 ,Attribute10,Attribute11 } = require('./Variants')

 

let nData = [];
let ID;
let Type = 'variable';
let Name;
let SKU;
let Size = [];
let Shortdescription;
let price;
let Published = 1;
let isFeatured = 0;
let Visibilityincatalogue = 'visible';
let Description = '';
let shortDescription;
let Datesalepriceends ;
let Taxstatus ='taxable' ;
let Taxclass ;
let Instock = 1;
let Stock ;
let LowStockAmount ;
let BackordersAllowed = 0;
let SoldIndividually;
let WeightKG;
let LengthCM;
let WidthCM;
let HeightCM;
let AllowCustomerReviews =1;
let PurchaseNote;
let SalePrice;
let RegularPrice;
let Categories;
let Tags;
let ShippingClass;
let Image;
let Position = 0;
let imageUrl;
let SoldIndividuall = 0;
// 


async function Scrapper(){
    try {
        const response = await axios.get('https://cheapasprints.com/shop/business-stationery-printing/business-cards/');
        const $ = await  cheerio.load(response.data);


        // $('.cat-products').map( async (index, ele) => {
        //    const url =  $(ele).find('a').attr('href')
        //    await Main(url)
        // })
          Categories = $('.category-content > h1').text()
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



        let Name =  await $('.product-title').text();
        let Shortdescription =  await $('.prod-content').text().trim();
        let shortDescription = await $('.woocommerce-product-details__short-description').text().trim();
        let Description =  await $('.spoints').text();
        let price = await $('#order-price').text()
        let imageUrl = await $('.woocommerce-product-gallery ').find('img').attr('src');
        
        
        await variants(url);
        _attributes = [Attribute1 ,Attribute2 ,Attribute3 ,Attribute4 ,Attribute5 ,Attribute6 ,Attribute7 ,Attribute8 ,Attribute9 ,Attribute10, Attribute11]
        try {
            rowData =  {
              "ID":ID,
              "Type":Type,
              "SKU":SKU,
              "Name":Name,
              "Published":Published,
              "Is featured?":isFeatured,
              "Visibility in catalogue":Visibilityincatalogue,
              "Short description":Shortdescription,
              "Description":Description,
              "Date sale price starts":Datesalepriceends,
              "Tax status":Taxstatus,
              "Tax class":Taxclass,
              "In stock?":Instock,
              "Stock":Stock,
              "Low stock amount":LowStockAmount,
              "Backorders allowed?":BackordersAllowed  ,
              "Sold individually?":SoldIndividuall,
              WeightKG,
              LengthCM,
              WidthCM,
              HeightCM,
              "Allow customer reviews?":AllowCustomerReviews,
              "Purchase note":PurchaseNote,
              "Sale price":price,
              "Regular price":price,
              "Categories":Categories,
              "Tags":Tags,
              ShippingClass,
              "Position":Position  ,
              "Images":imageUrl,
            }
            
            // "Attribute 1 name":attributeName,
            // "Attribute 1 value(s)":attributeValue,
            // "Attribute 1 visible":AttributeVisible,
            // "Attribute 1 global": AttributeGlobal,
            _attributes.forEach((_item,_index)=>{
                let {  attributeName , attributeValue , AttributeVisible , AttributeGlobal } = Attributes(_item)
                _attribute_index = "Attribute "+(_index+1)
                AttributeVisible = 1;
                AttributeGlobal=1;
                if(attributeName=="kashan"){
                    attributeName = ""
                    attributeValue = ""
                    AttributeGlobal=""
                    AttributeVisible = false
                }
                rowData[_attribute_index+" name"] = attributeName
                rowData[_attribute_index+" value(s)"] = attributeValue
                rowData[_attribute_index+" visible"] = AttributeVisible
                rowData[_attribute_index+" global"] = AttributeGlobal
            })
            nData.push(rowData);
              
          // Create  a  folder for each product 
            
            const parser = new Parser
            const csv = parser.parse(nData );
          fs.writeFileSync('productsData.csv', csv, 'utf-8');
          // await  imageDownloader(imageUrl,imgPath)
            console.log(csv);
          } catch(error){
            console.log(`Error's : ${error}`)
          }
      

          
      }

     
 

  // Function to get Variations of a product from
  async function variants(url) {
    const res = await axios.get(url);
   const $ = cheerio.load(res.data);
   
   $('#tm-epo-field-1 > div > .cpf_hide_element ').map(async (index, ele) => {
     const variants = $(ele).find($('.tm-epo-field-label')).text();
     const value = $(ele).find($('.tmcp-field')).text();
    
     if (variants === 'Size') {
      let size= $(ele).find($('.tmcp-field'));
      Attribute1.AttributeName = variants;
      // console.log(`Name is : ${Attribute1.AttributeName}`)
     let options = $(size).find('.tc-multiple-option');
     options.map( async (i,e) => {
       const attribute1 = $(e).text();
       Attribute1.AttributeValues.push(attribute1);
     })
       // console.log(`Size attributes are  is : ${ Attribute1.AttributeValues}`)

     } else if (variants === 'Material') {
     let  material= $(ele).find($('.tmcp-field'));
      Attribute2.AttributeName= variants;
      // console.log(`Name is : ${Attribute2.AttributeName }`)
     let options = $(material).find('.tc-multiple-option');
     options.map( async (i,e) => {
       const attribute2 = $(e).text();
       Attribute2.AttributeValues.push(attribute2);
     })
       // console.log(`material attributes are  is : ${ Attribute2.AttributeValues}`)
     } else if (variants === 'Print Options') {
     let  printOptions= $(ele).find($('.tmcp-field'));
      Attribute3.AttributeName = variants;
      // console.log(`Name is : ${Attribute3.AttributeName }`)
     let options = $(printOptions).find('.tc-multiple-option');
     options.map( async (i,e) => {
       const attribute3 = $(e).text();
       Attribute3.AttributeValues.push(attribute3);
     })
       // console.log(`printOptions attributes are  is : ${ Attribute3.AttributeValues}`)
     } else if (variants === 'Lamination') {
      let laminations= $(ele).find($('.tmcp-field'));
      Attribute4.AttributeName = variants;
      // console.log(`Name is : ${Attribute4.AttributeName }`)
     let options = $(laminations).find('.tc-multiple-option');
     options.map( async (i,e) => {
       const attribute4 = $(e).text();
       Attribute4.AttributeValues.push(attribute4);
     })
       // console.log(`laminations attributes are  is : ${ Attribute4.AttributeValues}`)
     } else if (variants === 'Artwork') {
      let artwork= $(ele).find($('.tmcp-field'));
      Attribute5.AttributeName = variants;
      // console.log(`Name is : ${Attribute5.AttributeName }`)
     let options = $(artwork).find('.tc-multiple-option');
     options.map( async (i,e) => {
       const attribute5 = $(e).text();
       Attribute5.AttributeValues.push(attribute5);
     })
       // console.log(`artwork attributes are  is : ${ Attribute5.AttributeValues}`)
     } else if (variants === 'PDF Proof') {
      let pdfProof= $(ele).find($('.tmcp-field'));
      Attribute6.AttributeName = variants;
      // console.log(`Name is : ${Attribute6.AttributeName }`)
     let options = $(pdfProof).find('.tc-multiple-option');
     options.map( async (i,e) => {
       const attribute6 = $(e).text();
       Attribute6.AttributeValues.push(attribute6);
     })
       // console.log(`pdfProof attributes are  is : ${ Attribute6.AttributeValues}`)
     } else if (variants === 'Quantity') {
      let quantity= $(ele).find($('.tmcp-field'));
      Attribute7.AttributeName = variants;
      // console.log(`Name is : ${Attribute7.AttributeName }`)
     let options = $(quantity).find('.tc-multiple-option');
     options.map( async (i,e) => {
       const attribute7 = $(e).text();
       Attribute7.AttributeValues.push(attribute7);
     })
       // console.log(`quantity attributes are  is : ${ Attribute7.AttributeValues}`)
     } else if (variants === 'Delivery') {
      let delievery= $(ele).find($('.tmcp-field'));
      Attribute8.AttributeName = variants;
      // console.log(`Name is : ${Attribute8.AttributeName }`)
     let options = $(delievery).find('.tc-multiple-option');
     options.map( async (i,e) => {
       const attribute8 = $(e).text();
       Attribute8.AttributeValues.push(attribute8);
     })
       // console.log(`delievery attributes are  is : ${ Attribute8.AttributeValues}`)
     } else if (variants === 'Colour') {
      let color = $(ele).find($('.tmcp-field'));
      Attribute9.AttributeName = variants;
      // console.log(`Name is : ${Attribute9.AttributeName }`)
     let options = $(color).find('.tc-multiple-option');
     options.map( async (i,e) => {
       const attribute9 = $(e).text();
       Attribute9.AttributeValues.push(attribute9);
     })
       // console.log(`color  attributes are  is : ${ Attribute9.AttributeValues}`)
     } else if (variants === 'Graphics') {
     let  graphic= $(ele).find($('.tmcp-field'));
      Attribute10.AttributeName = variants;
      // console.log(`Name is : ${Attribute10.AttributeName }`)
     let options = $(graphic).find('.tc-multiple-option');
     options.map( async (i,e) => {
       const attribute10 = $(e).text();
       Attribute10.AttributeValues.push(attribute10);
     })
       // console.log(`graphic attributes are  is : ${ Attribute10.AttributeValues}`)
     }
     else if (variants === 'Corners') {
     let  corners= $(ele).find($('.tmcp-field'));
      Attribute11.AttributeName = variants;
      // console.log(`Name is : ${Attribute11.AttributeName }`)
     let options = $(corners).find('.tc-multiple-option');
     options.map( async (i,e) => {
       const attribute11 = $(e).text();
       Attribute11.AttributeValues.push(attribute11);
     })
       // console.log(`graphic attributes are  is : ${ Attribute10.AttributeValues}`)
     }

   })

 }
};
  
    Scrapper();