const configDate = require('./config/config.json');
const fs = require("fs");
const chalk = require('chalk');
const writeXlsxFile = require("write-excel-file/node");
const process = require("process");
const exceljs = require('exceljs');
const Enumerable = require('linq');
const { Console } = require('console');

function getElementJSON(myYear) {
    for(i = 0; i < configDate.installmentList.length; i++){
        if(configDate.installmentList[i].year == myYear){
            return configDate.installmentList[i];
        }
    }
    //-- Not working
    // configDate.installmentList.forEach(element => {
    //     if(element.year == myYear) {
    //         return element;
    //     }
    // });

    return undefined;
}

function writeJSON(filename, subdir, data) {
    var dir = "./list/" + subdir + "/";

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFile(dir + filename + ".json", JSON.stringify(data, null, 2), (err) => {
        if(err) {
            console.log(err);
            return;
        }

        console.log("Write File " + chalk.bold.blue("Completed!"));
    })
}

function writeFlatJSON(filename, subdir, fullList) {
    var dir = "./list/flat/" + subdir + "/";

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    const result = [];
    const myData = fullList.data;

    // แปลงให้เป็น flat array ในรูป { award_type, number, date }
    for (const [awardType, numbers] of Object.entries(myData)) {
    numbers.forEach((number) => {
        result.push({
        date: fullList.name,       // เช่น "1_4_2568"
        award_type: awardType,    // เช่น "firstAward"
        number: number            // เช่น "669687"
        });
    });
    }

    fs.writeFile(dir + filename + ".json", JSON.stringify(result, null, 2), (err) => {
        if(err) {
            console.log(err);
            return;
        }

        console.log("Write [Flat] File " + chalk.bold.yellow("Completed!"));
    })
}

function generateInstallmentName(fullDateTime){
    const monthList = {
        "มกราคม": {
            "monthNumber": 1,
            "monthENName": "January"
        },
        "กุมภาพันธ์": {
            "monthNumber": 2,
            "monthENName": "February"
        },
        "มีนาคม": {
            "monthNumber": 3,
            "monthENName": "March"
        },
        "เมษายน": {
            "monthNumber": 4,
            "monthENName": "April"
        },
        "พฤษภาคม": {
            "monthNumber": 5,
            "monthENName": "May"
        },
        "มิถุนายน": {
            "monthNumber": 6,
            "monthENName": "June"
        },
        "กรกฎาคม": {
            "monthNumber": 7,
            "monthENName": "July"
        },
        "สิงหาคม": {
            "monthNumber": 8,
            "monthENName": "August"
        },
        "กันยายน": {
            "monthNumber": 9,
            "monthENName": "September"
        },
        "ตุลาคม": {
            "monthNumber": 10,
            "monthENName": "October"
        },
        "พฤศจิกายน": {
            "monthNumber": 11,
            "monthENName": "November"
        },
        "ธันวาคม": {
            "monthNumber": 12,
            "monthENName": "December"
        }
    };

    const splittedDate = (fullDateTime + "").trim().split("-");

    // console.log("monthNo => " + monthList[splittedDate[1].trim()]["monthNumber"]);

    // console.log(splittedDate);
    
    return splittedDate[0] + "_" + monthList[splittedDate[1].trim()]["monthNumber"] + "_" + splittedDate[2];
}

function dateConvertTHNameToNumber(fullDateTime){
    const monthList = {
        "มกราคม": {
            "monthNumber": "01",
            "monthENName": "January"
        },
        "กุมภาพันธ์": {
            "monthNumber": "02",
            "monthENName": "February"
        },
        "มีนาคม": {
            "monthNumber": "03",
            "monthENName": "March"
        },
        "เมษายน": {
            "monthNumber": "04",
            "monthENName": "April"
        },
        "พฤษภาคม": {
            "monthNumber": "05",
            "monthENName": "May"
        },
        "มิถุนายน": {
            "monthNumber": "06",
            "monthENName": "June"
        },
        "กรกฎาคม": {
            "monthNumber": "07",
            "monthENName": "July"
        },
        "สิงหาคม": {
            "monthNumber": "08",
            "monthENName": "August"
        },
        "กันยายน": {
            "monthNumber": "09",
            "monthENName": "September"
        },
        "ตุลาคม": {
            "monthNumber": "10",
            "monthENName": "October"
        },
        "พฤศจิกายน": {
            "monthNumber": "11",
            "monthENName": "November"
        },
        "ธันวาคม": {
            "monthNumber": "12",
            "monthENName": "December"
        }
    };

    const splittedDate = (fullDateTime + "").trim().split("-");
    
    return splittedDate[0] + "-" + monthList[splittedDate[1].trim()]["monthNumber"];
}

