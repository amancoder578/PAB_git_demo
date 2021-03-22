let request = require("request");
let cheerio = require("cheerio");

function processAllMatch(url){
    request(url,cb);
    function cb(err,res,html){
        if(err){
            console.log(err);
        }
    
        else{
            extractAllScorecardLink(html);
        }
    }
    
}

function extractAllScorecardLink(html){
    let selTool = cheerio.load(html);
    let scorecardLinkArr = selTool("a[data-hover='Scorecard']");
    console.log(scorecardLinkArr.length);
    for(let i=0; i<scorecardLinkArr.length; i++){
        let link = selTool(scorecardLinkArr[i]).attr("href");
        let fullLink = "https://www.espncricinfo.com"+link;
    //    console.log(fullLink);
    processSingleMatch(fullLink);
    }
}

function processSingleMatch(url){
    request(url,cb);
}

function cb(err,res,html){
    if(err){
        console.log(err);
    }

    else{
        extractPlayerDetails(html);
    }
}

function extractPlayerDetails(html){

    let selTool = cheerio.load(html);
    let detailsElem = selTool(".event .match-info.match-info-MATCH .description");
    let detailText = detailsElem.text();
    let detailsArr = detailText.split(",");
    let venue  = detailsArr[1].trim();
    let date  = detailsArr[2].trim();
   // console.log(venue);
   // console.log(date);
   let resElem = selTool(".event .match-info.match-info-MATCH .status-text");
   let result = resElem.text();
   let NameOfTeams = selTool(".Collapsible h5");
   let BatsmanTableOfTeams = selTool(".Collapsible .table.batsman");

   for(let i=0; i<NameOfTeams.length; i++){
       let allRowsOfCurrTeam = selTool(BatsmanTableOfTeams[i]).find("tbody tr");
       for(let j=0; j<allRowsOfCurrTeam.length; j++){
           let allCols = selTool(allRowsOfCurrTeam[j]).find("td");
           if(allCols.length == 8){

            let myTeamName = selTool(NameOfTeams[i]).text().split("INNINGS")[0].trim();
            console.log(myTeamName);
            myTeamName = myTeamName.trim();
            let opponentTeamName = i == 0 ? selTool(NameOfTeams[1]).text() : selTool(NameOfTeams[0]).text();
            opponentTeamName = opponentTeamName.split("INNINGS")[0].trim();
            let name = selTool(allCols[0]).text();
            let runs = selTool(allCols[2]).text();
            let balls = selTool(allCols[3]).text();
            let fours = selTool(allCols[5]).text();
            let sixes = selTool(allCols[6]).text();
            let sr = selTool(allCols[7]).text();

            console.log(`teamName ${myTeamName} playerName ${name} venue ${venue} Date ${date}
            opponent ${opponentTeamName} result ${result} runs ${runs} balls ${balls} fours ${fours}
            sixes ${sixes} sr ${sr}`);

           }
       }
   }
}



module.exports = {
    pam: processAllMatch
}