const request = require('request');

const url = "http://115.146.95.253/results_2020-09-24-20-37/results.html"

request(url, function (error, response, body) {
    // console.error('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    if (error) {
        console.log("Unkown Error");
    }
    else if (response.statusCode == 404) {
        console.log("Error 404. Check your URL");
    }
    
    var root = HTMLParser.parse(body);
    var tables = root.querySelectorAll('table');
    var rankTable = tables[0];
    var matchTable = tables[1];
    console.log(rankTable.childNodes[0].childNodes[0].childNodes[0].rawText); // Table.tbody.tr.th
    
    console.log(matchTable.childNodes.length);

    for (let r = 1; r < rankTable.childNodes.length; r++){
        var tr = rankTable.childNodes[r];
        var teamname = tr.childNodes[1].rawText;
        console.log(teamname);
    }

    var match_categories = [];
    var headers = matchTable.childNodes[0];
    for (let i = 0; i < headers.childNodes.length; i++) {
        match_categories.push(headers.childNodes[i].rawText);
    }

    var match_record = [];
    for (let r = 1; r < matchTable.childNodes.length; r++){
        var tr = matchTable.childNodes[r];
        var teamname = tr.childNodes[0].rawText;
        if (teamname == "funpacman") {
            var record = {};
            for (let i = 0; i < tr.childNodes.length; i++) {
                record[match_categories[i]] = tr.childNodes[i].rawText;
            }
            match_record.push(record);
        }
    }

    console.log(match_record);

});