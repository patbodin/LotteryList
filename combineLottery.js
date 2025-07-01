const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, './combine/'); //  เปลี่ยนชื่อโฟลเดอร์ของคุณ
const allFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));

//console.log("---> " + folderPath);
//console.log("---> " + allFiles);

const combined = [];

for (const file of allFiles) {
  const filePath = path.join(folderPath, file);
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    jsonData.forEach((entry, index) => {
        // console.log(`ลำดับ ${index + 1}`);
        // console.log(`วันที่: ${entry.date}`);
        // console.log(`ประเภท: ${entry.award_type}`);
        // console.log(`หมายเลข: ${entry.number}`);
        // console.log('--------------------------');
        combined.push({
            date: entry.date,
            award_type: entry.award_type,
            number: entry.number
        });
    });
}

// เขียนรวมเป็นไฟล์เดียว
fs.writeFileSync('./combine/result/combined_flat_data.json', JSON.stringify(combined, null, 2), 'utf8');
console.log('สร้างไฟล์ combined_flat_data.json เรียบร้อยแล้ว');