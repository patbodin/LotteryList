const axios = require("axios");
const cheerio = require("cheerio");
const configDate = require('./config/config.json');
const utils = require('./utils');
const chalk = require('chalk');

class Lottery {
    constructor() {
        this.name = "";
        this.data = {
            firstAward: [],
            three_prefix: [],
            three_suffix: [],
            two_suffix: [],
            secondAward: [],
            thirdAward: [],
            fourthAward: [],
            fifthAward: []
        };
        // this.firstAward = [];
        // this.three_prefix = [];
        // this.three_suffix = [];
        // this.two_suffix = [];
        // this.secondAward = [];
        // this.thirdAward = [];
        // this.fourthAward = [];
        // this.fifthAward = [];
    }
    
}

async function processScrape(dateName, year){
    try {

        const fullList = new Lottery();

        //const listUpperPosition = [fullList.firstAward, fullList.three_prefix, fullList.three_suffix, fullList.two_suffix];
        //const listLowerPosition = [fullList.firstAward, fullList.secondAward, fullList.thirdAward, fullList.fourthAward, fullList.fifthAward];

        const listUpperPosition = [fullList.data.firstAward, fullList.data.three_prefix, fullList.data.three_suffix, fullList.data.two_suffix];
        const listLowerPosition = [fullList.data.secondAward, fullList.data.thirdAward, fullList.data.fourthAward, fullList.data.fifthAward];

        // const myUrl = "https://www.myhora.com/%E0%B8%AB%E0%B8%A7%E0%B8%A2/%E0%B8%87%E0%B8%A7%E0%B8%94-1-%E0%B8%AA%E0%B8%B4%E0%B8%87%E0%B8%AB%E0%B8%B2%E0%B8%84%E0%B8%A1-2565.aspx";

        const rootUrl = "https://www.myhora.com/lottery/"
        //const contextPath = "งวด-" + dateName + "-" + year;
        const contextPath = "result-" + utils.dateConvertTHNameToNumber(dateName) + "-" + year;
        const extName = ".aspx"

        const saveFileName = contextPath.replaceAll("result-", "").replaceAll("-", "_");

        //console.log("=====> " + contextPath);
        //console.log("=====> " + saveFileName);

        fullList.name = utils.generateInstallmentName(dateName + "-" + year);

        // let configDate = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'));
        // console.log(configDate.installmentList[0]);

        // fullList.firstAward.push("test");
        // fullList.firstAward.push("oh my gosh");
        // listPosition[0].push("xxx");
        // listPosition[0].push("yyy");

        // console.log(fullList);
        // console.log(encodeURI(rootUrl + contextPath + extName));

        //-- Fetch HTML
        // const { data } = await axios.get(myUrl);
        const { data } = await axios.get(encodeURI(rootUrl + contextPath + extName));

        const $ = cheerio.load(data);

        //-- Extract element
        const itemHTML = $("div#main_lotto");
        var lowerRoundNum = 0;

        // console.log(data);
        // console.log(item1.find("div.lot-dr").children(".lot-dc.lotto-fxl.py-20").length);

        itemHTML.find("div.lot-dr").children(".lot-dc.lotto-fxl.py-20").each(function(i, elm) {
            // console.log("-->" + i);
            // console.log($(this).text().trim());
            if(i == 1 || i == 2) {
                var answ = $(this).text().trim().split(' ');
                answ.forEach(element => {
                    listUpperPosition[i].push(element.trim());
                });
            } else {
                listUpperPosition[i].push($(this).text().trim());
            }
            
        })
        
        itemHTML.find("div#p_result2").children("div").children(".lot-c100").each(function(i, elm) {
             //console.log("================= รางวัลที่ " + roundNum + " =================");
            $(this).find(".lot-dc.lotto-fx.lot-c20").each(function(j, el) {
                //console.log($(this).text());
                listLowerPosition[lowerRoundNum].push($(this).text().trim());

            })
            lowerRoundNum += 1;
        })

        fullList.data.secondAward.sort();
        fullList.data.thirdAward.sort();
        fullList.data.fourthAward.sort();
        fullList.data.fifthAward.sort();

        // console.log(fullList);

        utils.writeJSON("งวด-" + utils.dateConversion(saveFileName, "TH", true), year, fullList);
        utils.writeFlatJSON("งวด-" + utils.dateConversion(saveFileName, "TH", true), year, fullList);
        console.log(chalk.green("-- " + contextPath + " DONE!" + " --"));
    } catch(err) {
        console.log(err);
    }
}

async function mainProc(myYear) {

    if(myYear != null) {

        var procJSON = utils.getElementJSON(myYear)
        // console.log(utils.getElementJSON(myYear));

        if(procJSON != undefined){
            for( j = 0; j < procJSON.installment.length; j++){
                await processScrape(procJSON.installment[j], procJSON.year);
            }
        } else {
            console.log("No element to process. Please check!");
        }
        
    } else {
        // console.log(configDate.installmentList.length);
        // console.log(configDate.installmentList[0].installment.length);
        for( i = 0; i < configDate.installmentList.length; i++) {
            for( j = 0; j < configDate.installmentList[i].installment.length; j++){
                // processScrape("1-สิงหาคม-2565");
                // console.log(configDate.installmentList[0].installment[i] + "-" + configDate.installmentList[0].year);
                await processScrape(configDate.installmentList[i].installment[j], configDate.installmentList[i].year);
            }
        }
    }
    
}

async function main(){

    const myArgs = process.argv.slice(2);
    console.log('myArgs: ', myArgs);

    if(myArgs.length == 0) {
        
        try {
            await mainProc();
        }
        catch(err) {
            console.log(err);
        }
    }
    else if(myArgs.length == 1) {
        try {
            await mainProc(parseInt(myArgs[0]));
        }
        catch(err) {
            console.log(err);
        }
    }
    else if(myArgs.length > 1) {
        // console.log("Under construction");

        // myArgs.forEach(element => mainProc(parseInt(element)));

        for (const element in myArgs) {
            // console.log(element);
            await mainProc(parseInt(myArgs[element]));
        }
    }
    else {
        console.log("Not support yet!");
    }
}

//-- Run main function
main();