function dateConversion(fullDateTime, lang, autoTextToNum=false){
    const monthList = {
        "1": {
            "monthTHName": "มกราคม",
            "monthENName": "January"
        },
        "2": {
            "monthTHName": "กุมภาพันธ์",
            "monthENName": "February"
        },
        "3": {
            "monthTHName": "มีนาคม",
            "monthENName": "March"
        },
        "4": {
            "monthTHName": "เมษายน",
            "monthENName": "April"
        },
        "5": {
            "monthTHName": "พฤษภาคม",
            "monthENName": "May"
        },
        "6": {
            "monthTHName": "มิถุนายน",
            "monthENName": "June"
        },
        "7": {
            "monthTHName": "กรกฎาคม",
            "monthENName": "July"
        },
        "8": {
            "monthTHName": "สิงหาคม",
            "monthENName": "August"
        },
        "9": {
            "monthTHName": "กันยายน",
            "monthENName": "September"
        },
        "10": {
            "monthTHName": "ตุลาคม",
            "monthENName": "October"
        },
        "11": {
            "monthTHName": "พฤศจิกายน",
            "monthENName": "November"
        },
        "12": {
            "monthTHName": "ธันวาคม",
            "monthENName": "December"
        }
    };

    const splittedDate = (fullDateTime + "").trim().split("_");

    let finalDate = "";
    if(autoTextToNum == false){
        if(String(lang).toUpperCase() == "TH") {
            finalDate = splittedDate[0] + "-" + monthList[splittedDate[1].trim()]["monthTHName"] + "-" + splittedDate[2];
        }
        else {
            finalDate = splittedDate[0] + "-" + monthList[splittedDate[1].trim()]["monthENName"] + "-" + (splittedDate[2]-543);
        }
    }
    else {
        if(String(lang).toUpperCase() == "TH") {
            finalDate = splittedDate[0] + "-" + monthList[Number(splittedDate[1].trim()) + ""]["monthTHName"] + "-" + splittedDate[2];
        }
        else {
            finalDate = splittedDate[0] + "-" + monthList[Number(splittedDate[1].trim()) + ""]["monthENName"] + "-" + (splittedDate[2]-543);
        }
    }
    
    
    return finalDate;
}

function findLotteryFile(fullDateTime){
    const monthList = {
        "1": {
            "monthTHName": "มกราคม",
            "monthENName": "January"
        },
        "2": {
            "monthTHName": "กุมภาพันธ์",
            "monthENName": "February"
        },
        "3": {
            "monthTHName": "มีนาคม",
            "monthENName": "March"
        },
        "4": {
            "monthTHName": "เมษายน",
            "monthENName": "April"
        },
        "5": {
            "monthTHName": "พฤษภาคม",
            "monthENName": "May"
        },
        "6": {
            "monthTHName": "มิถุนายน",
            "monthENName": "June"
        },
        "7": {
            "monthTHName": "กรกฎาคม",
            "monthENName": "July"
        },
        "8": {
            "monthTHName": "สิงหาคม",
            "monthENName": "August"
        },
        "9": {
            "monthTHName": "กันยายน",
            "monthENName": "September"
        },
        "10": {
            "monthTHName": "ตุลาคม",
            "monthENName": "October"
        },
        "11": {
            "monthTHName": "พฤศจิกายน",
            "monthENName": "November"
        },
        "12": {
            "monthTHName": "ธันวาคม",
            "monthENName": "December"
        }
    };

    const splittedDate = (fullDateTime + "").trim().split("_");

    const targetFile = "งวด-" + splittedDate[0] + "-" + monthList[splittedDate[1].trim()]["monthTHName"] + "-" + splittedDate[2] + ".json";
    
    const objFile = fs.readFileSync("./list/" + splittedDate[2] + "/" + targetFile, "utf8");

    // return targetFile;
    return JSON.parse(objFile);
}

