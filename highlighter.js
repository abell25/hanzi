
function initHighlighter() {
    highlightKnownWords()
}


function highlightKnownWords() {
    var knownWords = ['有', '个', '到']
    var vocabTrie = createTrie(knownWords)
    for(const textNode of getTextNodes()) {
        const words = textNode.nodeValue
        for (const word of words) {
            if (knownWords.includes(word)) {
                // Create a new span element with the highlighted word
                const highlightedWord = document.createElement('span');
                highlightedWord.style.backgroundColor = 'yellow';
                highlightedWord.textContent = word;

                // Replace the original word with the highlighted word
                const startOffset = textNode.textContent.indexOf(word);
                if (startOffset > -1) {
                    const range = document.createRange();
                    range.setStart(textNode, startOffset);
                    range.setEnd(textNode, startOffset + word.length);
                    range.deleteContents();
                    range.insertNode(highlightedWord);
                }
            }
        }
    }
}


(() => {
    console.log("highlighter.js loaded")
    setTimeout(initHighlighter, 6000)
})();