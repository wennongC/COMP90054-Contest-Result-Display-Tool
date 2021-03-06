const request = require('request');
const HTMLParser = require('node-html-parser');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + "/assets"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

const getLinkList = function(res, htmlFile, parameters = {}) {
    const url = "http://115.146.95.253/";
    request(url, function (error, response, body) {
        if (error) {
            res.send("Error: Unable to connect " + url);
        } else {
            const dateToString = function(date) {
                const month = date.slice(5,7);
                const day = date.slice(8,10);
                const hour = date.slice(11,13);
                const minute = date.slice(14,16);
                const monthStr = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                return `Contest Date: ${Number(day)} ${monthStr[Number(month)]}, ${hour}:${minute}`;
            }
            const root = HTMLParser.parse(body);
            const links = root.querySelectorAll('a');
            const hrefs = [];
            const dates = [];
            links.forEach((a)=>{
                href = a.rawAttributes.href;
                date = href.replace('results_','').replace('/results.html','');
                href = "http://115.146.95.253/" + href;
                hrefs.push(href);
                dates.push(dateToString(date));
            });
            parameters.hrefs = hrefs;
            parameters.dates = dates;
            res.render(htmlFile, parameters);
        }
    });

}

app.get('/*', (req, res) => {
    getLinkList(res, "index.html");
});

app.post('/search', (req, res) => {
    const {teamname, url} = req.body;

    if (!teamname || !url) {
        return getLinkList(res, "error.html", {teamname, url, errorMsg: "Error: Teamname or URL is empty"});
    }

    request(url, function (error, response, body) {
        // console.error('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        if (error) {
            var errorMsg = "Unkown Error";
            return getLinkList(res, "error.html", {teamname, url, errorMsg});
        }
        else if (response.statusCode == 404) {
            var errorMsg = "Error 404. Maybe check your URL";
            return getLinkList(res, "error.html", {teamname, url, errorMsg});
        } else {
            var root = HTMLParser.parse(body);
            var tables = root.querySelectorAll('table');
            if (tables.length != 2){
                return getLinkList(res, "error.html", {teamname, url, errorMsg:"Error: HTML parse error (The url might be wrong)"});
            }
            var rankTable = tables[0];
            var matchTable = tables[1];

            var rank_categories = [];
            var headers = rankTable.childNodes[0];
            for (let i = 0; i < headers.childNodes.length; i++) {
                rank_categories.push(headers.childNodes[i].rawText);
            }
            var rank_record = [];
            for (let r = 1; r < rankTable.childNodes.length; r++){
                var tr = rankTable.childNodes[r];
                var curr_teamname = tr.childNodes[1].rawText;
                if (curr_teamname == teamname || curr_teamname.includes("staff_team_")) {
                    var record = {};
                    for (let i = 0; i < tr.childNodes.length; i++) {
                        record[rank_categories[i]] = tr.childNodes[i].rawText;
                    }
                    rank_record.push(record);
                }
            }

        
            var match_categories = [];
            headers = matchTable.childNodes[0];
            for (let i = 0; i < headers.childNodes.length; i++) {
                match_categories.push(headers.childNodes[i].rawText);
            }
            var match_record = [];
            var match_record_2 = [];
            for (let r = 1; r < matchTable.childNodes.length; r++){
                var tr = matchTable.childNodes[r];
                var curr_teamname = tr.childNodes[0].rawText;
                var curr_teamname_2 = tr.childNodes[1].rawText;
                if (curr_teamname == teamname) {
                    var record = {};
                    for (let i = 0; i < tr.childNodes.length; i++) {
                        record[match_categories[i]] = tr.childNodes[i].rawText;
                    }
                    match_record.push(record);
                } else if (curr_teamname_2 == teamname) {
                    var record = {};
                    for (let i = 0; i < tr.childNodes.length; i++) {
                        record[match_categories[i]] = tr.childNodes[i].rawText;
                    }
                    match_record_2.push(record);
                }
            }
            
            match_record = match_record.concat(match_record_2);
            // console.log(rank_record);
            // console.log(match_record);

            return getLinkList(res, "result.html", {
                teamname, 
                url,
                rank_categories,
                match_categories,
                rank_record,
                match_record
            });
        }
    });
});

app.listen(PORT);
console.log(`app is starting on port ${PORT}`);