async function createExcelFile(readPath, writePath, filename){
    console.log("Start creating EXCEL file...");

    let lineCount = 1;

    const HEADER_ROW = [
        {
            value: 'No',
            fontWeight: 'bold',
            backgroundColor: '#FFFF00',
            fontSize: 11
        },
        {
            value: 'Number',
            fontWeight: 'bold',
            backgroundColor: '#FFFF00',
            fontSize: 11
        },
        {
            value: 'Type',
            fontWeight: 'bold',
            backgroundColor: '#FFFF00',
            fontSize: 11
        },
        {
            value: 'Name',
            fontWeight: 'bold',
            backgroundColor: '#FFFF00',
            fontSize: 11
        },
        {
            value: 'DateTH',
            fontWeight: 'bold',
            backgroundColor: '#FFFF00',
            fontSize: 11
        },
        {
            value: 'DateEN',
            fontWeight: 'bold',
            backgroundColor: '#FFFF00',
            fontSize: 11
        }
    ];
      
    const DATA_ROW_1 = [
        // "Name"
        {
            type: String,
            value: 'John Smith'
        },
      
        // "Date of Birth"
        {
            type: Date,
            value: new Date(),
            format: 'mm/dd/yyyy'
        },
      
        // "Cost"
        {
            type: Number,
            value: 1800
        },
      
        // "Paid"
        {
            type: Boolean,
            value: true
        },

        // "Paid"
        {
            type: Boolean,
            value: true
        }
    ];

    // const data = [
    //     HEADER_ROW,
    //     DATA_ROW_1,
    //     DATA_ROW_1,
    // ];

    const data_final = [HEADER_ROW];
    // data_final.push(HEADER_ROW);
    // data.push(DATA_ROW_1);

    const allFiles = fs.readdirSync(readPath);

    for (var i = 0; i < allFiles.length; i++){
        console.log("Processing..." + chalk.blue(allFiles[i]));

        const objFile = JSON.parse(fs.readFileSync(readPath + allFiles[i], "utf8"));
        let DATA_ROW = [];

        // console.log(objFile.firstAward);

        objFile.firstAward.forEach(function(ele, index) {
            // console.log(ele);
            DATA_ROW = setData(lineCount, ele, "First", objFile.name, dateConversion(objFile.name, "TH"), dateConversion(objFile.name, "EN"));
            lineCount++;

            data_final.push(DATA_ROW);
        });
        
        if(objFile.three_prefix[0].length > 0) {
            objFile.three_prefix.forEach(function(ele, index) {
                // console.log(ele);
                DATA_ROW = setData(lineCount, ele, "Three_Prefix", objFile.name, dateConversion(objFile.name, "TH"), dateConversion(objFile.name, "EN"));
                lineCount++;

                data_final.push(DATA_ROW);
            });
        }

        objFile.three_suffix.forEach(function(ele, index) {
            // console.log(ele);
            DATA_ROW = setData(lineCount, ele, "Three_Suffix", objFile.name, dateConversion(objFile.name, "TH"), dateConversion(objFile.name, "EN"));
            lineCount++;

            data_final.push(DATA_ROW);
        });

        objFile.two_suffix.forEach(function(ele, index) {
            // console.log(ele);
            DATA_ROW = setData(lineCount, ele, "Two_Suffix", objFile.name, dateConversion(objFile.name, "TH"), dateConversion(objFile.name, "EN"));
            lineCount++;

            data_final.push(DATA_ROW);
        });

        objFile.secondAward.forEach(function(ele, index) {
            // console.log(ele);
            DATA_ROW = setData(lineCount, ele, "Second", objFile.name, dateConversion(objFile.name, "TH"), dateConversion(objFile.name, "EN"));
            lineCount++;

            data_final.push(DATA_ROW);
        });

        objFile.thirdAward.forEach(function(ele, index) {
            // console.log(ele);
            DATA_ROW = setData(lineCount, ele, "Third", objFile.name, dateConversion(objFile.name, "TH"), dateConversion(objFile.name, "EN"));
            lineCount++;

            data_final.push(DATA_ROW);
        });

        objFile.fourthAward.forEach(function(ele, index) {
            // console.log(ele);
            DATA_ROW = setData(lineCount, ele, "Fourth", objFile.name, dateConversion(objFile.name, "TH"), dateConversion(objFile.name, "EN"));
            lineCount++;

            data_final.push(DATA_ROW);
        });

        objFile.fifthAward.forEach(function(ele, index) {
            // console.log(ele);
            DATA_ROW = setData(lineCount, ele, "Fifth", objFile.name, dateConversion(objFile.name, "TH"), dateConversion(objFile.name, "EN"));
            lineCount++;

            data_final.push(DATA_ROW);
        });

    }

    // console.log("======================================");
    // console.log(data_final);

    await writeXlsxFile(data_final, {
        filePath: writePath + filename,
        fontSize: 11,
        sheet: 'AllData'
    });

    console.log(chalk.hex('#00ddcc')("DONE!"));
}

