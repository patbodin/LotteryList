const configDate = require('./config/config.json');
const fs = require("fs");
const chalk = require('chalk');
const writeXlsxFile = require("write-excel-file/node");
const process = require("process");
const exceljs = require('exceljs');
const Enumerable = require('linq');

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
    // console.log(objJSON);
    // Enumberable.from(objJSON).where(x => x == "83").select(x => x).log().toJoinedString();

    //-- Initiate expression, then replaced later
    const myRegex = /^xxx$/;

    // const aaa = RegExp(/83/, 'g');
    const objRegex = RegExp(myRegex.source.replace("xxx", myNumber), 'g');

    for (const key in objJSON) {
        // console.log('key: ' + key);
        // console.log('value: ' + objJSON[key] + ' --- ' + objJSON[key].length);
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
    }
    // console.log("test => " + objJSON['secondAward']);

    // const bbb = /abcd/g;
    // console.log('====> ' + bbb.source.replace("abcd", "\d\d\d89"));
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
    dateConversion
};