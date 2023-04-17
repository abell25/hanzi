//////////////////////////////////////// data files ////////////////////////////////////////
function rowToDict(headers, values) {
    const obj = {}
    headers.forEach((header, i) => {
        obj[header] = values[i]
    })
    return obj
}

function loadJsonAsset(filename) {
    const url = chrome.runtime.getURL(`assets/${filename}`)
    return fetch(url)
        .then(response => response.json())
        //.then(data => { /* do something with the data */ })
        .catch(error => {
            console.error(`Error occurred while fetching ${filename}:`, error);
        });
}

function csvToDict(csvRows) {
    const headers = csvRows[0].split(',')
    const data = csvRows.slice(1)
        .map(row => row.split(","))
        .filter(row => row.length == headers.length)
        .map(row => rowToDict(headers, row))
    return data
}

function loadCsvAsset(filename) {
    const url = chrome.runtime.getURL(`assets/${filename}`)
    return fetch(url)
        .then(response => response.text())
        .then(txt => csvToDict(txt.split('\n')))
        .catch(error => {
            console.error(`Error occurred while fetching ${filename}:`, error);
        })
}

function loadTextAsset(filename) {
    const url = chrome.runtime.getURL(`assets/${filename}`)
    return fetch(url)
        .then(response => response.text())
        .then(txt => txt.split('\n'))
        .catch(error => {
            console.error(`Error occurred while fetching ${filename}:`, error);
        })
}



//////////////////////////////////////// trie ////////////////////////////////////////
/* 
 * Create a Trie data structure
*/
function createTrie(words) {
    const trie = {}
    for (const word of words) {
        let node = trie
        for (const char of word) {
            if (!node[char]) {
                node[char] = {}
            }
            node = node[char]
        }
        node['$'] = true    // end of word
    }
    return trie
}

function wordInTrie(trie, word) {
    let node = trie
    for (const char of word) {
        if (!node[char]) {
            return false
        }
        node = node[char]
    }
    return node['$'] || false
}

function getAllTrieMatches(trie, chars) {
    let node = trie,
        matches = [],
        i = 0,
        c = chars[i];
    while (node = node[c]) {
        if (node['$']) { matches.push(chars.slice(0, i + 1)) }
        c = chars[++i]
    }
    return matches
}

function getLongestTrieMatch(trie, chars) {
    return getAllTrieMatches(trie, chars).pop() ?? null
}

//////////////////////////////////////// searching page ////////////////////////////////////////
function isChineseCharacter(char) {
    const chineseCharRegex = /[\u4e00-\u9fff]/;
    return chineseCharRegex.test(char);
  }

function getTextNodes() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
  
    let textNodes = [],
        currentNode;
    while ((currentNode = walker.nextNode())) {
        if (/[^\u0000-\u00ff]/.test(currentNode.nodeValue)) {
            textNodes.push(currentNode)
        }
    }
    return textNodes
}
//////////////////////////////////////// tokenization ////////////////////////////////////////
function tokenize(textStr) {
    return (tokenizeChinese(textStr)[0] ?? []).filter(x => x.trim().length > 0)
}
function tokenizeChinese(textStr, maxLen=3, depth=0) {
    if (textStr.length == 0) return [[], 1]
    if (textStr.length == 1) return [[textStr], wordFreqs[textStr] ?? 1]
    
    if (!isChineseCharacter(textStr.slice(0, 1))) {
        for(let i=1; i<textStr.length; i++) {
            if (isChineseCharacter(textStr.slice(i, i+1))) {
                let [tokensRest, freqRest] = tokenizeChinese(textStr.slice(i), maxLen, depth+1);
                return [[textStr.slice(0, i), ...tokensRest], 1 + freqRest];
            }
        }
    }
    
    let results = Array.from({length: maxLen}, (_, i) => i+1)
        .reverse()
        .filter(i => wordFreqs[textStr.slice(0, i)])
        .map(i => {
            let word = textStr.slice(0, i);
            let freq = wordFreqs[word];
            //console.log(`word: ${word}, freq: ${freq}`)
            let textStrRest = textStr.slice(i);
            let [tokensRest, freqRest] = tokenizeChinese(textStrRest, maxLen, depth+1);
            return [[word, ...tokensRest], freq + freqRest];
        })
        // DEFAULT IS MAX LENGTH
        //.sort((a, b) => b[1] - a[1]) 
    
    // If results is empty, then current char is not in the dictionary.
    if (results.length == 0) {
        return [[textStr.slice(0, 1), ...tokenizeChinese(textStr.slice(1), maxLen, depth+1)[0]], 1]
    }
    return results[0] ?? [[], 1]

}

(() => {
    console.log("tools.js loaded")
})();