const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const myUrl = "https://www.myhora.com/%E0%B8%AB%E0%B8%A7%E0%B8%A2/%E0%B8%87%E0%B8%A7%E0%B8%94-1-%E0%B8%AA%E0%B8%B4%E0%B8%87%E0%B8%AB%E0%B8%B2%E0%B8%84%E0%B8%A1-2565.aspx";

const rootUrl = "https://www.myhora.com/หวย/"
const contextPath = "งวด-1-สิงหาคม-2565";
const extName = ".aspx"

const fullList = {
    firstAward: [],
    three_prefix: [],
    three_suffix: [],
    two_suffix: [],
    secondAward: [],
    thirdAward: [],
    fourthAward: [],
    fifthAward: []
}

const listUpperPosition = [fullList.firstAward, fullList.three_prefix, fullList.three_suffix, fullList.two_suffix];
const listLowerPosition = [fullList.firstAward, fullList.secondAward, fullList.thirdAward, fullList.fourthAward, fullList.fifthAward];

async function processScrape(){
    try {
        // fullList.firstAward.push("test");
        // fullList.firstAward.push("oh my gosh");
        // listPosition[0].push("xxx");
        // listPosition[0].push("yyy");

        // console.log(fullList);
        console.log(encodeURI(rootUrl + contextPath + extName));

        //-- Fetch HTML
        const { data } = await axios.get(myUrl);

        const $ = cheerio.load(data);

        const item1 = $("div#main_lotto");
        var lowerRoundNum = 2;

        // console.log(data);
        // console.log(item1.find("div.lot-dr").children(".lot-dc.lotto-fxl.py-20").length);

        item1.find("div.lot-dr").children(".lot-dc.lotto-fxl.py-20").each(function(i, elm) {
            // console.log("-->" + i);
            console.log($(this).text().trim());
            if(i == 1 || i == 2) {
                var answ = $(this).text().trim().split(' ');
                answ.forEach(element => {
                    listUpperPosition[i].push(element.trim());
                });
            } else {
                listUpperPosition[i].push($(this).text().trim());
            }
            
        })
        
        item1.find("div.lot-c100").each(function(i, elm) {
            // console.log("================= รางวัลที่ " + roundNum + " =================");
            $(this).find(".lot-dc.lotto-fx.lot-c20").each(function(j, el) {
                // console.log($(this).text());
                listLowerPosition[lowerRoundNum-1].push($(this).text().trim());
            })
            lowerRoundNum += 1;
        })

        fullList.secondAward.sort();
        fullList.thirdAward.sort();
        fullList.fourthAward.sort();
        fullList.fifthAward.sort();

        console.log(fullList);

        writeJSON(fullList);
    } catch(err) {
        console.log(err);
    }
}

function writeJSON(data) {
    fs.writeFile("./list/" + contextPath + ".json", JSON.stringify(data, null, 2), (err) => {
        if(err) {
            console.log(err);
            return;
        }

        console.log("Write File Completed!");
    })
}

processScrape();