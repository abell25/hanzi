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

(() => {
    console.log("tools.js loaded")
})();