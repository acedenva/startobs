const childProcess = require('child_process')
const request = require('request-promise-native')
const fs = require('fs')
const p = require('path')
async function getRestreamStatus () {
	let opt = {
		method: 'GET',
		url: 'https://api.younow.com/php/api/broadcast/info/curId=0/user=Drache_Offiziell',
		headers: {
			'User-Agent': 'Other'
		},
		transform: (rawbody) => {
			return JSON.parse(rawbody)
		}
	}
	let res = await request(opt)
	if (res.errorCode) {
		return false
	} else {
		return true
	}
}
function startProgram (path, args) {
	if (!args) {
		let args = []
	}
	let program = p.basename(path)
	if (p.extname(path) == '.js') {
		program = 'node ' + './' + p.basename(path)
	}
	let child = childProcess.spawn(program, args, {
		cwd: p.dirname(path),
		shell: true,
	})
	child.stdout.on('data', (data)=>{
		let logfile = p.dirname(path) + '\\logfile.txt'
		fs.appendFileSync(logfile, data + '\r\n', 'utf8')
	})
	child.stderr.on('error', (err)=>{
		let errorfile = p.dirname(path) + '\\errorfile.txt'
		fs.appendFileSync(errorfile, data + '\r\n', 'utf8')
	})
}
function startObs () {
	let obs = 'C:\\Program Files\\obs-studio\\bin\\64bit\\obs64.exe' 
	let obsArgs = [
		'--profile "drache"',
		'--scene "dracheRestreamFull"',
		//	'--startstreaming'
	]
	startProgram(obs,obsArgs)
	let translate = 'C:\\scripts\\translate\\main.js'
	if (fs.existsSync(p.dirname(translate) + '\\entries.json')){
		fs.unlinkSync(p.dirname(translate) + '\\entries.json')
	}
	startProgram(translate)
	let AutoRefresh = 'C:\\scripts\\AutoRefresh\\main.js'
	startProgram(AutoRefresh)
}
async function main () {
	if (await getRestreamStatus()) {
		startObs()
	} else {
		console.log('obs starting abort! target not online')
	}
};main()
