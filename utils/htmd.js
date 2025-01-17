var headerRegex = /^#{1,}/
var linkRegex = /\[[^\[\]]*\]\([^\[\]()]*\)/
var ULRegex = /^\s{0,}-/     // unordered list
var OLRegex = /^\s{0,}\d./     // ordered list
var boldRegex = /\*{2}[^\*]{0,}\*{2}/
var italicRegex = /-{2}[^(-)]{0,}-{2}/
var HRRegex = /^-{3,}$/
	
var listDepth = 0
var newLineCount = 0
var currentTag

function HRFormatter(line) {
	if (line.match(HRRegex)) {
		return '<hr>'
	}
	return line
}

function italicFormatter(line) {
	var foundText = line.match(italicRegex)
	while (foundText?.length) {
		var italicText = '<em>' + foundText[0].replace(/-{2}/g, '') + '</em>'
		line = line.replace(italicRegex, italicText)
		foundText = line.match(italicRegex)
	}
	return line
}

function boldFormatter(line) {
	var foundText = line.match(boldRegex)
	while (foundText?.length) {
		var boldText = '<b>' + line.match(boldRegex)[0].replace(/\*{2}/g, '') + '</b>'
		line =  line.replace(boldRegex, boldText)
		foundText = line.match(boldRegex)
	}
	return line
}

function ULFormatter(line) {
	var size = line.match(ULRegex)[0]?.length
	var newLine = ''
	if (size) {
		size = parseInt((size + 1) / 2)
	}
	if (listDepth < size) {
		listDepth ++;
		endingTag = endingTag + '</ul>';
		newLine = '<ul>';
	}
	newLine = newLine + '<li>' + line.replace(ULRegex, '') + '</li>'
	if (listDepth > size) {
		listDepth --
		endingTag = endingTag.replace('</ul>', '');
		newLine = '</ul>' + newLine
	}
	return newLine
}


function OLFormatter(line) {
	var size = line.match(OLRegex)[0]?.length
	var newLine = ''
	if (size) {
		size = parseInt((size + 1) / 2)
	}
	if (listDepth < size) {
		listDepth ++;
		endingTag = endingTag + '</ol>';
		newLine = '<ol>';
	}
	newLine = newLine + '<li>' + line.replace(OLRegex, '') + '</li>'
	if (listDepth > size) {
		listDepth --
		endingTag = endingTag.replace('</ol>', '');
		newLine = '</ol>' + newLine
	}
	return newLine
}

function headerFormatter(line) {
	var size = line.match(headerRegex)[0]?.length
	line = line.replace(headerRegex, '')
	if (size > 6) { 
		size = 6
	}
	endingTag = '</h' + size + '>'
	var startTag = '<h'+size
	var link = line.split('href="#')[1]
	if(link){
		link = link.split('"')[0]
		startTag = startTag + ' id="' + link + '"'
	}
	return startTag+'>'+line
}

function linkFormatter(line) {
	var foundLink = line.match(linkRegex)
	while (foundLink) {
		var link = foundLink[0]
		var text = link.split('](')[0].slice(1)
		link = link.split('](')[1].slice(0,-1)
		if (link[0] === '#') {
			link = link+'" id="' + link
		}
		var newLink = '<a href="'+link+'">'+text+'</a>'
		line = line.replace(linkRegex, newLink)
		foundLink = line.match(linkRegex)
	}
	return line
}

function applyFormatters(line) {
	if (line.match(HRRegex)) {
		return HRFormatter(line)
	}
	if(line.match(headerRegex)) {
		return headerFormatter(line)
	}
	if(line.match(ULRegex)) {
		return ULFormatter(line)
	}
	if(line.match(OLRegex)) {
		return OLFormatter(line)
	}
	if (newLineCount === 1) {
		endingTag = '</p>'
		return '<p>' + line
	}
	return line
}

function formatLine(line){
	if (line.replace(' ','').length === 0) {
		newLineCount ++;
		listDepth = 0;
		line = endingTag || ''
		endingTag = ''
		return line
	}

	line = linkFormatter(line)
	line = italicFormatter(line)
	line = boldFormatter(line)

	var newLine = applyFormatters(line)
	newLineCount = 0;
	return newLine + ' ' 
}

var body = document.getElementsByTagName('body')[0]
var bodyContent = body.firstChild.data
var lines = bodyContent.split("\n")
body.removeChild(body.firstChild)
var html = ''

for (var index = 0; index < lines.length; index++) {
	html = html + formatLine(lines[index])
}


var element = document.createElement('div')
element.innerHTML = html
body.appendChild(element)

