const configDate = require('./config/config.json');
const fs = require("fs");
const chalk = require('chalk');
const writeXlsxFile = require("write-excel-file/node");
const process = require("process");
const exceljs = require('exceljs');

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

function dateConversion(fullDateTime, lang){
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
    if(String(lang).toUpperCase() == "TH") {
        finalDate = splittedDate[0] + "-" + monthList[splittedDate[1].trim()]["monthTHName"] + "-" + splittedDate[2];
    }
    else {
        finalDate = splittedDate[0] + "-" + monthList[splittedDate[1].trim()]["monthENName"] + "-" + (splittedDate[2]-543);
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

module.exports = {
    getElementJSON,
    writeJSON,
    generateInstallmentName,
    findLotteryFile,
    createExcelFile,
    createExcelFile2
};