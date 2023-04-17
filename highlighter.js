
function initHighlighter() {
    highlightKnownWords()
}


function highlightKnownWords() {
    var knownWords = ['有', '个', '到', '学习']
    var vocabTrie = createTrie(knownWords)
    var allTextNodes = getTextNodes()
    for (const textNode of allTextNodes) {
        const words = textNode.nodeValue
        console.log('words: ', words, 'tokenized: ', tokenize(words).join('-'))
        const tokenizedWords = tokenize(words)
        let spans = []
        for (const word of tokenizedWords) {
            // console.log('word: ', word)
            const highlightedWord = document.createElement('span');
            highlightedWord.textContent = word.trim();
            highlightedWord.classList.add('highlighted')
            if (knownWords.includes(word)) {
                // Create a new span element with the highlighted word
                highlightedWord.style.backgroundColor = 'yellow';
            } 
            spans.push(highlightedWord)
            // Replace the original word with the highlighted word
        }
        const highlightedWords = spans.map(x => x.innerHTML).join('');
        textNode.nodeValue = highlightedWords;
        const startOffset = textNode.textContent.indexOf(words);
        if (startOffset > -1) {
            const range = document.createRange();
            range.setStart(textNode, startOffset);
            range.setEnd(textNode, startOffset + words.length);
            range.deleteContents();
            for (const span of spans.reverse()) {
                range.insertNode(span);
            }
        }
    }
}


(() => {
    console.log("highlighter.js loaded")
    setTimeout(initHighlighter, 6000)
})();