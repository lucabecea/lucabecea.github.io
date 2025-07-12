var headContent =  `
		<title> mybc </title>
		<link rel="stylesheet" href="/utils/index.css" >
		<meta name="viewport" content="width=device-width, initial-scale=1" />
 `

function populateHead(){
	document.getElementsByTagName('head')[0].innerHTML = headContent
}

function drawFooter(){
	var footer = document.createElement('footer')
	var body = document.getElementsByTagName('body')[0]
	body.appendChild(footer)
}

function calculatePaths(path) {
	var paths = path.split('/')
	if (paths[paths.length - 1] === 'index.html') {
		paths.pop()
	}
	paths.shift()
	return ['MYBC', ...paths]
}

function drawHeader() {
	var header = document.createElement('header')
	var path = window.location.pathname
	var paths = calculatePaths(path)
	var breadcrumbs = createBreadcrumbs(paths)
	var html = drawBreadcrumbs(breadcrumbs)
	header.innerHTML = html
	var body = document.getElementsByTagName('body')[0]
	body.insertBefore( header, body.firstChild)
	return breadcrumbs.length
}

function createBreadcrumbs(paths) {
	var breadcrumbs = []	
	for (var index = paths.length; index > 0; index --) {
		var path = Array(paths.length-index).fill('../').join('')
		var file = 'index.html'
		if(paths[index-1].includes('.html')) {
			file = paths[index-1]
		} else if (paths[index] && paths[index].includes('.html')) {
			path = ''
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
	drawHeader()
	drawFooter()
}

window.onload = drawInterface

populateHead()
