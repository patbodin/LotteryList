const configDate = require('./config/config.json');
const fs = require("fs");
const chalk = require('chalk');

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
    const monthList = 
        {
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

module.exports = {
    getElementJSON,
    writeJSON,
    generateInstallmentName
};