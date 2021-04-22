const request = require("request-promise");
const cheerio = require("cheerio");
const { Parser } = require("json2csv");
const fs = require("fs");
let url = "https://www.loopnet.com/biz/businesses-for-sale";
let results = {};
let nData = [];

let AskingPrice = "";
let CashFlow = "";
let GrossRevenue = "";
let Rent = "";
let Inventory = "";
let EstablishedYear = "";
let FFE = "";
let EBITDA = "";

let baseURL =
  "https://www.loopnet.com/biz/businesses-for-sale?q=bGM9SmtjOU1UQW1RejFWVXc9PQ%3D%3D";
(async () => {
  const res = await request.get(baseURL);
  const $ = await cheerio.load(res);
  const pagination = $(
    "#top > section > main > section > app-root > app-search-results > div > div > section.links.ng-star-inserted > div > app-listings-pagination > div > pagination-template > ul > li:nth-child(8) > a > span"
  ).text();

  for (index = 0; index <= pagination; index++) {
    const result = await request.get(`${baseURL}/${index}`);
    const $ = await cheerio.load(result);
    $(".pointer").each(async function () {
      jobArray = $(this).attr("href");

      await Scrapper(`https://www.loopnet.com/${jobArray}`);
    });
  }

  jobArray = $(this).attr("href");

  async function Scrapper(url) {
    const res = await request.get(url);
    const $ = await cheerio.load(res);

    const title = $(".listingDetailHeading").text();
    const location = $(".listingDetailHeadRegion ").text();
    const descripition = $(".descriptionAd ").text();
    const sellerName = $(".seller-name-no-image").text();
    const brokerCompany = $(".broker-company-information ").text();
    const contact = $("ln-icon-phone-filled").text();
    const tbody1 = $(
      "#imageCon > app-listing-detail-presentation > div > div.col-12.col-parent.mobile-col-6.pricing.text-light > div.col-6.col-parent.mobile-col-6 > table > tbody"
    );
    const tbody2 = $(
      "#imageCon > app-listing-detail-presentation > div > div.col-12.col-parent.mobile-col-6.pricing.text-light > div.col-6.mobile-col-6.data-point > table > tbody"
    );

    tbody1.each(async (index, element) => {
      const lntt = element.children.length;

      for (let i = 0; i < lntt; i++) {
        const selector = $(element)
          .find(
            `tr:nth-child(${i}) td:nth-child(${1}) 
        \n`
          )
          .text();
        if (selector === "Asking Price:") {
          // console.log("asking Price is here");
          AskingPrice = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "Gross Revenue:") {
          GrossRevenue = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "Established Year:") {
          EstablishedYear = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "Rent:") {
          Rent = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "FF&E:") {
          FFE = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "Inventory:") {
          Inventory = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "EBITDA:") {
          EBITDA = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "Cash Flow:") {
          CashFlow = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        }
      }
    });

    // second tbody
    tbody2.each(async (index, element) => {
      const lntt = element.children.length;

      for (let i = 0; i < lntt; i++) {
        const selector = $(element)
          .find(
            `tr:nth-child(${i}) td:nth-child(${1}) 
        \n`
          )
          .text();
        if (selector === "Asking Price:") {
          // console.log("asking Price is here");
          AskingPrice = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "Gross Revenue:") {
          GrossRevenue = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "Established Year:") {
          EstablishedYear = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "Rent:") {
          Rent = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "FF&E:") {
          FFE = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "Inventory:") {
          Inventory = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "EBITDA:") {
          EBITDA = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        } else if (selector === "Cash Flow:") {
          CashFlow = $(element)
            .find(`tr:nth-child(${i})  td:nth-child(${2}) `)
            .text();
        }
      }
    });

    try {
      nData.push({
        title,
        location,
        AskingPrice,
        CashFlow,
        GrossRevenue,
        Rent,
        Inventory,
        EstablishedYear,
        FFE,
        EBITDA,
        descripition,
        brokerCompany,
        contact,
        sellerName,
        url,
      });
      const parser = new Parser();
      const csv = parser.parse(nData);
      fs.writeFileSync("./onlineBuissnessupdate.csv", csv, "utf-8");
      console.log(csv);
    } catch (err) {
      console.log(`Error : ${err}`);
    }
  }
})();