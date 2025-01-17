var headContent =  `
		<title> mybc </title>
		<link rel="stylesheet" href="templates/index.css" >
		<meta name="viewport" content="width=device-width, initial-scale=1" />
 `

function populateHead(pathLength){
	var head = document.getElementsByTagName('head')[0]
	var depth = Array(pathLength-1).fill('../space').join('')
	headContent = headContent.replace('templates',depth+'templates')
	head.innerHTML = headContent
}

function drawFooter(){
	var footer = document.createElement('footer')
	var body = document.getElementsByTagName('body')[0]
	body.appendChild(footer)
}

function calculatePaths(path) {
	var paths = path.split('/')
		paths.pop()
	return ['MYBC', ...paths]
}

function drawHeader() {
	var header = document.createElement('header')
	var path = getPath()
	var paths = calculatePaths(path)
	var breadcrumbs = createBreadcrumbs(paths)
	var html = drawBreadcrumbs(breadcrumbs)
	header.innerHTML = html
	var body = document.getElementsByTagName('body')[0]
	body.insertBefore( header, body.firstChild)
	return breadcrumbs.length
}

function getPath() {
	var location = window.location.href
	return location.split('.io/space/')[1]
}

function createBreadcrumbs(paths) {
	var breadcrumbs = []	
	for (var index = paths.length; index > 0; index --) {
		var path = Array(paths.length-index).fill('../').join('')
		var file = 'index.html'
		if(paths[index-1].includes('.html')) {
			file = paths[index-1]
		}
		breadcrumbs.unshift({
			name: paths[index-1],
			path: path+file
		})
	}
	return breadcrumbs
}

function drawBreadcrumbs(breadcrumbs) {
	var links = []
	for(var index=0; index< breadcrumbs.length; index++) {
		var crumb = breadcrumbs[index]
		links.push('<a href="' + crumb.path + '">' + crumb.name + '</a>')
	}
	return '<div> ' + links.join('  <b>></b>  ') + '</div>'
}

function drawInterface(){
	var pathLength = drawHeader()
	drawFooter()
	populateHead(pathLength)
}

window.onload = drawInterface
