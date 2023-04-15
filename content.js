
function initContent() {
    console.log("\n\n\n  content.js: initCOntent()  \n\n\n")
    //loadJsonAsset('hsk.json').then(json => processHskWords(json))
    loadCsvAsset('hskall.csv').then(csv => processHskWords(csv))
    loadTextAsset('words_i_know.txt').then(csv => processWordsIKnow(csv))
}

function processHskWords(hskJson) {
    var s = hskJson.map(x => x["hanzi"].toString()).slice(0, 25).join(", ")
    console.log(`<<<hsk data>>>: ${s}`)
    window.hskWords = hskJson;
}
function processWordsIKnow(words) {
    var s = words.slice(0, 25).join(", ")
    console.log(`<<<words i know>>>: ${s}`)
    window.knownWords = words;
}

(() => {
    console.log("content.js loaded")
    setTimeout(initContent, 500)
})();