function setData(dataCount, dataNumber, dataType, dataName, dataDateTH, dataDateEN ) {
    const DATA_ROW = [
        // "No"
        {
            type: Number,
            value: dataCount
        },
      
        // "Number"
        {
            type: String,
            value: dataNumber,
        },
      
        // "Type"
        {
            type: String,
            value: dataType
        },

        // "Name"
        {
            type: String,
            value: dataName
        },
      
        // "DateTH"
        {
            type: String,
            value: dataDateTH
        },

        // "DateEN"
        {
            type: String,
            value: dataDateEN
        }
    ];

    return DATA_ROW;
}

function createExcelFile2(readPath, writePath, filename) {
    console.log("Start creating CSV file...");
    let lineCount = 1;
    
    let finalResult = "";
    const HEADER = "No,Number,Type,Name,DateTH,DateEN\r\n";
    let BODY = "";

    const files = fs.readdirSync(readPath);

    for (var i = 0; i < files.length; i++){
        item = [i, 'John Doe', files[i], 'yyyy', 'ccc', 'zzzz'];
        BODY = BODY + item.join(",");
        BODY = BODY + "\r\n";
        console.log(BODY);
    }

    finalResult = HEADER + "\r\n" + BODY;

    console.log(finalResult);

    fs.writeFile(writePath + filename, finalResult, (err) => {
        if(err) {
            console.log(err);
            return;
        }

        console.log("Write File " + chalk.bold.blue("Completed!"));
    })
}

function validateInputNumber(myInput) {
    var result = true;

    // console.log("input length => " + [2, 3, 6].includes(myInput.length));
    if ([2, 3, 6].includes(myInput.length)){
        var regex = /\d{x}/;
        result = new RegExp(regex.source.replace("x", myInput.length), 'g').test(myInput);
    } 
    else {
        result = false;
    }

    return result;
}

function validateFileName(myInput) {
    var result = true;

    // console.log("file name => " + myInput);
    var regex = /\d{1,2}_\d{1,2}_\d{4}/;
    result = new RegExp(regex, 'g').test(myInput);

    return result;
}

function findNumberInLottery(objJSON, myNumber){
    console.log(testReplaceStr());
    console.log("=========== Perfect Match ===========");
    // console.log(objJSON);
    // Enumberable.from(objJSON).where(x => x == "83").select(x => x).log().toJoinedString();

    //-- Initiate expression, then replaced later
    const myRegex = /^xxx$/;

    // const aaa = RegExp(/83/, 'g');
    //-- Check Award 1,2,3,4,5
    const objRegex = RegExp(myRegex.source.replace("xxx", myNumber), 'g');

    Object.keys(objJSON["data"]).forEach(key => {
        //console.log(`==> ${key} : ` + objJSON["data"][key]);

        var arrResult = JSON.parse(Enumerable.from(objJSON["data"][key]).where(x => x.match(objRegex)).select(x => x).toJSONString());

        if(arrResult.length > 0) {
            console.log('key: ' + key);
            // console.log("array length: " + arrResult.length);
            console.log(arrResult);
        }
    });

    //-- Check Prefix 3
    const objRegexPrefix = RegExp(myRegex.source.replace("xxx", String(myNumber).substring(0, 3)), 'g');

    Object.keys(objJSON["data"]).forEach(key => {
        //console.log(`==> ${key} : ` + objJSON["data"][key]);
        //console.log("=> Prefix " + objRegexPrefix);

        if(key == "three_prefix") {
            var arrResult = JSON.parse(Enumerable.from(objJSON["data"][key]).where(x => x.match(objRegexPrefix)).select(x => x).toJSONString());

            if(arrResult.length > 0) {
                console.log('key: ' + key);
                // console.log("array length: " + arrResult.length);
                console.log(arrResult);
            }
        }
        
    });

    //-- Check Suffix 2,3
    const objRegexSuffix3 = RegExp(myRegex.source.replace("xxx", String(myNumber).substring(3, 6)), 'g');
    const objRegexSuffix2 = RegExp(myRegex.source.replace("xxx", String(myNumber).substring(4, 6)), 'g');

    Object.keys(objJSON["data"]).forEach(key => {
        //console.log(`==> ${key} : ` + objJSON["data"][key]);
        //console.log("=> Suffix3 " + objRegexSuffix3);
        //console.log("=> Suffix2 " + objRegexSuffix2);

        if(key == "three_suffix") {
            var arrResult = JSON.parse(Enumerable.from(objJSON["data"][key]).where(x => x.match(objRegexSuffix3)).select(x => x).toJSONString());

            if(arrResult.length > 0) {
                console.log('key: ' + key);
                // console.log("array length: " + arrResult.length);
                console.log(arrResult);
            }
        }
        else if(key == "two_suffix") {
            var arrResult = JSON.parse(Enumerable.from(objJSON["data"][key]).where(x => x.match(objRegexSuffix2)).select(x => x).toJSONString());

            if(arrResult.length > 0) {
                console.log('key: ' + key);
                // console.log("array length: " + arrResult.length);
                console.log(arrResult);
            }
        }
        
    });

    /* for (const key in objJSON["data"]) {
        //console.log('key: ' + key);
        //console.log('value: ' + objJSON[key] + ' --- ' + objJSON[key].length);
        //console.log('myNumber: ' + myNumber);
        console.log(objJSON[key]);
        if(Array.isArray(objJSON[key])) {
            
            // console.log('value: ' + objJSON[key] + ' --- ' + objJSON[key].length);
            // var xx = Enumberable.from(objJSON[key]).where(x => x == "83").select(x => x).toJSONString();
            var arrResult = JSON.parse(Enumerable.from(objJSON[key]).where(x => x.match(objRegex)).select(x => x).toJSONString());
            

            if(arrResult.length > 0){
                console.log('key: ' + key);
                // console.log("array length: " + arrResult.length);
                console.log(arrResult);
            }
            
        }
    } */
    // console.log("test => " + objJSON['secondAward']);

    // const bbb = /abcd/g;
    // console.log('====> ' + bbb.source.replace("abcd", "\d\d\d89"));
}

function findCloseNumberInLottery(objJSON, myNumber) {
    console.log("=========== Close Number ===========");
    const myRegex = /^xxx$/;

    //-- Check Award 1,2,3,4,5
    const objRegex = RegExp(myRegex.source.replace("xxx", replaceRegexSet6(myNumber)), 'g');

    Object.keys(objJSON["data"]).forEach(key => {
        //console.log(`==> ${key} : ` + objJSON["data"][key]);

        var arrResult = JSON.parse(Enumerable.from(objJSON["data"][key]).where(x => x.match(objRegex) && x != myNumber).select(x => x).toJSONString());

        if(arrResult.length > 0) {
            console.log('key: ' + key);
            // console.log("array length: " + arrResult.length);
            console.log(arrResult);
        }
    });

    //-- Check Prefix 3
    const numPrefix3 = String(myNumber).substring(0, 3);

    const objRegexPrefix = RegExp(myRegex.source.replace("xxx", replaceRegexSet3(numPrefix3)), 'g');

    Object.keys(objJSON["data"]).forEach(key => {
        //console.log(`==> ${key} : ` + objJSON["data"][key]);
        //console.log("=> Prefix " + objRegexPrefix);
        //console.log("=> Suffix3 " + objRegexPrefix);

        if(key == "three_prefix") {
            var arrResult = JSON.parse(Enumerable.from(objJSON["data"][key]).where(x => x.match(objRegexPrefix) && x != numPrefix3).select(x => x).toJSONString());

            if(arrResult.length > 0) {
                console.log('key: ' + key);
                // console.log("array length: " + arrResult.length);
                console.log(arrResult);
            }
        }
        
    });

    //-- Check Suffix 2,3
    const numSuffix3 = String(myNumber).substring(3, 6);
    const numSuffix2 = String(myNumber).substring(4, 6);

    const objRegexSuffix3 = RegExp(myRegex.source.replace("xxx", replaceRegexSet3(numSuffix3)), 'g');
    const objRegexSuffix2 = RegExp(myRegex.source.replace("xxx", replaceRegexSet2(numSuffix2)), 'g');

    Object.keys(objJSON["data"]).forEach(key => {
        //console.log(`==> ${key} : ` + objJSON["data"][key]);
        //console.log("=> Suffix3 " + objRegexSuffix3);
        //console.log("=> Suffix2 " + objRegexSuffix2);

        if(key == "three_suffix") {
            var arrResult = JSON.parse(Enumerable.from(objJSON["data"][key]).where(x => x.match(objRegexSuffix3) && x != numSuffix3).select(x => x).toJSONString());

            if(arrResult.length > 0) {
                console.log('key: ' + key);
                // console.log("array length: " + arrResult.length);
                console.log(arrResult);
            }
        }
        else if(key == "two_suffix") {
            var arrResult = JSON.parse(Enumerable.from(objJSON["data"][key]).where(x => x.match(objRegexSuffix2) && x != numSuffix2).select(x => x).toJSONString());

            if(arrResult.length > 0) {
                console.log('key: ' + key);
                // console.log("array length: " + arrResult.length);
                console.log(arrResult);
            }
        }
        
    });
}

function replaceRegexSet2(inputNum) {
    var resultStr = "";
    var numSet1 = `${inputNum[0]}[0-9]`;
    var numSet2 = `[0-9]${inputNum[1]}`;

    resultStr = `(${numSet1}|${numSet2})`;

    return resultStr;
}

function replaceRegexSet3(inputNum) {
    var resultStr = "";
    var numSet1 = `${inputNum[0]}[0-9]${inputNum[2]}`;
    var numSet2 = `${inputNum[0]}${inputNum[1]}[0-9]`;
    var numSet3 = `[0-9]${inputNum[1]}${inputNum[2]}`;

    var numSet4 = `[0-9]${inputNum[1]}[0-9]`;
    var numSet5 = `${inputNum[0]}[0-9][0-9]`;
    var numSet6 = `[0-9][0-9]${inputNum[2]}`;

    resultStr = `(${numSet1}|${numSet2}|${numSet3}|${numSet4}|${numSet5}|${numSet6})`;

    return resultStr;
}

function replaceRegexSet6(inputNum) {
    var resultStr = "";
    var miniSet1 = "";
    var miniSet2 = "";
    var miniSet3 = "";
    var miniSet4 = "";
    var miniSet5 = "";
    var miniSet6 = "";
    var miniSet7 = "";
    var miniSet8 = "";
    var miniSet9 = "";
    var miniSet10 = "";
    var numSet0 = `${inputNum[0]}${inputNum[1]}${inputNum[2]}${inputNum[3]}${inputNum[4]}${inputNum[5]}`;

    var numSet1 = `[0-9]${inputNum[1]}${inputNum[2]}${inputNum[3]}${inputNum[4]}${inputNum[5]}`;
    var numSet2 = `${inputNum[0]}[0-9]${inputNum[2]}${inputNum[3]}${inputNum[4]}${inputNum[5]}`;
    var numSet3 = `${inputNum[0]}${inputNum[1]}[0-9]${inputNum[3]}${inputNum[4]}${inputNum[5]}`;
    var numSet4 = `${inputNum[0]}${inputNum[1]}${inputNum[2]}[0-9]${inputNum[4]}${inputNum[5]}`;
    var numSet5 = `${inputNum[0]}${inputNum[1]}${inputNum[2]}${inputNum[3]}[0-9]${inputNum[5]}`;
    var numSet6 = `${inputNum[0]}${inputNum[1]}${inputNum[2]}${inputNum[3]}${inputNum[4]}[0-9]`;

    var numSet7 = `[0-9][0-9]${inputNum[2]}${inputNum[3]}${inputNum[4]}${inputNum[5]}`;
    var numSet8 = `[0-9]${inputNum[1]}[0-9]${inputNum[3]}${inputNum[4]}${inputNum[5]}`;
    var numSet9 = `[0-9]${inputNum[1]}${inputNum[2]}[0-9]${inputNum[4]}${inputNum[5]}`;
    var numSet10 = `[0-9]${inputNum[1]}${inputNum[2]}${inputNum[3]}[0-9]${inputNum[5]}`;
    var numSet11 = `[0-9]${inputNum[1]}${inputNum[2]}${inputNum[3]}${inputNum[4]}[0-9]`;

    var numSet12 = `${inputNum[0]}[0-9][0-9]${inputNum[3]}${inputNum[4]}${inputNum[5]}`;
    var numSet13 = `${inputNum[0]}[0-9]${inputNum[2]}[0-9]${inputNum[4]}${inputNum[5]}`;
    var numSet14 = `${inputNum[0]}[0-9]${inputNum[2]}${inputNum[3]}[0-9]${inputNum[5]}`;
    var numSet15 = `${inputNum[0]}[0-9]${inputNum[2]}${inputNum[3]}${inputNum[4]}[0-9]`;

    var numSet16 = `${inputNum[0]}${inputNum[1]}[0-9][0-9]${inputNum[4]}${inputNum[5]}`;
    var numSet17 = `${inputNum[0]}${inputNum[1]}[0-9]${inputNum[3]}[0-9]${inputNum[5]}`;
    var numSet18 = `${inputNum[0]}${inputNum[1]}[0-9]${inputNum[3]}${inputNum[4]}[0-9]`;

    var numSet19 = `${inputNum[0]}${inputNum[1]}${inputNum[2]}[0-9][0-9]${inputNum[5]}`;
    var numSet20 = `${inputNum[0]}${inputNum[1]}${inputNum[2]}[0-9]${inputNum[4]}[0-9]`;

    var numSet21 = `${inputNum[0]}${inputNum[1]}${inputNum[2]}${inputNum[3]}[0-9][0-9]`;

    miniSet1 = `${numSet1}|${numSet2}|${numSet3}|${numSet4}|${numSet5}|${numSet6}`;
    miniSet2 = `${numSet7}|${numSet8}|${numSet9}|${numSet10}|${numSet11}`;
    miniSet3 = `${numSet12}|${numSet13}|${numSet14}|${numSet15}`;
    miniSet4 = `${numSet16}|${numSet17}|${numSet18}`;
    miniSet5 = `${numSet19}|${numSet20}`;
    miniSet6 = `${numSet21}`;
    //////////////////////////////////////////////////////////
    var numSet22 = `[0-9][0-9][0-9]${inputNum[3]}${inputNum[4]}${inputNum[5]}`;
    var numSet23 = `[0-9][0-9]${inputNum[2]}[0-9]${inputNum[4]}${inputNum[5]}`;
    var numSet24 = `[0-9][0-9]${inputNum[2]}${inputNum[3]}[0-9]${inputNum[5]}`;
    var numSet25 = `[0-9][0-9]${inputNum[2]}${inputNum[3]}${inputNum[4]}[0-9]`;

    var numSet26 = `[0-9]${inputNum[1]}[0-9][0-9]${inputNum[4]}${inputNum[5]}`;
    var numSet27 = `[0-9]${inputNum[1]}[0-9]${inputNum[3]}[0-9]${inputNum[5]}`;
    var numSet28 = `[0-9]${inputNum[1]}[0-9]${inputNum[3]}${inputNum[4]}[0-9]`;

    var numSet29 = `[0-9]${inputNum[1]}${inputNum[2]}[0-9][0-9]${inputNum[5]}`;
    var numSet30 = `[0-9]${inputNum[1]}${inputNum[2]}[0-9]${inputNum[4]}[0-9]`;
    var numSet31 = `[0-9]${inputNum[1]}${inputNum[2]}${inputNum[3]}[0-9][0-9]`;
    
    miniSet7 = `${numSet22}|${numSet23}|${numSet24}|${numSet25}|${numSet26}|${numSet27}|${numSet28}|${numSet29}|${numSet30}|${numSet31}`;
    //////////////////////////////////////////////////////////
    var numSet32 = `${inputNum[0]}[0-9][0-9][0-9]${inputNum[4]}${inputNum[5]}`;
    var numSet33 = `${inputNum[0]}[0-9][0-9]${inputNum[3]}[0-9]${inputNum[5]}`;
    var numSet34 = `${inputNum[0]}[0-9][0-9]${inputNum[3]}${inputNum[4]}[0-9]`;

    var numSet35 = `${inputNum[0]}[0-9]${inputNum[2]}[0-9][0-9]${inputNum[5]}`;
    var numSet36 = `${inputNum[0]}[0-9]${inputNum[2]}[0-9]${inputNum[4]}[0-9]`;

    var numSet37 = `${inputNum[0]}[0-9]${inputNum[2]}${inputNum[3]}[0-9][0-9]`;

    miniSet8 = `${numSet32}|${numSet33}|${numSet34}|${numSet35}|${numSet36}|${numSet37}`;
    //////////////////////////////////////////////////////////
    var numSet38 = `${inputNum[0]}${inputNum[1]}[0-9][0-9][0-9]${inputNum[5]}`;
    var numSet39 = `${inputNum[0]}${inputNum[1]}[0-9][0-9]${inputNum[4]}[0-9]`;

    var numSet40 = `${inputNum[0]}${inputNum[1]}[0-9]${inputNum[3]}[0-9][0-9]`;

    miniSet9 = `${numSet38}|${numSet39}|${numSet40}`;
    //////////////////////////////////////////////////////////
    var numSet41 = `${inputNum[0]}${inputNum[1]}${inputNum[2]}[0-9][0-9][0-9]`;

    miniSet10 = `${numSet41}`;
    //////////////////////////////////////////////////////////

    resultStr = `(${miniSet1}|${miniSet2}|${miniSet3}|${miniSet4}|${miniSet5}|${miniSet6}|${miniSet7}|${miniSet8}|${miniSet9}|${miniSet10})`;

    return resultStr;
}

function testReplaceStr(){
    const myNum = "123456";

    var result = "";

    for(var i = 0; i < myNum.length; i++) {
        result += myNum[i];

        for(var j = 0; j < myNum.length; j++) {
            if(j != i)
                result += myNum[j];
        }

        result += "|";
    }

    return result;
}

module.exports = {
    getElementJSON,
    writeJSON,
    writeFlatJSON,
    generateInstallmentName,
    dateConvertTHNameToNumber,
    findLotteryFile,
    createExcelFile,
    createExcelFile2,
    validateInputNumber,
    validateFileName,
    findNumberInLottery,
    findCloseNumberInLottery,
    dateConversion
};